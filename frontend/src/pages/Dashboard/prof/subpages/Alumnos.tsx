import { useState, useEffect } from "react";
import { store } from "../../../..";
import { listAdapter } from "../../../../adapters/listAdapter";
import { APIController } from "../../../../services/APIController";

import styles from "../board/ProfBoard.module.css";

export const Students = (props: any) => {
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