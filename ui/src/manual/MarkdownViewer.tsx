import React, { CSSProperties, ElementRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Chapter } from './Manual';
import { CHAPTER_NAVIGATION_WIDTH, PADDING } from './constants';
import './MarkdownViewer.css';
import { NAVBAR_HEIGHT } from '../constants';


export default ({ markdown, chapters, setActiveChapter, manualElementRef }
                    : { markdown: string, chapters: Chapter[],
                        setActiveChapter: (activeChapter: Chapter) => void,
                        manualElementRef: ElementRef<any> }) => {

    return (
        <div ref={ manualElementRef }
             style={ markdownContainerStyle }
             onScroll={ () => updateActiveChapter(chapters, setActiveChapter) }>
            <ReactMarkdown source={ markdown } escapeHtml={ false } />
        </div>
    );
};


const updateActiveChapter = (chapters: Chapter[], setActiveChapter: (chapter: Chapter) => void) => {

    let activeElementTop: number = 1;

    chapters.forEach(chapter => {
        const top: number = getHeaderTop(chapter);
        if (top <= 0 && (top > activeElementTop || activeElementTop === 1)) {
            activeElementTop = top;
            setActiveChapter(chapter);
        }
    });
};


const getHeaderTop = (chapter: Chapter): number => {

    const element: HTMLElement | null = document.getElementById(chapter.id);
    if (!element) return 1;

    return element.getBoundingClientRect().top
        - NAVBAR_HEIGHT
        - PADDING;
};


const markdownContainerStyle: CSSProperties = {
    position: 'relative',
    left: CHAPTER_NAVIGATION_WIDTH + 'px',
    width: 'calc(100vw - ' + CHAPTER_NAVIGATION_WIDTH + 'px)',
    height: 'calc(100vh - ' + NAVBAR_HEIGHT + 'px)',
    padding: PADDING + 'px',
    overflowY: 'auto'
};
