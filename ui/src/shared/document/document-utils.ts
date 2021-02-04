import { ResultDocument } from '../../api/result';
import CONFIGURATION from '../../configuration.json';


const IMAGE_CATEGORIES = ['Image', 'Photo', 'Drawing'];

export const getDocumentLink = (doc: ResultDocument, project: string): string =>
    isImage(doc)
    ? `/image/${project}/${doc.resource.id}`
    : isCategory(doc, 'Type') || isCategory(doc, 'TypeCatalog')
        ? `${CONFIGURATION.shapesUrl}/document/${doc.resource.id}`
        : `/project/${project}/${doc.resource.id}`;


export const getHierarchyLink = (doc: ResultDocument): string =>
    `/project/${doc.project}?parent=${doc.resource.id}`;


export const isImage = (document: ResultDocument): boolean =>
    IMAGE_CATEGORIES.includes(document.resource.category.name);


export const isCategory = (document: ResultDocument, category: string): boolean =>
    document.resource.category.name === category;
