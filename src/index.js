import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import 'normalize.css'
import './css/bootstrap.css'
import './css/estilo.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'jquery'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)