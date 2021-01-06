import React, { ReactElement, useState, useContext, useEffect } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Document } from '../../api/document';
import Icon from '@mdi/react';
import { mdiMenuRight } from '@mdi/js';
import { dropdownStyle } from './styles';
import { get } from '../../api/documents';
import { getNavItemClass } from './NavbarHoc';
import { LoginContext } from '../../App';
import NavbarHoc, { NavBarProps } from './NavbarHoc';

export default ({ onLogout}: NavBarProps): ReactElement => {

    const [projectDocument, setProjectDocument] = useState<Document>(null);
    const location = useLocation();
    const loginData = useContext(LoginContext);
    const history = useHistory();
    const { t } = useTranslation();

    useEffect(() => {

        const projectId: string | undefined = getProjectId(location);
        if (projectId) get(projectId, loginData.token).then(setProjectDocument);
    }, [location, loginData]);

    const NavItemClass = (route: string) => getNavItemClass(route, getCurrentRoute(location, projectDocument));


    return (
        <NavbarHoc onLogout={ onLogout} basepath= "/" brand= "field">
            <>
                <Nav activeKey={ location.pathname } className="mr-auto">
                    <Nav.Link as="span">
                        <Link to="/" className={ NavItemClass('overview') }>
                            { t('navbar.projects') }
                        </Link>
                    </Nav.Link>
                    {
                        projectDocument && <>
                            <Icon path={ mdiMenuRight } size={ 1 } className="navbar-project-arrow" />
                            <Nav.Link as="span">
                                <Link to={ `/project/${projectDocument.resource.id}` }
                                    className={ NavItemClass('project') }>
                                    { projectDocument.resource.identifier }
                                </Link>
                            </Nav.Link>
                        </>
                    }
                </Nav>
                <Nav className="justify-content-end">
                    <NavDropdown id="desktop-dropdown" as="span"
                                className={ NavItemClass('desktop') }
                                title={ t('navbar.desktop') }
                                style={ dropdownStyle }>
                        <NavDropdown.Item onClick={ () => history.push('/download') } >
                            { t('navbar.download') }
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={ () => history.push('/manual') }>
                            { t('navbar.manual') }
                        </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as="span">
                        <Link to="/contact" className={ NavItemClass('contact') }>
                            { t('navbar.contact') }
                        </Link>
                    </Nav.Link>
                </Nav>
            </>
        </NavbarHoc>
    );
};


const getProjectId = (location: any): string | undefined => {

    return location.pathname.startsWith('/project/')
        ? location.pathname.split('/')[2]
        : undefined;
};

const getCurrentRoute = (location: any, projectDocument?: Document): string => {

    if (projectDocument && location.pathname.startsWith('/project/')
            && location.pathname.split('/')[2] === projectDocument.resource.id) {
        return 'project';
    } else if (location.pathname.startsWith('/download') || location.pathname.startsWith('/manual')) {
        return 'desktop';
    } else if (location.pathname.startsWith('/contact')) {
        return 'contact';
    } else if (location.pathname.startsWith('/login')) {
        return 'login';
    } else {
        return 'overview';
    }
};