import React, { ReactElement } from 'react';
import { Card } from 'react-bootstrap';
import { ResultFilter } from '../../api/result';
import CategoryFilter from './CategoryFilter';
import SimpleFilter from './SimpleFilter';
import RelationFilters from './RelationFilters';


export default function Filters({ filters, searchParams, projectId }
        : { filters: ResultFilter[], searchParams: string, projectId?: string }): ReactElement {

    if (!filters.find(filter => filter.values.length > 0)) return <></>;

    return <>
        <Card>
            <Card.Body className="d-flex py-2 pl-1 pr-2 align-self-stretch">
                { filters.map((filter: ResultFilter) =>
                    filter.name === 'resource.category.name'
                    ? <CategoryFilter filter={ filter } searchParams={ searchParams } projectId={ projectId }
                                      key={ filter.name } />
                    : <SimpleFilter filter={ filter } searchParams={ searchParams } projectId={ projectId }
                                    key={ filter.name } />) }
                <RelationFilters searchParams={ searchParams } projectId={ projectId } />
            </Card.Body>
        </Card>
    </>;
}
