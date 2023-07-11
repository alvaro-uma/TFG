import { useEffect, useState } from "react";
import { store } from "../../../..";
import { listAdapter } from "../../../../adapters/listAdapter";
import { APIController } from "../../../../services/APIController";
import { ExamsTable } from "../components/examsTable/examsTable";

import { TiPlus } from "react-icons/ti";
import { BiArrowBack } from "react-icons/bi";

import styles from "./ProfBoard.module.css";
import { General } from "../subpages/General";
import { Examenes } from "../subpages/Examenes";
import { Students } from "../subpages/Alumnos";

const Inicio = (props: any) => {
  
  return (
    <div>
      <h1>Bienvenido a la herramienta de gestion y correccion automatica</h1>
      <h2>Para comenzar, seleccione una asignatura en el menu lateral o </h2>
      <button>Crear una nueva asignatura, que ahora mismo no hace nada </button>
    </div>
  );
};



const Asignature = (props: any) => {
  const POSIBLE_STATES = {
    HOME: <General menuState={props.menuState} />,
    EXAMS: <Examenes menuState={props.menuState} setRefresh={props.setRefresh} />,
    STUDENTS: <Students menuState={props.menuState} setRefresh={props.setRefresh} />
  };

  const DynamicBoard = (props: any) => {
    const [view, setView] = useState(POSIBLE_STATES.HOME);
    return (
      <div>
        <div className={styles.navbar}>
          {view == POSIBLE_STATES.HOME ? (
            <div
              className={styles.navBarElement + " " + styles.selected}
              onClick={() => {
                setView(POSIBLE_STATES.HOME);
              }}
            >
              General
            </div>
          ) : (
            <div
              className={styles.navBarElement}
              onClick={() => {
                setView(POSIBLE_STATES.HOME);
              }}
            >
              General
            </div>
          )}
          {view == POSIBLE_STATES.EXAMS ? (
            <div
              className={styles.navBarElement + " " + styles.selected}
              onClick={() => {
                setView(POSIBLE_STATES.EXAMS);
              }}
            >
              Examenes
            </div>
          ) : (
            <div
              className={styles.navBarElement}
              onClick={() => {
                setView(POSIBLE_STATES.EXAMS);
              }}
            >
              Examenes
            </div>
          )}
          {view == POSIBLE_STATES.STUDENTS ? (
            <div
              className={styles.navBarElement + " " + styles.selected}
              onClick={() => {
                setView(POSIBLE_STATES.STUDENTS);
              }}
            >
              Alumnos
            </div>
          ) : (
            <div
              className={styles.navBarElement}
              onClick={() => {
                setView(POSIBLE_STATES.STUDENTS);
              }}
            >
              Alumnos
            </div>
          )}
        </div>
        {view}
      </div>
    );
  };

  return (
    <div className={styles.dinamycBoard}>
      <h1>{props.menuState.name}</h1>
      <DynamicBoard POSIBLE_VIEWS={POSIBLE_STATES} />
    </div>
  );
};

export const ProfBoard = (props: any) => {
  switch (props.menuState) {
    case "INICIO":
      return <Inicio setRefresh={props.setRefresh} menuState={props.menuState}/>;
    default:
      return (
        <Asignature menuState={props.menuState} setRefresh={props.setRefresh} />
      );
  }
};
