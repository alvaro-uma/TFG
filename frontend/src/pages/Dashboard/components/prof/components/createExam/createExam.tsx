
import React, { useEffect, useState } from 'react';
import { store } from '../../../../../..';
import { APIController } from '../../../../../../services/APIController';
import styles from './createExam.module.css';

export const CreateExam = (props : any) => {
  const [wrappers, setWrappers] = useState<WriteAnswerWrapper[]>([]);
  const [deleteComponentId, setDeleteComponentId] = useState<string | boolean>(false);

  const [asignature_id, setAsignatureId] = useState<string>(props.asignature.id);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startLocalDate, setStartLocalDate] = useState<string>("");
  const [endLocalDate, setEndLocalDate] = useState<string>("");


  useEffect(() => {
    const deleteComponent = (idToDelete: string) => {
      console.log("inicio");
      setWrappers((wrappers) => wrappers.filter((wrapper) => wrapper.component.props.id !== idToDelete));
    }

    if (deleteComponentId) {
      deleteComponent(deleteComponentId as string);
      setDeleteComponentId(false);
    }
  } , [deleteComponentId]);

  


  const handleAddComponent = () => {
    setWrappers([...wrappers, new WriteAnswerWrapper(handleDeleteComponent)]);
  };

  const handleDeleteComponent = (idToDelete: string) => {
    console.log("borrando componente", idToDelete);
    setDeleteComponentId(idToDelete);
  };

  const handleCreate = () => {
    console.log("creando examen");
    //wrappers.forEach((wrapper) => console.log(JSON.stringify(wrapper.toJSON())));
    const questions = wrappers.map((wrapper) => wrapper.toJSON());

    //esto se pone asi para que el backend lo pueda leer


    const exam = {
      name : title,
      description : description,
      questions : questions,
      asignatureID : asignature_id,
      startDate : new Date(startLocalDate).getTime() / 1000,
      endDate :   new Date(endLocalDate).getTime() / 1000,
    };
    console.log(exam);
    const API = new APIController ();
    API.createExam(store.getState().token, JSON.stringify(exam)).then((response : Response) => {
      if(response.status === 200){
        alert("Examen creado");
      }else {
        alert("Error al crear el examen");
      }
    });
  };

  return (
    <div>
      {/* Informacion general del examen */}
      <div>
        <h2>Titulo del examen</h2>
        <input type="text" onChange={(e)=>{setTitle(e.target.value)}} required/>

        <h2>Descripcion</h2>
        <textarea onChange={(e)=>{setDescription(e.target.value)}}/>

        <h2>Inicio</h2>
        <label>Fecha y hora</label>
        <input type="datetime-local" onChange={(e) => {setStartLocalDate(e.target.value)}} required/>

        <h2>Fin</h2>
        <label>Fecha y hora</label>
        <input type="datetime-local" onChange={(e) => {setEndLocalDate(e.target.value)}} required/>
        
      </div>
      {/* Preguntas */}
      <div>
        <label>Crear pregunta tipo:</label>
        <button onClick={handleAddComponent}>Escribir respuesta</button>
        {wrappers.map((wrapper) => wrapper.getComponent())}
      </div>

      {/* Boton crear examen */}
      <button onClick={()=>{handleCreate()}}>Crear examen</button>
    </div>
  );
}

class WriteAnswerWrapper {
  id: string;
  statement : string;
  answer : string;
  component: JSX.Element;
  deleteComponent: (id: string) => void;

  constructor(deleteComponent: (id: string) => void) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.statement = "";
    this.answer = "";
    this.deleteComponent = deleteComponent;
    this.component = (
      <WriteAnswer
        key={this.id}
        id={this.id}
        updateStatement = {this.updateStatement.bind(this)}
        updateAnswer = {this.updateAnswer.bind(this)}
        deleteComponent = {this.deleteComponent}
      />
    );
  }
  updateStatement(statement:string){
    this.statement = statement;
  }
  updateAnswer(answer:string){
    this.answer = answer;
  }

  setText(text: string) {
    this.statement = text;
  }
  getComponent() {
    return this.component;
  }
  toJSON() {
    return {
      statement: this.statement,
      answer: this.answer,
    }
  }
}

function WriteAnswer(props: any) {
  const [statement, setStatement] = useState<string>(props.text);
  const [answer, setAnswer] = useState<string>("");
  //en el tema de actualizar 
  const handleStatementChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStatement(event.target.value);
    props.updateStatement(event.target.value);
  };
  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
    props.updateAnswer(event.target.value);
  };
  const handleDeleteComponent = () => {
    props.deleteComponent(props.id);
  };
  return (
    <div className={styles.question}>
      <label>Enunciado: </label>
      <textarea value={statement} onChange={handleStatementChange} />
      <label>Respuesta correcta: </label>
      <input value={answer} onChange={handleAnswerChange} />
      <button onClick={()=>{handleDeleteComponent()}}>Borrar</button>
    </div>
  );
}

