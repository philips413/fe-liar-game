import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import App from "./App.tsx";
import {BrowserRouter} from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL ="http://192.168.219.101:8080";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter basename="/">
        <App />
    </BrowserRouter>
);

