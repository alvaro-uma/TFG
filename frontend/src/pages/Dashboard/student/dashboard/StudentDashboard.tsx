import { useEffect, useState } from "react";
import { Header } from "../../../../usecases/components/Header/Header";
import { MainMenuStudent } from "../menu/MainMenuStudent";
import styles from "../../../../usecases/components/MainMenu/MainMenu.module.css";
import { APIController } from "../../../../services/APIController";
import { listAdapter } from "../../../../adapters/listAdapter";
import { store } from "../../../..";

export const StudentDashBoard = (props: any) => {
    //IDEA DE COMO HACERLO
    //en vez de que cada componente llame al API para lo que se necesite, para separar logica de front lo que se me ocurre 
    //es hacer que esto sea la page , y aqui se llama a la API para lo que haga falta y se pasa a los componentes como props,
    //de esa manera vamos a intentar separar un poco mas la logica de los componentes.
    
    const [menu, setMenu] = useState<any>(null);
    const [subjectsList, setSubjectsList] = useState <any[]> ([]);
    const [refresh, setRefresh] = useState(false); //Para refrescar el componente de la lista de asignaturas
    // const subjectsList = [
    //     {
    //         id: 1,
    //         name: "Matematicas",
    //         description: "Aqui se aprende a sumar",
    //         ownerID:"sfnasdiuofns9"
    //     },
    //     {
    //         id: 1,
    //         name: "Lengua",
    //         description: "Aqui se aprende a sumar",
    //         ownerID:"sfnasdiuofns9"
    //     }];

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
        <MainMenuStudent
          menu={menu}
          setMenu={setMenu}
          subjects = {subjectsList}
        />
        <div className={styles.content}>
            {/* <ProfBoard menuState={menu} setMenu={setMenu} setRefresh={setRefresh}/> */}
        </div>
      </div>
    );
}
