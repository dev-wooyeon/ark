#!/usr/bin/env python3
"""Build NEKARACUBA benchmark corpus for frontend/UIUX/design analysis."""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlparse, urlunparse
from xml.etree import ElementTree as ET

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[2]
OUT_JSONL = ROOT / "docs/benchmark-nekaracuba-corpus-2026.jsonl"
OUT_SUMMARY_MD = ROOT / "docs/benchmark-nekaracuba-summary-2026.md"

TARGET_COUNT = 100
MIN_PER_COMPANY = 15
TIMEOUT = 20
USER_AGENT = "Mozilla/5.0 (compatible; eunu-log-corpus-bot/1.0)"

COMPANY_ORDER = ["NAVER", "KAKAO", "LINE", "COUPANG", "BAEMIN"]

TOPIC_KEYWORDS = {
    "frontend": [
        "frontend",
        "front-end",
        "프론트엔드",
        "web",
        "react",
        "next.js",
        "javascript",
        "typescript",
        "ui 개발",
        "client",
    ],
    "uiux": [
        "ux",
        "ui",
        "사용자 경험",
        "접근성",
        "a11y",
        "인터랙션",
        "usability",
        "research",
    ],
    "design": [
        "design",
        "디자인",
        "design system",
        "디자인 시스템",
        "token",
        "토큰",
        "컴포넌트",
        "component",
    ],
}

DEFAULT_HEADERS = {"User-Agent": USER_AGENT}


@dataclass
class Record:
    company: str
    source: str
    title: str
    link: str
    date: str
    topic: str
    tags: list[str]
    evidence: str


def normalize_url(url: str) -> str:
    parsed = urlparse(url.strip())
    netloc = parsed.netloc.lower()
    path = re.sub(r"/+", "/", parsed.path).rstrip("/")
    if not path:
        path = "/"
    return urlunparse((parsed.scheme, netloc, path, "", "", ""))


def to_iso_datetime(value: str | None) -> str:
    if not value:
        return "1970-01-01T00:00:00+00:00"
    value = value.strip()
    if not value:
        return "1970-01-01T00:00:00+00:00"
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).isoformat()
    except ValueError:
        pass
    try:
        dt = parsedate_to_datetime(value)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).isoformat()
    except (TypeError, ValueError):
        return "1970-01-01T00:00:00+00:00"


def infer_topic(title: str, tags: list[str]) -> str:
    haystack = f"{title} {' '.join(tags)}".lower()
    scores: dict[str, int] = {}
    for topic, keywords in TOPIC_KEYWORDS.items():
        scores[topic] = sum(1 for kw in keywords if kw in haystack)
    best_topic = max(scores, key=scores.get)
    if scores[best_topic] == 0:
        return "other"
    return best_topic


def get_json(url: str) -> Any:
    response = requests.get(url, headers=DEFAULT_HEADERS, timeout=TIMEOUT)
    response.raise_for_status()
    return response.json()


def get_text(url: str) -> str:
    response = requests.get(url, headers=DEFAULT_HEADERS, timeout=TIMEOUT)
    response.raise_for_status()
    return response.text


def fetch_naver_records() -> list[Record]:
    xml_text = get_text("https://d2.naver.com/d2.atom")
    root = ET.fromstring(xml_text)
    ns = {"atom": "http://www.w3.org/2005/Atom"}
    records: list[Record] = []
    for entry in root.findall("atom:entry", ns):
        title = (entry.findtext("atom:title", default="", namespaces=ns) or "").strip()
        link_node = entry.find("atom:link", ns)
        link = (link_node.attrib.get("href", "").strip() if link_node is not None else "")
        updated = entry.findtext("atom:updated", default="", namespaces=ns)
        category = entry.find("atom:category", ns)
        tags = [category.attrib.get("term", "").strip()] if category is not None else []
        tags = [t for t in tags if t]
        if not title or not link:
            continue
        topic = infer_topic(title, tags)
        records.append(
            Record(
                company="NAVER",
                source="D2",
                title=title,
                link=normalize_url(link),
                date=to_iso_datetime(updated),
                topic=topic,
                tags=tags,
                evidence=f"title={title}",
            )
        )
    return records


