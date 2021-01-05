import React, { useState, ReactElement, CSSProperties } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { postLogin, persistLogin, LoginData } from '../../login';
import { useTranslation } from 'react-i18next';
import { postLogin, persistLogin, LoginData } from './login';


export default function LoginForm({ onLogin }: { onLogin: (_: LoginData) => void }): ReactElement {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [loginFailed, setLoginFailed] = useState(false);
    const history = useHistory();
    const { t } = useTranslation();

    const handleSubmit = async (e: any) => {

        e.preventDefault();
        const loginData = await postLogin(user, password);
        if (loginData) {
            persistLogin(loginData);
            onLogin(loginData);
            history.push('/');
        } else {
            setLoginFailed(true);
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    { loginFailed && <Alert variant="danger" style={ alertStyle }>
                        { t('login.wrongUserNameOrPassword') }
                    </Alert> }
                    <Card style={ cardStyle }>
                        <Card.Body>
                            <Form onSubmit={ handleSubmit }>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>{ t('login.userName') }</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={ t('login.userName') }
                                        onChange={ e => setUser(e.target.value) } />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>{ t('login.password') }</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder={ t('login.password') }
                                        onChange={ e => setPassword(e.target.value) } />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    { t('login.logIn') }
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}


const cardStyle: CSSProperties = {

    backgroundColor: 'transparent'
};


const alertStyle: CSSProperties = {

    marginTop: '20px'
};
