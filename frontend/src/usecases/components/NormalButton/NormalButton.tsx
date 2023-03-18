import React from 'react'

import styles from './NormalButton.module.css'

export const  NormalButton = (props : any) => {
  return (
    <div className={styles.button} onClick={props.callback}>
        {props.text}
    </div>
  )
  
}
