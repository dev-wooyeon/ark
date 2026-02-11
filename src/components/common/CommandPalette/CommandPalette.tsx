'use client';

import * as React from 'react';
import {
    KBarPortal,
    KBarPositioner,
    KBarAnimator,
    KBarSearch,
    KBarResults,
    useMatches,
} from 'kbar';
import styles from './CommandPalette.module.css';

export const CommandPalette = () => {
    return (
        <KBarPortal>
            <KBarPositioner className={styles.positioner}>
                <KBarAnimator className={styles.animator}>
                    <div className={styles.searchWrapper}>
                        <KBarSearch
                            className={styles.search}
                            defaultPlaceholder="무엇을 찾으시나요?"
                        />
                        <div className={styles.shortcutHint}>ESC</div>
                    </div>
                    <RenderResults />
                </KBarAnimator>
            </KBarPositioner>
        </KBarPortal>
    );
};

function RenderResults() {
    const { results } = useMatches();

    return (
        <KBarResults
            items={results}
            onRender={({ item, active }) =>
                typeof item === 'string' ? (
                    <div className={styles.sectionHeader}>{item}</div>
                ) : (
                    <div
                        className={`${styles.resultItem} ${active ? styles.resultItemActive : ''
                            }`}
                    >
                        <div className={styles.resultContent}>
                            <div className={styles.resultName}>{item.name}</div>
                            {item.subtitle && (
                                <div className={styles.resultSubtitle}>{item.subtitle}</div>
                            )}
                        </div>
                        {item.shortcut?.length ? (
                            <div className={styles.resultShortcuts}>
                                {item.shortcut.map((sc) => (
                                    <kbd key={sc} className={styles.resultShortcut}>
                                        {sc}
                                    </kbd>
                                ))}
                            </div>
                        ) : null}
                    </div>
                )
            }
        />
    );
}
