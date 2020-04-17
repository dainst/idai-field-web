import React, { FormEvent, CSSProperties } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';


const inputGroupStyle: CSSProperties = {
    zIndex: 1,
    position: 'absolute',
    width: '300px',
    margin: '1em'
}


export default (props: {onSubmit: (query: string) => void}) => {

    let query = '';

    const submit = (event: FormEvent) => {
        event.preventDefault();
        props.onSubmit(query);
    }

    return (
        <Form onSubmit={submit}>
            <InputGroup style={inputGroupStyle}>
                <FormControl
                    autoFocus
                    placeholder="Suchen ..."
                    aria-label="Suchbegriff"
                    onChange={(event: any) => query = event.target.value}
                />
                <InputGroup.Append>
                    <Button variant="secondary" type="submit">
                        <Icon path={mdiMagnify} size={0.8}/>
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );

}