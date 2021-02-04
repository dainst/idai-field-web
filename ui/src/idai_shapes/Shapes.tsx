import React, { ReactElement, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import ImageView from '../shared/image/ImageView';
import { doLogout, getPersistedLogin, LoginContext } from '../shared/login';
import LoginForm from '../shared/loginform/LoginForm';
import NotFound from '../shared/NotFound';
import Browse from './browse/Browse';
import Home from './home/Home';
import ShapesNav from './navbar/ShapesNav';


export default function Shapes(): ReactElement {
    
    const [loginData, setLoginData] = useState(getPersistedLogin());

    useEffect(() => {

        document.title = 'iDAI.shapes';
    }, []);

    return (
        <BrowserRouter>
            <LoginContext.Provider value={ loginData }>
                <ShapesNav onLogout={ doLogout(setLoginData) } />
                <Switch>
                    <Route path={ '/' } exact component={ Home } />
                    <Route path={ '/document/:documentId?' } component={ Browse } />
                    <Route path={ '/login' }>
                        <LoginForm onLogin={ setLoginData } />
                    </Route>
                    <Route path="/image/:project/:id" component={ ImageView } />
                    <Route component={ NotFound } />
                </Switch>
            </LoginContext.Provider>
        </BrowserRouter>
    );
}
