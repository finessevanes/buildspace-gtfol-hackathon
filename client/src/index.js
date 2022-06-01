import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Builders from './components/Builders'
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const desiredChainId = ChainId.Polygon;

ReactDOM.render(
  <ThirdwebProvider desiredChainId={desiredChainId}>
    <BrowserRouter>
      <Routes>
        <Route path="/" />
          <Route index='true' path="/" element={<App />} />
          <Route path="/builders" element={<Builders />} />
      </Routes>
    </BrowserRouter>
  </ThirdwebProvider>
  , document.getElementById('root'));
