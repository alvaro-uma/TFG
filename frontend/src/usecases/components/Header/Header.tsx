

import { MARCA } from "../../../config";
import { NormalButton } from "../NormalButton/NormalButton";
import { useNavigate } from "react-router";

import styles from "./Header.module.css";
import { LogOutButton } from "../LogOutButton/LogOutButton";
import { Logo } from "../Logo/Logo";
import { sessionStates } from "../../../domain/redux/actions";
import { store } from "../../..";

import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from 'react-bootstrap'

const DropMenu = (props : any) => {

  return (
    <Dropdown>
      <Dropdown.Toggle variant='none' id="dropdown-basic" >
        {props.title}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item >Perfil</Dropdown.Item>
        <Dropdown.Item >Cuenta</Dropdown.Item>
        <Dropdown.Item ><LogOutButton /></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export const Header = () => {
    const navigate = useNavigate();
  return (
    <div>
      {store.getState().sessionState == sessionStates.LOGGED ? (
        <>
          {/* Aqui pondriamos que nos vamos para el dashboard */}
          <header className={styles.Header}>
            <Logo />
            <div className={styles.menu}>
              <DropMenu title={"Hola, "+store.getState().name} />
            </div>
          </header>
        </>
      ) : (
        <>
          <header className={styles.Header}>
            <div className={styles.logo} onClick={()=>{navigate("/")}}>{MARCA.nombre}</div>
            <div className={styles.menu}>
                <NormalButton text="Iniciar Sesion" callback={()=>{navigate("/login")}}/>
                <NormalButton text="Registrame" callback={()=>{navigate("/register")}}/>
            </div>
          </header>
        </>
      )}
    </div>
  );
};
