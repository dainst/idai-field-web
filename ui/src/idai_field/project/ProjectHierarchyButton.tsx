import { mdiFileTree } from '@mdi/js';
import Icon from '@mdi/react';
import React, { CSSProperties, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Document } from '../../api/document';
import { getProjectLabel } from '../projects';


interface ProjectHierarchyButtonProps {
    projectDocument: Document;
    label?: string;
}


export default function ProjectHierarchyButton({ projectDocument, label = undefined }: ProjectHierarchyButtonProps)
        : ReactElement {
            
    return (
        <Link to={ `/project/${projectDocument.resource.id}?parent=root` } className="document-teaser">
            <div className="d-flex teaser-container teaser-small link">
                <div>
                    <Icon path={ mdiFileTree } size={ 0.8 } color="black" />
                </div>
                <div>
                    <h3 className="mx-2 my-1" style={ homeHeadingStyle }>
                        { label? label : getProjectLabel(projectDocument) }
                    </h3>
                </div>
            </div>
        </Link>
    );
}


const homeHeadingStyle: CSSProperties = {
    fontSize: '18px',
    color: 'black'
};
