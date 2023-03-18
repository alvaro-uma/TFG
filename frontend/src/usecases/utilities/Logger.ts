export class Logger{
    FirebaseErrors  = true;
    FirebaseError = (error : string ) =>{
        if(this.FirebaseErrors){
            console.log("[FirebaseError]" + error);
        }
    }
}

//AQUI MOLARIA CREAR TIPOS DE MENSAJES ES DECIR , POR EJEMPLO:
//FLAGS PARA DETERMINADO AMBITO Y PODER PONER Y QUITAR ESOS FLAGS Y VER LOS PROCESOS
//COMO POR EJEMPLO EL DE AUTH