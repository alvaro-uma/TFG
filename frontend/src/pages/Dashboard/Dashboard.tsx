import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { APIController } from "../../services/APIController";




import styles from "./Dashboard.module.css";
import { UserDataRow, UserDataTitleRow } from "../../usecases/components/UserDataRow/UserDataRow";
import { Header } from "../../usecases/components/Header/Header";
import { MainMenu } from "../../usecases/components/MainMenu/MainMenu";
import { store } from "../..";
import { sessionStates } from "../../domain/redux/actions";
import { listAdapter } from "../../adapters/listAdapter";
import { ProfBoard } from "./components/prof/ProfBoard";
import { AdminBoard } from "./components/admin/AdminBoard";

export function Dashboard() {
  //Ahora los estados que controlan los componentes
  //Menu Lateral
  const [menuOptionSelected, setMenuOptionSelected] = useState<string | number> ("INICIO"); //pude ser un string o un numero;
  const [subjectsList, setSubjectsList] = useState <any[]> ([]);
  const [refresh, setRefresh] = useState(false); //Para refrescar el componente de la lista de asignaturas
  //Estado del board

  const API = new APIController();

  useEffect(() => {
    console.log("useEffect de Dashboard");
    API.getSubjects(store.getState().token).then((response)=>{
      listAdapter(response).then ((subjects) => {
        if(typeof subjects != "boolean"){
          setSubjectsList(subjects);
        }
      });
    });
  }, [refresh]);


  const Board = () => {
    switch (store.getState().role) {
      case "admin":
        //return <AdminBoard menuState={menuOptionSelected}/>;

      case "prof":
        return <ProfBoard menuState={menuOptionSelected} setMenu={menuOptionSelected} setRefresh={setRefresh}/>
      
      case "student":
        return <div>Estudiante</div>;
      default:
        return <div>nada</div>;
        break;
    }
  };

  if (store.getState().sessionState == sessionStates.LOGGED) {
    return (
      <div>
        <Header />
        <MainMenu
          role={store.getState().role}
          state={menuOptionSelected}
          setState={setMenuOptionSelected}
          subjects = {subjectsList}
        />
        <div className={styles.content}>
          <Board />
        </div>
      </div>
    );
  }
  return <Navigate to="/" />;
}
