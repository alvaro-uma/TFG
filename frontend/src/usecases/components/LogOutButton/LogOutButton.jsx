import { useContext } from 'react';
import { useNavigate } from "react-router";
import { FirebaseContext, store } from '../../..';

import { userSignOut } from '../../../domain/redux/actions';

import styles from './LogOutButton.module.css';

export const LogOutButton = () => {

    const FC = useContext(FirebaseContext);
    const navigate = useNavigate();

    const logout = () => {
        FC.logout();
        store.dispatch(userSignOut());
        navigate("/");
    }
  return (
    <div className={styles.button} onClick={logout}>
        Cerrar Sesion
    </div>
  )
}
