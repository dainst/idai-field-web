import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocumentDetails from './DocumentDetails';
import { Container } from 'react-bootstrap';
import { get } from '../api/documents';
import { Document } from '../api/document';

export default () => {

    const { id } = useParams();
    const [document, setDocument] = useState<Document>(null);
    const [error, setError] = useState(null);

    useEffect (() => {
        get(id)
            .then(setDocument)
            .catch(setError);
    }, [id]);

    return (document && document.resource)
        ? <Container>{ renderDocument(document) }</Container>
        : error
            ? renderError(error)
            : null;
};


const renderDocument = (document: any) => <DocumentDetails document={ document } />;


const renderError = (error: any) => <Container fluid>Error: { error.error }</Container>;
