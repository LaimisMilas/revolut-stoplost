import React from 'react';
import { createRoot } from 'react-dom/client';
import {createElementByTagName, injectElement} from "html-evaluate-utils/Utils";
import {listenForMessages} from "./utils/ChromeUtils";
import App from "./App";

listenForMessages((message) => {
    console.log("📩 Gauti duomenys iš background.js:", message.data);
});

const rootElementId = "labas_as_krabas_root";
injectElement('//body', createElementByTagName("div", rootElementId));
const rootElement = document.getElementById(rootElementId);

const app = (
    <App />
);

// Naujas būdas su createRoot
const root = createRoot(rootElement);
root.render(app);
