import React, { ReactElement, useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import BaseNav, { BaseNavProps } from '../../shared/navbar/BaseNav';
import SearchBar from '../../shared/search/SearchBar';


export default function ShapesNav({ onLogout }: BaseNavProps): ReactElement {

    const location = useLocation();
    const [showSearchBar, setSearchBar] = useState<boolean>(false);

    useEffect(() => {
        setSearchBar(window.location.pathname !== '/idaishapes/');
    }, [location]);

    return (
        <BaseNav onLogout={ onLogout } brand="shapes" brandUrl="/idaishapes">
            <Nav className="mr-auto">
                { showSearchBar && <SearchBar basepath="/idaishapes/document/" /> }
            </Nav>
        </BaseNav>
    );
}
