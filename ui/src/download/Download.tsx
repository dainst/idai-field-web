import React, { CSSProperties, useEffect, useState, ReactElement, ReactNode } from 'react';
import { Carousel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Icon from '@mdi/react';
import { mdiApple, mdiMicrosoftWindows, mdiDownload, mdiGithub } from '@mdi/js';
import './Download.css';
import { NAVBAR_HEIGHT } from '../constants';


type Slide = { imageUrl: string, description: string };


export default function Download(): ReactElement {

    const [latestVersion, setLatestVersion] = useState('');
    const { t } = useTranslation();

    useEffect (() => {
        getLatestVersion().then(setLatestVersion);
    }, []);

    return (
        <div style={ pageStyle } className="download-view">
            { getCarousel(t) }
            { getDownloadSection(latestVersion, t) }
        </div>
    );
}


const getCarousel = (t: TFunction): ReactNode => {

    return (
        <div style={ carouselContainerStyle } className="mt-5">
            <Carousel>
                { getCarouselItems(t) }
            </Carousel>
        </div>
    );
};


const getCarouselItems = (t: TFunction): ReactNode => {

    const slides: Slide[] = [
        {
            imageUrl: 'https://raw.githubusercontent.com/dainst/idai-field/master/img/README-FEATURES-1.png',
            description: t('download.slides.metadataEditor')
        },
        {
            imageUrl: 'https://raw.githubusercontent.com/dainst/idai-field/master/img/README-FEATURES-2.png',
            description: t('download.slides.geodataEditor')
        },
        {
            imageUrl: 'https://raw.githubusercontent.com/dainst/idai-field/master/img/README-FEATURES-8.png',
            description: t('download.slides.matrixView')
        },
        {
            imageUrl: 'https://raw.githubusercontent.com/dainst/idai-field/master/img/README-FEATURES-6.png',
            description: t('download.slides.synchronization')
        },
        {
            imageUrl: 'https://raw.githubusercontent.com/dainst/idai-field/master/img/README-FEATURES-3.png',
            description: t('download.slides.tableView')
        },
        {
            imageUrl: 'https://raw.githubusercontent.com/dainst/idai-field/master/img/README-FEATURES-4.png',
            description: t('download.slides.nesting')
        }
    ];

    return slides.map(slide => {
       return (
           <Carousel.Item key={ slide.imageUrl }>
               <img src={ slide.imageUrl } alt="Screenshot" />
               <Carousel.Caption>
                   <h3>{ slide.description }</h3>
               </Carousel.Caption>
           </Carousel.Item>
       );
    });
};


const getDownloadSection = (latestVersion: string, t: TFunction): ReactNode => {

    if (latestVersion === '') return;

    return (
        <div style={ downloadContainerStyle }>
            <hr className="m-5"/>
            <h1>{ t('download.download') }</h1>
            <p className="lead text-muted">{ t('download.downloadInfo') }</p>
            <p>{ t('download.packageInfo') }</p>
            <p>{ t('download.currentVersion') } <strong>{ latestVersion }</strong></p>
            <p>
                <a href={ 'https://github.com/dainst/idai-field/releases/download/v' + latestVersion + '/iDAI.field-'
                + latestVersion + '-Windows.exe' } className="btn btn-primary my-2 mr-1">
                    <Icon path={ mdiMicrosoftWindows } size={ 0.8 } className="windows-icon"/>
                    { t('download.windows') }
                    <Icon path={ mdiDownload } size={ 0.8 } className="download-icon"/>
                </a>
                <a href={ 'https://github.com/dainst/idai-field/releases/download/v' + latestVersion + '/iDAI.field-'
                + latestVersion + '-MacOS.dmg' } className="btn btn-primary my-2">
                    <Icon path={ mdiApple } size={ 0.8 } className="apple-icon"/>
                    { t('download.macOS') }
                    <Icon path={ mdiDownload } size={ 0.8 } className="download-icon"/>
                </a>
            </p>
            <p>
                <a href="https://github.com/dainst/idai-field/releases" target="_blank" rel="noopener noreferrer">
                    { t('download.allVersions') }
                </a>
            </p>
            <hr className="m-5"/>
            <p className="mb-5">
                <a className="btn btn-secondary" href="https://github.com/dainst/idai-field"
                   target="_blank" rel="noopener noreferrer">
                    <Icon path={ mdiGithub } size={ 0.8 } className="github-icon" />
                    { t('download.sourceCode') }
                </a>
            </p>
        </div>
    );
};


const getLatestVersion = (): Promise<string> => {

    const url = 'https://api.github.com/repos/dainst/idai-field/releases';

    return new Promise<string>(resolve => {
        const request = new XMLHttpRequest();
        request.addEventListener('load', () => {
            resolve(JSON.parse(request.response)[0].tag_name.substr(1));
        });

        request.open('GET', url);
        request.setRequestHeader('Accept', 'application/vnd.github.v3+json');
        request.send();
    });
};


const pageStyle: CSSProperties = {
    height: 'calc(100vh - ' + NAVBAR_HEIGHT + 'px)',
    overflowY: 'scroll'
};


const carouselContainerStyle: CSSProperties = {
    width: '1030px',
    paddingRight: '15px',
    paddingLeft: '15px',
    marginRight: 'auto',
    marginLeft: 'auto'
};


const downloadContainerStyle: CSSProperties = {
    textAlign: 'center'
};
