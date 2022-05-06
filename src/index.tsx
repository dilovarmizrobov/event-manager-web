import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {store} from "./store"
import {SettingsProvider} from "./context/SettingsContext";

const root = createRoot(document.getElementById('root')!);

root.render(
    // <React.StrictMode>
        <Provider store={store}>
            <SettingsProvider>
                <App/>
            </SettingsProvider>
        </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
