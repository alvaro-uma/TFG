import { useState, useEffect } from "react";
import { store } from "../../../..";

import styles from "../../../../usecases/components/MainMenu/MainMenu.module.css";

export const MainMenuProf = (props: any) => {
    if(props.loading){
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
                    props.setMenu(subject);
                  }}
                >
                  {subject.name}
                </li>
              );
            })
            }
          </div>
        );
};
