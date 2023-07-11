import { useState, useEffect } from "react";

import { store } from "../../../..";
import { listAdapter } from "../../../../adapters/listAdapter";

import { APIController } from "../../../../services/APIController";
import { Header } from "../../../../usecases/components/Header/Header";

import { ProfBoard } from "../board/ProfBoard";

import styles from "../../Dashboard.module.css";
import { MainMenuProf } from "../menu/MainMenuProf";

export function DashboardProf() {
  //Ahora los estados que controlan los componentes
  //Menu Lateral
  const [menu, setMenu] = useState<string | number> ("INICIO"); //pude ser un string o un numero;
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

    return (
      <div>
        <Header />
        <MainMenuProf
          menu={menu}
          setMenu={setMenu}
          subjects = {subjectsList}
        />
        <div className={styles.content}>
            <ProfBoard menuState={menu} setMenu={setMenu} setRefresh={setRefresh}/>
        </div>
      </div>
    );

}