def fetch_kakao_records() -> list[Record]:
    contents = get_json("https://if.kakao.com/api/v1/contents")
    event = get_json("https://if.kakao.com/api/v1/events/2025")
    event_start = event.get("data", {}).get("event", {}).get("startDate", "2025-01-01")
    content_map = contents.get("data", {}).get("contentMap", {})
    records: list[Record] = []
    for slot_items in content_map.values():
        if not isinstance(slot_items, list):
            continue
        for item in slot_items:
            seq = item.get("seq")
            title = (item.get("title") or "").strip()
            tags = [str(tag.get("name", "")).strip() for tag in item.get("tags", []) if tag.get("name")]
            category_names = [
                str(category.get("name", "")).strip()
                for category in item.get("categories", [])
                if category.get("name")
            ]
            merged_tags = [*tags, *category_names, item.get("typeOptionName", "")]
            merged_tags = [t for t in merged_tags if t]
            if not seq or not title:
                continue
            link = normalize_url(f"https://if.kakao.com/session/{seq}")
            topic = infer_topic(title, merged_tags)
            records.append(
                Record(
                    company="KAKAO",
                    source="if(kakao)",
                    title=title,
                    link=link,
                    date=to_iso_datetime(f"{event_start}T00:00:00+09:00"),
                    topic=topic,
                    tags=merged_tags,
                    evidence=f"sessionId={seq}",
                )
            )
    return records


def extract_line_links(html: str, locale: str) -> list[str]:
    pattern = rf'href="/{locale}/blog/([^"/]+)/"'
    slugs = set(re.findall(pattern, html))
    filtered = sorted(
        slug
        for slug in slugs
        if not slug.startswith(("author", "tag", "page"))
        and slug not in {"blog", "culture", "opensource", "careers"}
    )
    return [normalize_url(f"https://engineering.linecorp.com/{locale}/blog/{slug}") for slug in filtered]


def fetch_line_records() -> list[Record]:
    records: list[Record] = []
    seen_links: set[str] = set()
    for locale in ("en", "ko"):
        for page in range(1, 13):
            url = (
                f"https://engineering.linecorp.com/{locale}/blog"
                if page == 1
                else f"https://engineering.linecorp.com/{locale}/blog/page/{page}"
            )
            html = get_text(url)
            links = extract_line_links(html, locale)
            for link in links:
                if link in seen_links:
                    continue
                seen_links.add(link)
                slug = link.rstrip("/").split("/")[-1]
                title = slug.replace("-", " ").strip()
                topic = infer_topic(title, [])
                records.append(
                    Record(
                        company="LINE",
                        source="LINE Engineering Blog",
                        title=title,
                        link=link,
                        date="1970-01-01T00:00:00+00:00",
                        topic=topic,
                        tags=[locale],
                        evidence=f"slug={slug}",
                    )
                )
    return records


def fetch_coupang_records() -> list[Record]:
    xml_text = get_text("https://medium.com/feed/coupang-engineering")
    soup = BeautifulSoup(xml_text, "xml")
    records: list[Record] = []
    channel = soup.find("channel")
    if channel is None:
        return records
    for item in channel.find_all("item"):
        title = (item.find("title").text if item.find("title") else "").strip()
        link = (item.find("link").text if item.find("link") else "").strip()
        pub_date = (item.find("pubDate").text if item.find("pubDate") else "").strip()
        categories = [(category.text or "").strip() for category in item.find_all("category")]
        categories = [c for c in categories if c]
        if not title or not link:
            continue
        clean_link = normalize_url(link.split("?")[0])
        topic = infer_topic(title, categories)
        records.append(
            Record(
                company="COUPANG",
                source="Coupang Engineering (Medium)",
                title=title,
                link=clean_link,
                date=to_iso_datetime(pub_date),
                topic=topic,
                tags=categories,
                evidence=f"title={title}",
            )
        )
    return records


def fetch_baemin_records() -> list[Record]:
    records: list[Record] = []
    page = 1
    while True:
        url = (
            "https://techblog.woowahan.com/wp-json/wp/v2/posts"
            "?per_page=100&page="
            f"{page}&_fields=id,date,link,title"
        )
        response = requests.get(url, headers=DEFAULT_HEADERS, timeout=TIMEOUT)
        if response.status_code != 200:
            break
        data = response.json()
        if not data:
            break
        for item in data:
            title = (item.get("title", {}).get("rendered", "") or "").strip()
            link = (item.get("link") or "").strip()
            date = (item.get("date") or "").strip()
            if not title or not link:
                continue
            topic = infer_topic(title, [])
            records.append(
                Record(
                    company="BAEMIN",
                    source="Woowahan Tech Blog",
                    title=title,
                    link=normalize_url(link),
                    date=to_iso_datetime(date),
                    topic=topic,
                    tags=[],
                    evidence=f"postId={item.get('id')}",
                )
            )
        page += 1
        if page > 10:
            break
    return records


def dedupe_records(records: list[Record]) -> list[Record]:
    seen: set[str] = set()
    deduped: list[Record] = []
    for record in records:
        key = record.link
        if key in seen:
            continue
        seen.add(key)
        deduped.append(record)
    return deduped


def sort_records(records: list[Record]) -> list[Record]:
    return sorted(records, key=lambda r: (r.date, r.title), reverse=True)


