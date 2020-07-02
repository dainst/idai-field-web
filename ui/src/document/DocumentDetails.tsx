import React from 'react';
import { Container, Card } from 'react-bootstrap';
import CategoryIcon from './CategoryIcon';
import { Link } from 'react-router-dom';

export default ({ document }: { document: any }) => {

    return (
        <Container>
            <Card>
                <Card.Header>
                    { renderHeader(document.resource) }
                </Card.Header>
                <Card.Body>
                    { renderGroups(document.resource) }
                </Card.Body>
            </Card>
        </Container>
    );
};


const renderHeader = (resource: any) => (
    <div>
        <h1>
            <CategoryIcon category={ resource.type } size="40" />
            &nbsp; { resource.identifier }
        </h1>
        <code>
            <Link to={ `/document/${resource.id}` }>
                { `https://field.dainst.org/document/${resource.id}` }
            </Link>
        </code>
    </div>
);


const renderGroups = (resource: any) => {

    return resource.groups.map(renderGroup);
};


const renderGroup = (group: any) => {

    return (
        <div>
            { renderFieldList(group.fields) }
            { renderRelationList(group.relations) }
        </div>
    );
};


const renderFieldList = (fields: any) => {

    const fieldElements = fields
        .map(field => [
            <dt key={ `${field.name}_dt`}>{ field.name }</dt>,
            <dd key={ `${field.name}_dd`}>{ renderFieldValue(field.value) }</dd>
        ]);
    return <dl>{ fieldElements }</dl>;
};


const renderRelationList = (relations: any) => {

    if (!relations) return null;

    const relationElements = relations
        .map(relation => [
            <dt key={ `${relation.name}_dt`}>{ relation.name }</dt>,
            <dd key={ `${relation.name}_dd`}>
                <ul>
                    { relation.targets.map(id => renderDocumentLink(id)) }
                </ul>
            </dd>
        ]);
    return <dl>{ relationElements }</dl>;
};


const renderFieldValue = (value: any) => {

    if (Array.isArray(value)) return renderFieldValueArray(value);
    if (typeof value === 'object') return renderFieldValueObject(value);
    if (typeof value === 'boolean') return renderFieldValueBoolean(value);
    return value;
};


const renderFieldValueArray = (values: any[]) =>
    values.length > 1
        ? values.map((value, i) => <li key={ `${value}_${i}` }>{ renderFieldValue(value) }</li>)
        : renderFieldValue(values[0]);


const renderFieldValueObject = (object: any) => {

    if (object.label) return object.label;

    const listItems = Object.keys(object).map(key => <li key={ key }><strong>{ key }:</strong> { object[key] }</li>);
    return <ul>{ listItems }</ul>;
};


const renderFieldValueBoolean = (value: boolean) => value ? 'yes' : 'no';


const renderDocumentLink = (id: string) => <li key={ id }><Link to={ `/document/${id}` }>{ id }</Link></li>;
