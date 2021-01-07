import React, { ReactElement, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { LoginContext } from '../App';
import { getPersistedLogin } from '../login';
import { doLogout } from '../logout';
import ShapesNav from '../shared/navbar/ShapesNav';
import BrowseSelect from './browseselect/BrowseSelect';
import { useRouteMatch } from 'react-router-dom';

export default function Shapes(): ReactElement {
    
    const [loginData, setLoginData] = useState(getPersistedLogin());
    const match = useRouteMatch();


    useEffect(() => {

        document.title = 'iDAI.shapes';
    }, []);

    const baseUrl = match.path || '/';

    return (
        <BrowserRouter>
            <LoginContext.Provider value={ loginData }>
                <ShapesNav onLogout={ doLogout(setLoginData) } />
                <Switch>
                    <Route path={ `${baseUrl}:documentId?` } component={ BrowseSelect } />
                </Switch>
            </LoginContext.Provider>
        </BrowserRouter>
    );
}
