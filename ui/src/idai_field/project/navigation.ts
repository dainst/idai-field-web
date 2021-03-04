import { Document } from '../../api/document';
import { ResultDocument } from '../../api/result';


export const getMapDeselectionUrl = (projectId: string, searchParams: URLSearchParams, document: Document): string => {

    return searchParams.has('q')
        ? getProjectSearchResultsUrl(projectId, searchParams)
        : getContextUrl(projectId, searchParams, document);
};


export const getContextUrl = (projectId: string, searchParams: URLSearchParams, document: Document): string => {

    const parentId: string = searchParams.get('r') === 'children'
        ? (document.resource.category.name === 'Project' ? undefined : document.resource.id)
        : document.resource.parentId;

    return `/project/${projectId}?parent=${parentId ?? 'root'}`;
};


export const getProjectSearchResultsUrl = (projectId: string, searchParams: URLSearchParams): string => {

    searchParams.delete('r');
    return `/project/${projectId}?${searchParams.toString()}`;
};
