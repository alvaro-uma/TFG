import React, { useContext, useEffect, useState } from 'react'



import { useAuthState } from "react-firebase-hooks/auth";

import { useNavigate } from "react-router";
import { FirebaseContext, store } from "../..";

import { User } from "firebase/auth";


import styles from "./Register.module.css";

import { notifyInfo } from '../../usecases/utilities/Notifier';
import { APIController } from '../../services/APIController';
import { Http2ServerResponse } from 'http2';
import { Header } from '../../usecases/components/Header/Header';
import { Logo } from '../../usecases/components/Logo/Logo';
import { NormalButton } from '../../usecases/components/NormalButton/NormalButton';
import { sessionStates } from '../../domain/redux/actions';
import { registerAdapter } from '../../adapters/authAdapter';

export const Register = (props: any) => {
  //Estados necesarios
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  

  //Para establecer si se ha iniciado session

    const API = new APIController();
 
  //Redireccionamiento
  const navigate = useNavigate();
  //useState
  useEffect(() => {
    if (store.getState().sessionState == sessionStates.LOGGED) {
        navigate("/dashboard");
      }
  }, []);

  //verificacion del formulario, tambien haremos verificacion del lado del servidor, esto para ahorrar peticiones por equivocacion
  //y en el servidor para usuarios maliciosos

  const verifyForm = () =>{//Esto esta basiquisimo , si incumple mas de 1 le van a salir todos los alert , no renta , mejor 1 solo mensaje con todo
    if(name.length==0 || surname.length==0 || email.length==0 || pass.length==0 || pass2.length==0){
        notifyInfo("Rellena todos los campos"); 
        return false;
    }
    if(pass != pass2){
        notifyInfo("Las contraseñas no coinciden"); 
        return false;
    }
    if(!String(email).includes("@")){
        notifyInfo("Introduce un correo valido"); 
        return false;
    }
    return true;
  }

  //Form Handlers
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };
  const handleSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurname(e.currentTarget.value);
  };
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };
  const handlePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPass(e.currentTarget.value);
  };
  const handlePassConfirmation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPass2(e.currentTarget.value);
  };
  const handleForm = () =>{
    console.log("hilo");
    if(verifyForm()){
        const data = {
            email : email,
            name : name,
            surname : surname,
            password : pass,
            role : "student",
        }
        // API.post('/register/student',JSON.stringify(data),"").then((code) =>{
        //     if(code == 200){
        //         notifyInfo("Registro completeado con exito")
        //     }else if(code == 409){
        //         notifyInfo("Este email ya tiene asociada una cuenta")
        //     }else{
        //         notifyInfo("Se ha producido un error en tu solitud, por favor ...")
        //     }
        // }
        registerAdapter(data).then((success)=>{
            if(success){
              navigate('/login');
            }
        })
    }
  }


  return (
    <div>
      <Header />
      <div className={styles.banner}>
        <div className={styles.loginForm}>
          <Logo />
          <h3>Registro</h3>

          Nombre: <input type="text" onChange={handleName}></input>
          Apellidos: <input type="text" onChange={handleSurname}></input>

          Email: <input type="email" onChange={handleEmail}></input>
          Password: <input type="password" onChange={handlePass}></input>
          Password: <input type="password" onChange={handlePassConfirmation}></input>


          <div className={styles.submitButton} onClick={()=>{handleForm()}}>
            <NormalButton text="Registrar" />
          </div>
        </div>
      </div>
    </div>
  );
};
