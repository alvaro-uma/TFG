import React, { useContext, useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";

import { useNavigate } from "react-router";
import { FirebaseContext, store } from "../..";

import { User } from "firebase/auth";

import styles from './Login.module.css';

import { sessionStates, userSignIn } from "../../domain/redux/actions";
import { Header } from "../../usecases/components/Header/Header";
import { Logo } from "../../usecases/components/Logo/Logo";
import { NormalButton } from "../../usecases/components/NormalButton/NormalButton";
import { APIController } from "../../services/APIController";
import { sessionDataAdapter } from "../../adapters/sessionDataAdapter";

export const Login = (props: any) => {
  //Estados necesarios
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  //API
  const apiController = new APIController();
  //Firebase
  const FC = useContext(FirebaseContext);

  const [user, loading, error] = useAuthState(FC.auth);

  //Redireccionamiento
  const navigate = useNavigate();
  //useState
  useEffect(() => {
    const getToken = async (user: User) => {
      const token = await user.getIdToken(true);
      return token;
    };
    if (loading) {
      // poner pantalla de carga por aqui
      return;
    }
    if (user && store.getState().sessionState == sessionStates.NO_LOGGED) {
      getToken(user).then((token) => {
        apiController.getSessionData(token).then((response)=>{
          sessionDataAdapter(response,token).then((resultAdapted) => {
            if(typeof resultAdapted != "boolean"){
              store.dispatch(userSignIn({
                name : resultAdapted.name,
                surname : resultAdapted.surname,
                email : resultAdapted.email,
                role : resultAdapted.role,
                token : token,
              }))
              navigate("/dashboard");
            }else{
              console.log("Algo salio mal durante el login");
            }
          })
        })
      });
    }
    if (store.getState().sessionState == sessionStates.LOGGED) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  //Form Handlers
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };
  const handlePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPass(e.currentTarget.value);
  };
  const login = async () => {
    try {
      await FC.logInWithEmailAndPassword(email, pass);
    } catch (error) {
      console.log(error); //CAMBIAR POR FUTURA CLASE NOTIFICADORA PROPIA
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.banner}>
        <div className={styles.loginForm}>
          <Logo />
          <h3>Inicio de sesion</h3>
          Email: <input type="email" onChange={handleEmail}></input>
          Password: <input type="password" onChange={handlePass}></input>
          <div className={styles.submitButton}>
            <NormalButton text="Entrar" callback={login} />
          </div>
        </div>
      </div>
    </div>
  );
};
