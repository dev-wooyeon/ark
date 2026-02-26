import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { resetDomState, setWindowScrollY } from '../../__tests__/dom-mocks';
import { ScrollWorkflow } from './ScrollWorkflow';

function createSection(id: string, top: number) {
  const section = document.createElement('section');
  section.id = id;
  section.getBoundingClientRect = () => ({
    top: top - window.scrollY,
  } as DOMRect);
  document.body.appendChild(section);
  return section;
}

describe('ScrollWorkflow', () => {
  it('renders first step and updates to final step while scrolling down', () => {
    resetDomState();
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 800,
    });

    document.body.innerHTML = '';
    createSection('5-knowledge-stack을-분리한-이유', 1000);
    createSection('6-현재-운영하는-workflow', 1600);
    createSection('7-내-환경에서-실제로-쓰는-homebrew-도구', 2200);

    setWindowScrollY(0);
    render(<ScrollWorkflow />);

    expect(screen.getByText('Step 1/8')).toBeInTheDocument();
    expect(screen.getAllByText('Atlas Research')).toHaveLength(2);

    act(() => {
      setWindowScrollY(1700);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByText('Step 8/8')).toBeInTheDocument();
    expect(screen.getAllByText('Warp CLI 운영·배포 작업')).toHaveLength(2);
  });

  it('falls back safely when workflow sections are missing', () => {
    resetDomState();
    document.body.innerHTML = '';
    createSection('6-현재-운영하는-workflow', 1200);
    createSection('7-내-환경에서-실제로-쓰는-homebrew-도구', 1700);

    setWindowScrollY(0);
    render(<ScrollWorkflow />);

    expect(screen.getByText('Step 1/8')).toBeInTheDocument();

    act(() => {
      setWindowScrollY(300);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByText('Step 1/8')).toBeInTheDocument();
  });
});
