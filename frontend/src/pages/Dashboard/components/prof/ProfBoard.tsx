import { useEffect, useState } from "react";
import { store } from "../../../..";
import { listAdapter } from "../../../../adapters/listAdapter";
import { APIController } from "../../../../services/APIController";
import { ExamsTable } from "./components/examsList/examsTable";
import { General } from "./components/General/General";
import { TiPlus } from "react-icons/ti";
import { BiArrowBack } from "react-icons/bi";

import styles from "./ProfBoard.module.css";
import { CreateExam } from "./components/createExam/createExam";

const Inicio = (props: any) => {
  
  return (
    <div>
      <h1>Bienvenido a la herramienta de gestion y correccion automatica</h1>
      <h2>Para comenzar, seleccione una asignatura en el menu lateral o </h2>
      <button>Crear una nueva asignatura, que ahora mismo no hace nada </button>
    </div>
  );
};

const Students = (props: any) => {
  const [studentsIDs, setStudentsIDs] = useState(props.menuState.students);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API = new APIController();

  useEffect(() => {
    console.log("useEffect de Students");
    API.getStudentsFromAsignature(store.getState().token, studentsIDs).then(
      (response) => {
        listAdapter(response).then((users) => {
          if (typeof users != "boolean") {
            console.log(users);
            const aux = users.map((user: any) => {
                return JSON.parse(user)[0];
            });
            setStudents(aux);
            setLoading(false);
          }
        });
      }
    );
  }, [props.menuState]);

  if (loading) {
    return <div>Cargando...</div>;
  }
  return (
    <div className={styles.studentsWrapper}>
      <h2>Alumnos</h2>

      <div>
        <h3>Subscribir alumno</h3>
        <p>
          Nota: a los alumnos que no tengan cuenta en la plataforma se les creará una precuenta , unicamente con su
          correo electronico. Será el alumno el que se encargue de completar su registro.
        </p>
        <input type="text" placeholder="email del nuevo alumno"></input><button>Subscribir alumno</button>
        <h3>Importar desde .csv</h3>
        <input type="file" accept=".csv"></input> <button hidden>Importar</button>
      </div>
      

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student: any, index) => {
            return (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.surname}</td>
                <td>{student.email}</td>
                <td>
                  <button>Anular subscripcion a la asignatura</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Asignature = (props: any) => {
  const Exams = (props: any) => {
    const [createExam, setCreateExam] = useState(false);
    return (
      <div className={styles.examsWrapper}>
        {!createExam ? (
          <div
            className={styles.navBarElement}
            onClick={() => {
              setCreateExam(true);
            }}
          >
            <TiPlus />
            Nuevo examen
          </div>
        ) : (
          <div
            className={styles.navBarElement}
            onClick={() => {
              setCreateExam(false);
            }}
          >
            <BiArrowBack />
          </div>
        )}
        {createExam ? (
          <CreateExam asignature={props.menuState} />
        ) : (
          <ExamsTable menuState={props.menuState} />
        )}
      </div>
    );
  };

  const POSIBLE_STATES = {
    HOME: <General menuState={props.menuState} />,
    EXAMS: <Exams menuState={props.menuState} setRefresh={props.setRefresh} />,
    STUDENTS: (
      <Students menuState={props.menuState} setRefresh={props.setRefresh} />
    ),
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
