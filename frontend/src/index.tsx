import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { createContext } from "react";
import { FirebaseController } from "./services/firebase";
import { createStore } from "redux";
import { sessionReducer } from "./domain/redux/reducers";
import { composeWithDevTools } from "redux-devtools-extension";

import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';
import persistStore from "redux-persist/es/persistStore";

//REDUX
const persistConfig = {
  key : "root",
  version : 1,
  storage
}

const persistedReducer = persistReducer(persistConfig,sessionReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})



export const persistor = persistStore(store)

//FIREBASE
const FC = new FirebaseController();
export const FirebaseContext = createContext(FC);


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);



//export let store = createStore(sessionReducer,composeWithDevTools());

root.render(
  <BrowserRouter>
    <FirebaseContext.Provider value={FC}>
      <App />
    </FirebaseContext.Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
