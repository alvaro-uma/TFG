//create a component that will display the exams list

import { useEffect, useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { ExamTableOperation } from "../../subpages/Examenes";
import styles from "./examsTable.module.css";


interface ExamsTableProps {
  loading: boolean;
  exams: any[];
  setRefresh: any;
  handleOperation: any;
}

export const ExamsTable = (props: ExamsTableProps) => {
  if(props.loading){
    return <div className={styles.menuWrapper}><ul><li>Cargando ...</li></ul></div>;
  }
  return (
    <table className={styles.examTable}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Inicio</th>
          <th>Finalización</th>
          <th>Operaciones</th>
          <th>Visibilidad</th>
        </tr>
      </thead>
      <tbody>
        {props.exams.map((exam: any) => (
          <tr key={exam.id}>
            <td>{exam.name}</td>
            <td>
              {new Date(
                exam.startDate._seconds * 1000 +
                  exam.startDate._nanoseconds / 1000000
              ).toLocaleString()}
            </td>
            <td>
              {new Date(
                exam.endDate._seconds * 1000 +
                  exam.endDate._nanoseconds / 1000000
              ).toLocaleString()}
            </td>
            <td>
              <button>Editar</button>
              <button
                onClick={()=>{props.handleOperation(exam, props.setRefresh, ExamTableOperation.DELETE)}}>
                Eliminar
              </button>
              <button
                onClick={() => {
                  props.handleOperation(exam, props.setRefresh, ExamTableOperation.DUPLICATE);
                }}
              >
                Duplicar
              </button>
              <button
                onClick={() => {
                  props.handleOperation(
                    exam,
                    props.setRefresh,
                    ExamTableOperation.SWITCH_VISIBILITY
                  );
                }}
              >
                Visibilidad
              </button>
            </td>

            <td>
              <div className={styles.visibility}>
                {exam.visibility ? (
                  <MdOutlineVisibility />
                ) : (
                  <MdOutlineVisibilityOff />
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
