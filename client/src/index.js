import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";

const desiredChainId = ChainId.Polygon;

ReactDOM.render(
  <ThirdwebProvider desiredChainId={desiredChainId}>
    <App />
  </ThirdwebProvider>
  , document.getElementById('root'));
