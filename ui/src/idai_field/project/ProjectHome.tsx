import { mdiEmail, mdiMapMarker, mdiWeb } from '@mdi/js';
import Icon from '@mdi/react';
import { Location } from 'history';
import { TFunction } from 'i18next';
import React, { CSSProperties, ReactElement, useContext, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { Document, FieldValue, getDocumentDescription, getDocumentImages, getFieldValue } from '../../api/document';
import { get } from '../../api/documents';
import { ResultDocument, ResultFilter } from '../../api/result';
import CONFIGURATION from '../../configuration.json';
import { NAVBAR_HEIGHT, SIDEBAR_WIDTH } from '../../constants';
import DocumentPermalinkButton from '../../shared/document/DocumentPermalinkButton';
import { ImageCarousel } from '../../shared/image/ImageCarousel';
import { useSearchParams } from '../../shared/location';
import { LoginContext } from '../../shared/login';
import SearchBar from '../../shared/search/SearchBar';
import CategoryFilter from '../filter/CategoryFilter';
import { getProjectLabel } from '../projects';
import { initFilters } from './Project';
import ProjectHierarchyButton from './ProjectHierarchyButton';
import ProjectMap from './ProjectMap';

const MAP_FIT_OPTIONS = { padding : [ 10, 10, 10, 10 ], duration: 500 };

export default function ProjectHome ():ReactElement {

    const { projectId } = useParams<{ projectId: string }>();
    const loginData = useContext(LoginContext);
    const searchParams = useSearchParams();
    const location = useLocation();
    const { t } = useTranslation();

    const [categoryFilter, setCategoryFilter] = useState<ResultFilter>();
    const [projectDoc, setProjectDoc] = useState<Document>();
    const [title, setTitle] = useState<string>('');
    const [images, setImages] = useState<ResultDocument[]>();
    const [highlightedCategories, setHighlightedCategories] = useState<string[]>([]);
    const [predecessors] = useState<ResultDocument[]>([]);

    useEffect(() => {

        initFilters(projectId, searchParams, loginData.token)
            .then(result => result.filters.find(filter => filter.name === 'resource.category.name'))
            .then(setCategoryFilter);

        get(projectId, loginData.token)
            .then(setProjectDoc);
    }, [projectId, loginData, searchParams]);

    useEffect(() => {

        if(projectDoc) {
            setImages(getDocumentImages(projectDoc));
            setTitle(getProjectLabel(projectDoc));
        }
    }, [projectDoc, projectId]);
 
    if (!projectDoc || !categoryFilter) return null;
    
    return (
        <div className="d-flex flex-column p-2" style={ containerStyle }>
            { renderTitle(title, projectId) }
            <div className="d-flex flex-fill pt-2" style={ { height: 0 } }>
                { renderSidebar(projectId, projectDoc, categoryFilter, setHighlightedCategories, t) }
                { renderContent(projectId, projectDoc, images, location, highlightedCategories, predecessors, t) }
            </div>
        </div>
    );
}


const renderTitle = (title: string, projectId: string) =>
    <div className="d-flex p-2 m-2" style={ headerStyle }>
        <div className="flex-fill">
            <h2><img src="/marker-icon.svg" alt="Home" style={ homeIconStyle } /> {title}</h2>
        </div>
        <div className="flex-fill text-right">
            <DocumentPermalinkButton id={ projectId } baseUrl={ CONFIGURATION.fieldUrl } type="project" />
        </div>
    </div>;


const renderSidebar = (projectId: string, projectDoc: Document, categoryFilter: ResultFilter,
        setHighlightedCategories: (categories: string[]) => void, t: TFunction) =>
    <div className="mx-2 d-flex flex-column" style={ sidebarStyles }>
        <Card className="mb-2 mt-0">
            <SearchBar basepath={ `/project/${projectId}` } />
        </Card>
        <Card className="mb-2 mt-0 p-2">
            <ProjectHierarchyButton projectDocument={ projectDoc }
                label={ t('projectHome.toHierarOverview') } />
        </Card>
        <Card className="my-0 flex-fill" style={ { height: 0 } }>
            <div className="py-1 card-header">
                <h5>{ t('projectHome.categories') }</h5>
            </div>
            <div className="flex-fill py-2" style={ filterColStyle }>
                <CategoryFilter filter={ categoryFilter } projectId={ projectId }
                    onMouseEnter={ setHighlightedCategories }
                    onMouseLeave={ setHighlightedCategories } />
            </div>
        </Card>
    </div>;


const renderContent = (projectId: string, projectDoc: Document, images: ResultDocument[], location: Location,
        highlightedCategories: string[], predecessors: ResultDocument[], t: TFunction) => {

    const description = getDocumentDescription(projectDoc);

    return <div className="flex-fill" style={ contentStyle }>
        <div className="px-2 my-1 clearfix">
            { images &&
                <div className="float-right p-2">
                    <ImageCarousel document={ projectDoc } images={ images } style={ imageCarouselStyle }
                        location={ location } maxWidth={ 600 } maxHeight={ 400 } />
                </div>
            }
            { description && renderDescription(description) }
        </div>
        <div className="d-flex">
            <div className="p-2" style={ mapContainerStyle }>
                <ProjectMap
                        selectedDocument={ projectDoc }
                        highlightedCategories={ highlightedCategories }
                        predecessors={ predecessors }
                        project={ projectId }
                        onDeselectFeature={ undefined }
                        fitOptions={ MAP_FIT_OPTIONS }
                        spinnerContainerStyle={ mapSpinnerContainerStyle }
                        isMiniMap={ true } />
            </div>
            <div className="p-2" style={ detailsContainerStyle }>
                { renderProjectDetails(projectDoc, t) }
            </div>
        </div>
    </div>;
};


const renderDescription = (description: FieldValue) =>
    description.toString()
        .split(/\r\n|\n\r|\r|\n/g)
        .filter(paragraph => paragraph.length > 0)
        .map((paragraph, i) => <p key={ i }>{ paragraph }</p>);


const renderProjectDetails = (projectDoc: Document, t: TFunction) =>
    <dl>
        <dt>{ t('projectHome.institution') }</dt>
        <dd>{ getFieldValue(projectDoc, 'parent', 'institution')?.toString() }</dd>
        <dt>{ t('projectHome.projectSupervisor') }</dt>
        <dd>{ getFieldValue(projectDoc, 'parent', 'projectSupervisor')?.toString() }</dd>
        <dt>{ t('projectHome.contactPerson') }</dt>
        <dd>
            <a href={ `mailto:${getFieldValue(projectDoc, 'parent', 'contactMail')?.toString()}` }>
                <Icon path={ mdiEmail } size={ 0.8 } className="mr-1" />
                { getFieldValue(projectDoc, 'parent', 'contactPerson')?.toString() }
            </a>
        </dd>
        <dt>{ t('projectHome.staff') }</dt>
        <dd>{ (getFieldValue(projectDoc, 'parent', 'staff') as FieldValue[]).join(', ') }</dd>
        <dt>{ t('projectHome.links') }</dt>
        <dd>
            <ul className="list-unstyled">
                <li>
                    <a href={ `${getFieldValue(projectDoc, 'parent', 'externalReference')?.toString()}` }
                            target="_blank" rel="noreferrer">
                        <Icon path={ mdiWeb } size={ 0.8 } className="mr-1" />
                        { t('projectHome.externalReference') }
                    </a>
                </li>
                <li>
                    <a href={ 'https://gazetteer.dainst.org/place/'
                            + getFieldValue(projectDoc, 'parent', 'gazId')?.toString() }
                            target="_blank" rel="noreferrer">
                        <Icon path={ mdiMapMarker } size={ 0.8 } className="mr-1" />
                        { t('projectHome.gazId') }
                    </a>
                </li>
            </ul>
        </dd>
    </dl>;


const containerStyle: CSSProperties = {
    height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
};

const headerStyle: CSSProperties = {
    color: 'var(--main-link-color)',
    borderBottom: '4px dotted var(--main-link-color)'
};

const sidebarStyles: CSSProperties = {
    width: `${SIDEBAR_WIDTH}px`,
    flexShrink: 0
};

const filterColStyle: CSSProperties = {
    overflowY: 'auto'
};

const imageCarouselStyle: CSSProperties = {
    background: '#d3d3cf',
    width: '30vw',
    maxWidth: '600px',
    height: '20vw',
    maxHeight: '400px'
};

const contentStyle: CSSProperties = {
    overflowY: 'auto'
};

const mapContainerStyle: CSSProperties = {
    flex: '1 1 50%',
    height: '30vw',
    maxHeight: '40vw',
    position: 'relative'
};

const detailsContainerStyle: CSSProperties = {
    flex: '1 1 50%'
};

const mapSpinnerContainerStyle: CSSProperties = {
    position: 'absolute',
    top: '45%',
    left: '45%',
    zIndex: 1
};

const homeIconStyle: CSSProperties = {
    height: '1.5rem',
    width: '1.5rem',
    marginTop: '-0.3rem'
};
