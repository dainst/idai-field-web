import { TFunction } from 'i18next';
import React, { CSSProperties, ReactElement, ReactNode } from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ResultDocument } from '../../api/result';
import DocumentThumbnail from '../document/DocumentThumbnail';


interface DocumentGridProps {
    documents: ResultDocument[];
    getLinkUrl: (id: string) => string;
}


export default function DocumentGrid({ documents, getLinkUrl }: DocumentGridProps): ReactElement {
    
    const { t } = useTranslation();
    
    if (documents) {
        return (
            <div className="d-flex flex-wrap">
                { documents.length === 0
                    ? renderEmptyResult(t)
                    : renderDocuments(documents, getLinkUrl)
                }
            </div>
        );
    } else {
        return null;
    }
}


const renderDocuments = (documents: ResultDocument[], getLinkUrl: (id: string) => string): ReactNode =>
    documents.map((document) => renderDocument(document, getLinkUrl));


const renderDocument = (document: ResultDocument, getLinkUrl: (id: string) => string): ReactElement =>
    <div key={ document.resource.id } style={ documentBoxStyle } className="p-1 mr-2 mb-2">
        <DocumentThumbnail
            document={ document }
            linkUrl={ getLinkUrl(document.resource.id) }
            imageUrl="" />
    </div>;


const renderEmptyResult = (t: TFunction): ReactElement =>
    <Card className="documents-card">
        <Card.Body className="px-0 py-0">
            <div className="text-center mt-sm-5 mb-sm-5"><em>{ t('project.noResults') }</em></div>
        </Card.Body>
    </Card>;


const documentBoxStyle: CSSProperties = {
    width: '230px',
    height: '230px',
    backgroundColor: '#fff'
};
