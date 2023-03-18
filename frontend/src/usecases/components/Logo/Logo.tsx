import React from 'react'
import { MARCA } from '../../../config';

import styles from './Logo.module.css';

export const Logo = ()  =>{
  return (
    <div className={styles.logo}>{MARCA.nombre}</div>
  )
}
