import React, { useContext } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Login } from "./pages/Login/Login";
import { createContext, useEffect, useState } from "react";
import { FirebaseController } from "./services/firebase";

import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { FirebaseContext } from ".";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Register } from "./pages/Register/Register";
import { createStore } from "redux";
import { sessionReducer } from "./domain/redux/reducers";

function App() {
  

  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
      </Routes>

  );
}

export default App;
