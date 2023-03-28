import React, { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { store } from "../../..";

import styles from "./MainMenu.module.css";


export const MainMenu = (props: any) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if(props.subjects.length > 0){
      setLoading(false);
    }else{
      setLoading(true);
    }
  }, [props.subjects]);
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
      if(loading){
        return <div className={styles.menuWrapper}><ul><li>Cargando ...</li></ul></div>;
      }
      return (
          <div className={styles.menuWrapper}>
            <li className={styles.menuElement} onClick={()=>{props.setState("INICIO")}}>Inicio</li>
            {props.subjects.map((subject: any) => {
              return (
                <li key={subject.id}
                  className={styles.menuElement}
                  onClick={() => {
                    changeMenuState(subject);
                  }}
                >
                  {subject.name}
                </li>
              );
            })
            }
          </div>
        );
        
    default:
      return <div className={styles.menuWrapper}>MainMenu</div>;
  }
};
