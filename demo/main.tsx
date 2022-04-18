import { StrictMode } from 'react';
import { render } from 'react-dom';

import { App } from '~demo/components/app';

import './index.css';

// @todo Use createRoot
// https://github.com/ZeeCoder/use-resize-observer/issues/90
render(
    <StrictMode>
        <App></App>
    </StrictMode>,
    document.getElementById('root'),
);
