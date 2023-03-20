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
import { ProfDashboard } from "./components/prof/ProfDashboard";

export function Dashboard() {
  //Ahora los estados que controlan los componentes
  //Menu Lateral
  const [menuOptionSelected, setMenuOptionSelected] = useState(1);
  const [subjectsList, setSubjectsList] = useState <any[]> ([]);
  //Estado del board

  const API = new APIController();

  useEffect(() => {
    API.getSubjects(store.getState().token).then((response)=>{
      listAdapter(response).then ((subjects) => {
        if(typeof subjects != "boolean"){
          setSubjectsList(subjects);
        }
      });
    });
  }, []);

  //Componentes para cada rol
  const AdminBoard = () => {
    const TeachersSection = () => {
      const [teachersList, setTeachersList] = useState <any[] | string> ("vacio");
      const [loading, setLoading] = useState(true);
      useEffect(() => {
        console.log("Admin board useffect")
        API.getTeachers(store.getState().token).then((response)=>{
          console.log("Ahora va list adapter")
          listAdapter(response).then((teachersList) => {
            console.log("Resultado de list adapter :",teachersList);
            if(typeof teachersList != "boolean"){
              setTeachersList(teachersList);
              console.log("Estado lista :",teachersList);
              setLoading(false);
            }     
          })
        })
      }, [])
      return(
        <div>
          <UserDataTitleRow name="Nombre" surname="Apellidos" email="Correo"/>
          {
            loading ? "Cargando..." : ""
          }
          {typeof teachersList!= "string" ? 
          teachersList.map((teacher : any)=>{
            console.log(teacher);
            return <UserDataRow key={teacher.email} name={teacher.name} surname={teacher.surname} email={teacher.email}/>
          })
          :""
          } 

        </div>
      );
      //
    };
    //
    //
    //
    const StudentsSection = () => {
      const [StudentsList, setStudentsList] = useState <any[] | string> ("vacio");
      const [loading, setLoading] = useState(true);
      useEffect(() => {
        console.log("Admin board useffect")
        API.getStudents(store.getState().token).then((response)=>{
          console.log("Ahora va list adapter")
          listAdapter(response).then((StudentsList) => {
            console.log("Resultado de list adapter :",StudentsList);
            if(typeof StudentsList != "boolean"){
              setStudentsList(StudentsList);
              console.log("Estado lista :",StudentsList);
              setLoading(false);
            }     
          })
        })
      }, [])
      return(
        <div>
          <UserDataTitleRow name="Nombre" surname="Apellidos" email="Correo"/>
          {
            loading ? "Cargando..." : ""
          }
          {typeof StudentsList!= "string" ? 
          StudentsList.map((student : any)=>{
            console.log(student);
            return <UserDataRow key={student.email} name={student.name} surname={student.surname} email={student.email}/>
          })
          :""
          } 

        </div>
      );
      //
    };
    //
    //
    //
    //
    switch (menuOptionSelected) {
      case 1:
        return (
          <div>
            <TeachersSection />
          </div>
        );
        case 2:
          return (
            <div>
              <StudentsSection />
            </div>
          );
      default:
        return <div>Opcion de menu no valida</div>;
    }
  };

  const Board = () => {
    switch (store.getState().role) {
      case "admin":
        return <AdminBoard />;

      case "prof":
        return <ProfDashboard menuState={menuOptionSelected} setMenu={menuOptionSelected}/>

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
