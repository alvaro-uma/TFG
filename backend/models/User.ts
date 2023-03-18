export class User{
    email : string;
    name:string;
    surname:string;
    rol : string;
    //uid : string;

    constructor(email : string ,rol:string,name:string,surname:string){
        this.email = email;
        //this.uid = uid;
        this.rol = rol;
        this.name = name;
        this.surname = surname;
    }
    toJSON(){
        return{
            "email": this.email,
            // "uid": this.uid, --> esta informacion de aqui es sensible , sera mejor no enviarla
            "role" : this.rol,
            "name":this.name,
            "surname":this.surname
        };
    }

}