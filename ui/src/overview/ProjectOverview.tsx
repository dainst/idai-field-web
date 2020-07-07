import React, { useEffect, useState } from 'react';
import Map from './Map';
import { search } from '../api/documents';
import { Alert } from 'react-bootstrap';
import { Document } from '../api/result';


export default () => {

    const [projectDocuments, setProjectDocuments] = useState<Document[]>([]);
    const [error, setError] = useState(false);

    useEffect (() => {
        getProjectDocuments()
            .then(setProjectDocuments)
            .catch(err => setError(err));
    }, []);

    return (
        <div>
            { error ? renderError(error) : renderMap(projectDocuments)}
        </div>
    );
};


const renderError = (error: any) => <Alert variant="danger">Backend not available!</Alert>;


const renderMap = (projectDocuments: any) => <Map documents={ projectDocuments }></Map>;


const getProjectDocuments = async (): Promise<Document[]> => (await search({ q: 'resource.type:Project' })).documents;
