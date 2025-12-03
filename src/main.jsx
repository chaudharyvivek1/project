import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import store from './redux/store.js'
import { Provider } from 'react-redux'
import './index.css'
import  AuthProvider  from "./componets/Authprovider.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
     <AuthProvider>
      <App />
    </AuthProvider>
    </BrowserRouter>
  </Provider>
);







  
    
