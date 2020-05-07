import { Chapter } from './Manual';


export const loadManual = async (url: string): Promise<{ markdown: string, chapters: Chapter[] }> => {

    const markdownText: string = setHeadingIds(fixImageLinks(await loadMarkdown(url), url));

    return {
        markdown: markdownText,
        chapters: getChapters(markdownText)
    };
};


const loadMarkdown = (url: string): Promise<string> => {

    return new Promise<string>(resolve => {
        const request = new XMLHttpRequest();
        request.addEventListener('load', () => resolve(request.response));
        request.open('GET', `${url}/manual.de.md`);
        request.send();
    });
};


const setHeadingIds = (markdown: string): string => {

    return markdown.replace(
        /(^|\n)## .*\n/g,
        (text: string) => {
            const heading: string = text
                .replace('## ', '')
                .replace(/\n/g, '');
            const id: string = heading.replace(' ', '-').toLowerCase();
            return `<h2 id="${id}">${heading}</h2>\n`;
        }
    );
};


const getChapters = (markdown: string): Chapter[] => {

    const matches = markdown.match(/<h2 id=".*">.*<\/h2>/g);

    return matches.map(match => {
        const result = /<h2 id="(.*)">(.*)<\/h2>/g.exec(match);
        return {
            id: result[1],
            label: result[2]
        };
    });
};


const fixImageLinks = (markdown: string, url: string): string => {

    return markdown.replace(
        /img src="images/g,
        `img src="${url}/images`
    );
};
