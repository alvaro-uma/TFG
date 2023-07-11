import { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { TiPlus } from "react-icons/ti";
import { store } from "../../../..";
import { listAdapter } from "../../../../adapters/listAdapter";
import { APIController } from "../../../../services/APIController";
import { CreateExam } from "../components/createExam/createExam";
import { ExamsTable } from "../components/examsTable/examsTable";

import styles from "../board/ProfBoard.module.css";

export const enum ExamTableOperation {
  DELETE = "delete",
  DUPLICATE = "duplicate",
  SWITCH_VISIBILITY = "switchVisibility",
}

//TABLE OPERATIONS


export const Examenes = (props: any) => {
  const [exams, setExams] = useState<any[]>(["No hay examenes"]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [createExam, setCreateExam] = useState(false);

  const API = new APIController();

  const handleOperation = (exam: any, setRefresh: any, operation: ExamTableOperation) => {
    const token = store.getState().token;
    if (token) {
      switch (operation) {
        case ExamTableOperation.DELETE:
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
        case ExamTableOperation.DUPLICATE:
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
        case ExamTableOperation.SWITCH_VISIBILITY:
          exam.visibility = !exam.visibility;
  
          API.updateExam(token, exam.id, JSON.stringify(exam)).then(
            (response) => {
              if (response.status === 200) {
                setRefresh(true);
                return true;
              } else {
                alert("Error updating Exam");
                return false;
              }
            }
          );
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    setExams([]);
    if (exams.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    API.getExams(store.getState().token, props.menuState.id).then(
      (response) => {
        console.log("response de get exams :", response.status);
        listAdapter(response).then((updatedExams) => {
          console.log("Resultado de list adapter :", updatedExams);
          if (typeof updatedExams != "boolean") {
            if (updatedExams.length == 0) {
              updatedExams = ["No hay examenes"];
            } else {
              setExams(updatedExams);
            }
            setLoading(false);
          }
        });
      }
    );
    setRefresh(false);
    console.log("Refresh :", refresh);
  }, [refresh]);

  return <div>
    <h1>Examenes</h1>
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
          <CreateExam asignature={props.menuState} setRefresh={refresh} refresh={refresh}/>
        ) : (
            <ExamsTable  exams={exams} setRefresh={setRefresh} loading={loading} handleOperation={handleOperation}/>
        )}
      </div>
  </div>;
};
