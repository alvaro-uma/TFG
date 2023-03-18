import { FirebaseController } from "../services/firebase";
import { notifyInfo } from "../usecases/utilities/Notifier";

export type registerData = {
    name: string,
    surname: string,
    role: string,
    email:string,
    password:string,
}

export const registerAdapter = async (data : registerData) : Promise <boolean> => {
    const FC = new FirebaseController();
    const success = await FC.registerWithEmailAndPassword(data);
    switch(success){
        case "OK":
            notifyInfo("Registro llevada a cabo con exito");
            return true;
        case "auth/weak-password":
            notifyInfo("La contraseña debe de se de al menos 6 caracteres");
            return false;
        case "auth/email-already-in-use":
            notifyInfo("Esta usuario esta ya en uso");
            return false;
        default:
            notifyInfo("Parece que ha habido un error en tu registro. Ponte en contacto con el servicio tecnico");
            return false;
    }
}

//este de aqui no lo tengo claro , al usar auth en el login no puedo abstraerlo ni modularizarlo , igualmente tendria que cambiar parte del login
// export const loginAdapter = (email : string , password : string) => {
//     const FC = useContext(FirebaseContext);
//     FC.logInWithEmailAndPassword(email,password);
// }