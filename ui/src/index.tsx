import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import Modal from 'react-modal';
import './buttons.css';
import i18n from './i18n/i18n';
import Field from './idai_field/Field';
import Shapes from './idai_shapes/Shapes';
import './index.css';


Modal.setAppElement('#root');


const getSubdomain = (): string => {

    const levels = window.location.host.split('.');

    if (levels.length >= 3) return levels[0];
    else return null;
};

// Run only shapes or field if subdomain is set, otherwise App wraps both
const subdomain = getSubdomain();
const app = (subdomain === 'shapes' || process.env.REACT_APP_MAIN === 'shapes')
            ? <Shapes />
            : <Field />;

ReactDOM.render(
    <I18nextProvider i18n={ i18n }>
      { app }
    </I18nextProvider>,
  document.getElementById('root')
);
