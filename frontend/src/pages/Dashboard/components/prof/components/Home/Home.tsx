import { OperationBox } from "../../../../../../usecases/components/OperationBox/OperationBox";

import { AiOutlinePlus, AiOutlineUserAdd } from "react-icons/ai";

import { MdOutlineNotificationAdd} from "react-icons/md";

import styles from "./ProfHome.module.css";

export const ProfHome = () => {
  return (
    <div>
      <h1>Atajos</h1>
      <div className={styles.shortcutsPalette}>
        <OperationBox title="Crear asignatura" icon={<AiOutlinePlus />} />
        <OperationBox title="Crear prueba" icon={<AiOutlinePlus />} />
        <OperationBox title="Crear notificacion" icon={<MdOutlineNotificationAdd />} />
        <OperationBox title="Nuevo profesor" icon={<AiOutlineUserAdd />} />
        <OperationBox title="Subscribir alumno/s a asignatura" icon={<AiOutlineUserAdd />} />
      </div>
    </div>
  );
};
