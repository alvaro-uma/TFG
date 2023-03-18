
import styles from './OperationBox.module.css';

export const OperationBox = (props : any) => {
    return <div className={styles.boxWrapper}>
        <div className={styles.boxIcon}>
        {props.icon}
        </div>
        <div className={styles.boxTitle}>

        </div>
        {props.title}
    </div>
}