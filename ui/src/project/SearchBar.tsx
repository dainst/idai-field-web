import React, { useState, FormEvent, ReactElement } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';

export default function SearchBar({ projectId }: { projectId: string }): ReactElement {

    const [queryString, setQueryString] = useState('');
    const history = useHistory();
    
    const submitSearch = (e: FormEvent): void => {

        e.preventDefault();
        history.push(`/project/${projectId}?q=${queryString}`);
    };

    return (
        <Card>
            <Form onSubmit={ submitSearch }>
                <InputGroup>
                    <Form.Control
                        autoFocus={ true }
                        type="text"
                        placeholder="Suche"
                        onChange={ e => setQueryString(e.target.value) } />
                    <InputGroup.Append>
                        <Button variant="primary" type="submit">
                            <Icon path={ mdiMagnify } size={ 0.8 } />
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
        </Card>
    );
}