def select_records(company_map: dict[str, list[Record]]) -> list[Record]:
    selected: list[Record] = []
    selected_links: set[str] = set()

    for company in COMPANY_ORDER:
        candidates = company_map.get(company, [])
        taken = 0
        for record in candidates:
            if record.link in selected_links:
                continue
            selected.append(record)
            selected_links.add(record.link)
            taken += 1
            if taken >= MIN_PER_COMPANY:
                break

    if len(selected) >= TARGET_COUNT:
        return selected[:TARGET_COUNT]

    extras: list[Record] = []
    for company in COMPANY_ORDER:
        for record in company_map.get(company, []):
            if record.link in selected_links:
                continue
            extras.append(record)

    extras = sort_records(extras)
    for record in extras:
        if len(selected) >= TARGET_COUNT:
            break
        if record.link in selected_links:
            continue
        selected.append(record)
        selected_links.add(record.link)

    return selected[:TARGET_COUNT]


def write_jsonl(records: list[Record]) -> None:
    with OUT_JSONL.open("w", encoding="utf-8") as file:
        for record in records:
            file.write(
                json.dumps(
                    {
                        "company": record.company,
                        "source": record.source,
                        "title": record.title,
                        "link": record.link,
                        "date": record.date,
                        "topic": record.topic,
                        "tags": record.tags,
                        "pattern": "",
                        "evidence": record.evidence,
                    },
                    ensure_ascii=False,
                )
                + "\n"
            )


def write_summary(
    all_company_counts: dict[str, int],
    selected_records: list[Record],
) -> None:
    selected_company_counts = Counter(record.company for record in selected_records)
    selected_topic_counts = Counter(record.topic for record in selected_records)
    timestamp = datetime.now(timezone.utc).isoformat()

    lines: list[str] = []
    lines.append("# NEKARACUBA Benchmark Summary")
    lines.append("")
    lines.append(f"- generated_at_utc: `{timestamp}`")
    lines.append(f"- target_count: `{TARGET_COUNT}`")
    lines.append(f"- selected_count: `{len(selected_records)}`")
    lines.append(f"- min_per_company_target: `{MIN_PER_COMPANY}`")
    lines.append("")
    lines.append("## Coverage (Collected)")
    lines.append("")
    for company in COMPANY_ORDER:
        lines.append(f"- {company}: {all_company_counts.get(company, 0)}")
    lines.append("")
    lines.append("## Coverage (Selected)")
    lines.append("")
    for company in COMPANY_ORDER:
        lines.append(f"- {company}: {selected_company_counts.get(company, 0)}")
    lines.append("")
    lines.append("## Topic Distribution (Selected)")
    lines.append("")
    for topic, count in sorted(selected_topic_counts.items(), key=lambda item: item[1], reverse=True):
        lines.append(f"- {topic}: {count}")
    lines.append("")
    lines.append("## Data Files")
    lines.append("")
    lines.append(f"- `{OUT_JSONL}`")
    lines.append(f"- `{OUT_SUMMARY_MD}`")
    lines.append("")
    lines.append("## Notes")
    lines.append("")
    lines.append("- `LINE`은 페이지 크롤링 기반이라 일부 문서는 날짜 정보가 없고, `1970-01-01`로 표준화됩니다.")
    lines.append("- `KAKAO`는 `if.kakao` 공개 API(`/api/v1/contents`)에서 세션 메타데이터를 수집합니다.")
    lines.append("- `COUPANG`은 Medium RSS 기반이며 링크 query string은 제거합니다.")

    OUT_SUMMARY_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    source_records = {
        "NAVER": dedupe_records(sort_records(fetch_naver_records())),
        "KAKAO": dedupe_records(sort_records(fetch_kakao_records())),
        "LINE": dedupe_records(sort_records(fetch_line_records())),
        "COUPANG": dedupe_records(sort_records(fetch_coupang_records())),
        "BAEMIN": dedupe_records(sort_records(fetch_baemin_records())),
    }

    all_company_counts = {company: len(records) for company, records in source_records.items()}
    selected_records = select_records(source_records)
    selected_records = dedupe_records(sort_records(selected_records))
    selected_records = selected_records[:TARGET_COUNT]

    write_jsonl(selected_records)
    write_summary(all_company_counts, selected_records)

    selected_company_counts = Counter(record.company for record in selected_records)
    print("saved:", OUT_JSONL)
    print("saved:", OUT_SUMMARY_MD)
    print("selected:", len(selected_records))
    for company in COMPANY_ORDER:
        print(f"{company}: {selected_company_counts.get(company, 0)} / collected {all_company_counts.get(company, 0)}")


if __name__ == "__main__":
    main()
