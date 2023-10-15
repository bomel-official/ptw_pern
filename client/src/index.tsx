import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';

// Fonts
import './static/fonts/MusticaproSemibold.otf'
import './static/fonts/MusticaproSemibold.ttf'
import './static/fonts/MusticaproSemibold.woff'


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

