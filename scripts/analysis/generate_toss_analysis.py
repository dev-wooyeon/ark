#!/usr/bin/env python3
"""Build a structured dataset from the Toss article corpus list."""

from __future__ import annotations

import json
import re
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[2]
CORPUS_MD = ROOT / "docs/toss-uiux-fe-ds-article-corpus.md"
OUT_JSONL = ROOT / "docs/toss-uiux-fe-ds-analysis-data.jsonl"
OUT_SUMMARY = ROOT / "docs/toss-uiux-fe-ds-analysis-summary.json"

KEYWORDS = {
    "uiux": [
        "ux",
        "ui",
        "사용자",
        "인터랙션",
        "리서치",
        "문구",
        "에러",
        "리옵스",
        "디자인",
        "접근성",
    ],
    "frontend": [
        "frontend",
        "프론트엔드",
        "react",
        "react native",
        "web",
        "배포",
        "테스트",
        "eslint",
        "sdk",
        "코드 리뷰",
    ],
    "design_system": [
        "design system",
        "디자인 시스템",
        "token",
        "토큰",
        "tds",
        "컬러 시스템",
        "컴포넌트",
        "component",
    ],
    "quality": [
        "품질",
        "테스트",
        "qa",
        "e2e",
        "안정화",
        "신뢰성",
        "회귀",
        "로깅",
        "모니터링",
    ],
}


@dataclass
class ArticleRecord:
    url: str
    title: str
    word_count: int
    category_scores: dict[str, int]
    top_keywords: list[str]
    excerpt: str


def extract_urls(markdown: str) -> list[str]:
    return sorted(set(re.findall(r"https://toss\.tech/article/[A-Za-z0-9_-]+", markdown)))


def tokenize(text: str) -> list[str]:
    # Keep English words and Korean blocks.
    return re.findall(r"[A-Za-z][A-Za-z0-9_-]{2,}|[가-힣]{2,}", text)


def fetch_article(url: str) -> ArticleRecord | None:
    try:
        resp = requests.get(url, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
    except requests.RequestException:
        return None
    if resp.status_code != 200:
        return None

    soup = BeautifulSoup(resp.text, "html.parser")
    title = ""
    if soup.find("h1"):
        title = soup.find("h1").get_text(" ", strip=True)
    elif soup.title:
        title = soup.title.get_text(" ", strip=True)

    article_node = soup.find("article")
    full_text = article_node.get_text(" ", strip=True) if article_node else soup.get_text(" ", strip=True)
    normalized = re.sub(r"\s+", " ", full_text).strip()
    words = tokenize(normalized)
    lowered = normalized.lower()

    scores: dict[str, int] = {}
    for category, kws in KEYWORDS.items():
        scores[category] = sum(1 for kw in kws if kw in lowered)

    token_freq: dict[str, int] = {}
    for token in words:
        key = token.lower()
        if len(key) < 3:
            continue
        token_freq[key] = token_freq.get(key, 0) + 1

    top_keywords = [k for k, _ in sorted(token_freq.items(), key=lambda item: item[1], reverse=True)[:12]]
    excerpt = " ".join(words[:120])

    return ArticleRecord(
        url=url,
        title=title,
        word_count=len(words),
        category_scores=scores,
        top_keywords=top_keywords,
        excerpt=excerpt,
    )


def generate(records: Iterable[ArticleRecord]) -> tuple[list[dict], dict]:
    rows = [r.__dict__ for r in records]
    category_totals: dict[str, int] = {key: 0 for key in KEYWORDS}
    for row in rows:
        for cat, score in row["category_scores"].items():
            category_totals[cat] += score

    summary = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "article_count": len(rows),
        "category_totals": category_totals,
        "avg_word_count": round(sum(r["word_count"] for r in rows) / max(1, len(rows)), 2),
        "max_word_count": max((r["word_count"] for r in rows), default=0),
        "min_word_count": min((r["word_count"] for r in rows), default=0),
    }
    return rows, summary


def main() -> None:
    corpus = CORPUS_MD.read_text(encoding="utf-8")
    urls = extract_urls(corpus)
    print(f"input URLs: {len(urls)}")

    records: list[ArticleRecord] = []
    with ThreadPoolExecutor(max_workers=16) as executor:
        for result in executor.map(fetch_article, urls):
            if result:
                records.append(result)

    rows, summary = generate(records)
    rows.sort(key=lambda row: row["url"])

    with OUT_JSONL.open("w", encoding="utf-8") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    OUT_SUMMARY.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"saved: {OUT_JSONL}")
    print(f"saved: {OUT_SUMMARY}")
    print(f"processed: {summary['article_count']}")


if __name__ == "__main__":
    main()
