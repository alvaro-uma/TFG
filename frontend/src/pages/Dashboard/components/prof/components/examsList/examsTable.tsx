//create a component that will display the exams list

import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { store } from "../../../../../..";
import { APIController } from "../../../../../../services/APIController";
import styles from "./examsTable.module.css";

const enum Operation {
  DELETE = "delete",
  DUPLICATE = "duplicate",
  SWITCH_VISIBILITY = "switchVisibility",
}

const handleOperation = (exam: any, setRefresh: any, operation: Operation) => {
  const API = new APIController();
  const token = store.getState().token;
  if (token) {
    switch (operation) {
      case Operation.DELETE:
        API.deleteExam(token, exam.id).then((response) => {
          if (response.status === 200) {
            setRefresh(true);
            return true;
          } else {
            alert("Error deleting Exam");
            return false;
          }
        });
        break;
      case Operation.DUPLICATE:
        API.duplicateExam(token, exam.id).then((response) => {
          if (response.status === 200) {
            setRefresh(true);
            return true;
          } else {
            alert("Error duplicating Exam");
            return false;
          }
        });
        break;
      case Operation.SWITCH_VISIBILITY:
        exam.visibility = !exam.visibility;
        
        API.updateExam(token, exam.id, JSON.stringify(exam)).then((response) => {
          if (response.status === 200) {
            setRefresh(true);
            return true;
          } else {
            alert("Error updating Exam");
            return false;
          }
        });
        break;
      default:
        break;
    }
  }
};

export const ExamsTable = (props: any) => {
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
                exam.endDate._seconds * 1000 +
                  exam.endDate._nanoseconds / 1000000
              ).toLocaleString()}
            </td>
            <td>
              {new Date(
                exam.startDate._seconds * 1000 +
                  exam.startDate._nanoseconds / 1000000
              ).toLocaleString()}
            </td>
            <td>
              <button>Editar</button>
              <button
                onClick={() => {
                  handleOperation(exam, props.setRefresh, Operation.DELETE);
                }}
              >
                Eliminar
              </button>
              <button
                onClick={() => {
                  handleOperation(exam, props.setRefresh, Operation.DUPLICATE);
                }}
              >
                Duplicar
              </button>
              <button
                onClick={() => {
                  handleOperation(
                    exam,
                    props.setRefresh,
                    Operation.SWITCH_VISIBILITY
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
