import React from 'react'

import styles from './UserDataRow.module.css'

import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from 'react-bootstrap'

const DropMenu = (props : any) => {

  return (
    <Dropdown className={styles.dropdown} color="white">
      <Dropdown.Toggle variant='dark'  id="dropdown-basic">
        {props.title}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item >Detalles</Dropdown.Item>
        <Dropdown.Item >Eliminar</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
export const UserDataRow = (props : any) => {
  return (
    <div className={styles.UserDataRow}>
        <div>{props.name}</div>
        <div>{props.surname}</div>
        <div>{props.email}</div>
        <div><DropMenu id="options" title="ACCIONES" /> </div>
    </div>
  )
}
export const UserDataTitleRow = (props : any) => {
  return (
    <div className={styles.UserDataTitleRow}>
        <div>{props.name}</div>
        <div>{props.surname}</div>
        <div>{props.email}</div>
        <div>ACCIONES</div>
    </div>
  )
}

