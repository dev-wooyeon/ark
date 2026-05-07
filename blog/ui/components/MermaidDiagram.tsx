'use client';

import { useId, useEffect, useRef, useState, type MouseEvent } from 'react';
import { useTheme } from 'next-themes';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [svg, setSvg] = useState('');
  const [hasError, setHasError] = useState(false);
  const [inlineScale, setInlineScale] = useState(1);
  const [fullscreenScale, setFullscreenScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { resolvedTheme } = useTheme();
  const uniqueId = useId().replace(/:/g, '');
  const inlineHostRef = useRef<HTMLDivElement>(null);
  const fullscreenHostRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    scrollLeft: number;
    scrollTop: number;
  }>({
    dragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const MIN_SCALE = 0.6;
  const MAX_SCALE = 2.2;
  const SCALE_STEP = 0.2;

  function clampScale(value: number) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(value.toFixed(2))));
  }

  function applyScale(host: HTMLDivElement | null, scale: number) {
    if (!host) return;
    const svgEl = host.querySelector('svg');
    if (!svgEl) return;

    const dataset = svgEl.dataset as DOMStringMap;
    const widthFromDataset = Number(dataset.baseWidth ?? 0);
    const heightFromDataset = Number(dataset.baseHeight ?? 0);
    const widthFromAttr = Number(svgEl.getAttribute('width') ?? 0);
    const heightFromAttr = Number(svgEl.getAttribute('height') ?? 0);
    const widthFromViewBox = Number(svgEl.viewBox?.baseVal?.width ?? 0);
    const heightFromViewBox = Number(svgEl.viewBox?.baseVal?.height ?? 0);

    const baseWidth =
      widthFromDataset || widthFromAttr || widthFromViewBox || 900;
    const baseHeight =
      heightFromDataset || heightFromAttr || heightFromViewBox || 500;

    dataset.baseWidth = String(baseWidth);
    dataset.baseHeight = String(baseHeight);
    svgEl.style.maxWidth = 'none';
    svgEl.style.width = `${baseWidth * scale}px`;
    svgEl.style.height = `${baseHeight * scale}px`;
  }

  function handleMouseDown(event: MouseEvent<HTMLDivElement>) {
    const viewport = event.currentTarget;
    dragStateRef.current = {
      dragging: true,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
    };
  }

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;
    if (!dragState.dragging) return;

    const viewport = event.currentTarget;
    viewport.scrollLeft = dragState.scrollLeft - (event.clientX - dragState.startX);
    viewport.scrollTop = dragState.scrollTop - (event.clientY - dragState.startY);
  }

  function handleMouseUp() {
    dragStateRef.current.dragging = false;
  }

  useEffect(() => {
    let isActive = true;

    async function renderDiagram() {
      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        });

        const { svg: renderedSvg } = await mermaid.render(
          `mermaid-${uniqueId}`,
          chart
        );

        if (!isActive) return;
        setSvg(renderedSvg);
        setHasError(false);
      } catch {
        if (!isActive) return;
        setSvg('');
        setHasError(true);
      }
    }

    void renderDiagram();

    return () => {
      isActive = false;
    };
  }, [chart, resolvedTheme, uniqueId]);

  useEffect(() => {
    applyScale(inlineHostRef.current, inlineScale);
  }, [svg, inlineScale]);

  useEffect(() => {
    applyScale(fullscreenHostRef.current, fullscreenScale);
  }, [svg, fullscreenScale, isFullscreen]);

  if (hasError) {
    return (
      <pre className="mermaid-fallback">
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <>
      <div className="mermaid-shell">
        <div className="mermaid-toolbar">
          <button
            type="button"
            className="mermaid-btn"
            onClick={() => setInlineScale((prev) => clampScale(prev - SCALE_STEP))}
          >
            -
          </button>
          <button
            type="button"
            className="mermaid-btn"
            onClick={() => setInlineScale((prev) => clampScale(prev + SCALE_STEP))}
          >
            +
          </button>
          <button
            type="button"
            className="mermaid-btn"
            onClick={() => setInlineScale(1)}
          >
            Reset
          </button>
          <span className="mermaid-zoom-label">{Math.round(inlineScale * 100)}%</span>
          <button
            type="button"
            className="mermaid-btn mermaid-btn-primary"
            onClick={() => setIsFullscreen(true)}
          >
            전체화면
          </button>
        </div>

        <div
          className="mermaid-viewport"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            ref={inlineHostRef}
            className="mermaid-diagram"
            aria-label="Mermaid diagram"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>

      {isFullscreen && (
        <div className="mermaid-modal" role="dialog" aria-modal="true">
          <div className="mermaid-modal-panel">
            <div className="mermaid-toolbar">
              <button
                type="button"
                className="mermaid-btn"
                onClick={() =>
                  setFullscreenScale((prev) => clampScale(prev - SCALE_STEP))
                }
              >
                -
              </button>
              <button
                type="button"
                className="mermaid-btn"
                onClick={() =>
                  setFullscreenScale((prev) => clampScale(prev + SCALE_STEP))
                }
              >
                +
              </button>
              <button
                type="button"
                className="mermaid-btn"
                onClick={() => setFullscreenScale(1)}
              >
                Reset
              </button>
              <span className="mermaid-zoom-label">
                {Math.round(fullscreenScale * 100)}%
              </span>
              <button
                type="button"
                className="mermaid-btn mermaid-btn-primary"
                onClick={() => setIsFullscreen(false)}
              >
                닫기
              </button>
            </div>

            <div
              className="mermaid-viewport mermaid-viewport-fullscreen"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                ref={fullscreenHostRef}
                className="mermaid-diagram"
                aria-label="Mermaid diagram fullscreen"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
