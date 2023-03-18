import React from "react";
import { store } from "../../..";

import styles from "./MainMenu.module.css";

export const MainMenu = (props: any) => {
  const changeMenuState = (newState: number) => {
    props.setState(newState);
  };
  switch (store.getState().role) {
    case "admin":
      return (
        <div className={styles.menuWrapper}>
          <ul>
            <li
              className={styles.menuElement}
              onClick={() => {
                changeMenuState(1);
              }}
            >
              Profesores
            </li>
            <li
              className={styles.menuElement}
              onClick={() => {
                changeMenuState(2);
              }}
            >
              Alumnos
            </li>
            <li className={styles.menuElement}>Registro</li>
          </ul>
        </div>
      );
    case "prof":
        return (
            <div className={styles.menuWrapper}>
              <ul>
                <li
                  className={styles.menuElement}
                  onClick={() => {
                    changeMenuState(1);
                  }}
                >
                  Inicio
                </li>
                {/* <li
                  className={styles.menuElement}
                  onClick={() => {
                    changeMenuState(2);
                  }}
                >
                  Alumnos
                </li>
                <li className={styles.menuElement}>Registro</li> */}
              </ul>
            </div>
          );
    default:
      return <div className={styles.menuWrapper}>MainMenu</div>;
  }
};
