import React, { useContext } from "react";


import { useNavigate } from "react-router";
import { Navigate } from "react-router-dom";


import styles from "./Home.module.css";
import { MARCA } from "../../config";
import { Header } from "../../usecases/components/Header/Header";
import { NormalButton } from "../../usecases/components/NormalButton/NormalButton";
import { sessionStates } from "../../domain/redux/actions";
import { store } from "../..";

export const Home = () => {

  const navigate = useNavigate();
  if (store.getState().sessionState == sessionStates.LOGGED) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div>
      <Header />
      <div className={styles.banner}>
        <div className={styles.message}>{MARCA.banner}</div>
        <div className={styles.button}>
          <NormalButton text="DESCUBIR MÁS" />
        </div>
      </div>
    </div>
  );
};
