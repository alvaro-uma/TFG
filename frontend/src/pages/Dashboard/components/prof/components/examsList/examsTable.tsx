//create a component that will display the exams list

import { useEffect, useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { store } from "../../../../../..";
import { listAdapter } from "../../../../../../adapters/listAdapter";
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
  
  const [exams, setExams] = useState<any[]>(["No hay examenes"]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const API = new APIController();

  useEffect(() => {
    setExams([]);
    if(exams.length > 0){
        setLoading(false);
    }else{
        setLoading(true);
    }
    API.getExams(store.getState().token,props.menuState.id).then((response)=>{
        console.log("response de get exams :",response.status);
        listAdapter(response).then((updatedExams)=>{
            console.log("Resultado de list adapter :",updatedExams);
            if(typeof updatedExams != "boolean"){
                if(updatedExams.length == 0){
                    updatedExams = ["No hay examenes"];
                }else{
                    setExams(updatedExams);
                }
                setLoading(false);
            }
        })
    })
    setRefresh(false);
    console.log("Refresh :",refresh);
}, [refresh])
  if(loading){
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
        {exams.map((exam: any) => (
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
                onClick={() => {
                  handleOperation(exam, setRefresh, Operation.DELETE);
                }}
              >
                Eliminar
              </button>
              <button
                onClick={() => {
                  handleOperation(exam, setRefresh, Operation.DUPLICATE);
                }}
              >
                Duplicar
              </button>
              <button
                onClick={() => {
                  handleOperation(
                    exam,
                    setRefresh,
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
