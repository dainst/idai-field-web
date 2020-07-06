import React, { CSSProperties } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CategoryIcon from './CategoryIcon';

export default ({ document }) => {

    return (
        <Link to={ `/document/${document.resource.id}` } style={ linkStyle }>
            <Row>
                <Col style={ { flex: '0 0 50px' } }>
                    <CategoryIcon size="50" category={ document.resource.type } />
                </Col>
                <Col>
                    <Row>
                        <Col><h3>{ document.resource.identifier }</h3></Col>
                    </Row>
                    <Row>
                        <Col>{ document.resource.shortDescription }</Col>
                    </Row>
                </Col>
            </Row>
        </Link>
    );

};

const linkStyle: CSSProperties = {
    textDecoration: 'none',
    color: 'black'
};
