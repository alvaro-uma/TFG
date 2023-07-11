import { useState, useEffect } from "react";
import { store } from "../../..";
import { listAdapter } from "../../../adapters/listAdapter";
import { APIController } from "../../../services/APIController";
import { UserDataTitleRow, UserDataRow } from "../../../usecases/components/UserDataRow/UserDataRow";


export const AdminBoard = (props : any) => {

    const API = new APIController();

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
    switch (props.menuOptionSelected) {
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