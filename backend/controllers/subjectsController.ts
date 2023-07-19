import {Subject} from "../models/Subject";
import {SubjectsCollection} from "../database/SubjectsCollection";
import { Response } from 'express';
import { Request } from 'express';
import {Security} from "../database/Security";
import { UsersCollection } from "../database/UsersCollection";


export const postSubject = (req : Request, res : Response , SC : SubjectsCollection) => {
    //comprobaciones de permisos y token AQUI
    const newSubject = new Subject(req.body.name,req.body.description,req.body.ownerID);
    SC.add(newSubject).then((result)=>{
        res.status(200).send("OK");
    } );
}
export const deleteSubject = (req : Request, res : Response , SC : SubjectsCollection) => {
    //comprobaciones de permisos y token AQUI
    const id = req.params.id;
    SC.delete(id).then((result)=>{
        if (result) {
            res.status(200).send("OK");
        }else{
            res.status(500).send("ERROR");
        }

    });
}
export const getSubject = (req : Request, res : Response , SC : SubjectsCollection) => {
    const id = req.params.id;
    SC.get(id).then((result)=>{
        if (result) {
            res.status(200).send(result);
        }else{
            res.status(500).send("ERROR");
        }
    } );
}
export const updateSubject = (req : Request, res : Response , SC : SubjectsCollection) => {
    const id = req.params.id;
    const newSubject = new Subject(req.body.name,req.body.description,req.body.ownerID);
    newSubject.id = id;
    SC.update(id,newSubject).then((result)=>{
        if (result) {
            res.status(200).send("OK");
        }else{
            res.status(500).send("ERROR");
        }
    } );
}

export const getSubjects =  (req: Request, res: Response,UC : UsersCollection,SC: SubjectsCollection, security: Security) => {
    //Aqui deberiamos hacer una comprobacion de permisos y token
    console.log("GET SUBJECTS");
    security.execute(UC, "get", "subjects", req, res).then((userID) => {
        if(userID){
            console.log("GET SUBJECTS", userID);
            if (typeof userID == "string") {
                UC.getBy("uid", userID).then((result) => {
                    if (result) {
                        const dataUser = JSON.parse(result)[0];
                        console.log("GET SUBJECTS",dataUser.role);
                        switch (dataUser.role) {
                            case "admin":
                                res.status(200).send("OK admin");
                                break;
                            case "prof":
                                SC.getSubjectsByOwnerID(userID).then((result) => {
                                    if (result) {
                                        res.status(200).send(result);
                                    } else {
                                        res.status(500).send("ERROR");
                                    }
                                });
                                break;
                            case "student":
                                SC.getSubjectsByStudentID(userID).then((result) => {
                                    //aqui tengo que retirar alguna informamcion del resultado  , como el ownerID 
                                    //para que el estudiante no pueda verlo
                                    if (result) {
                                        //paso a JSON
                                        const data = JSON.parse(result);
                                        //quito el ownerID , y la lista de studiantes
                                        data.forEach((subject : any) => {
                                            delete subject.ownerID;
                                            delete subject.students;
                                        });
                                        //paso a string
                                        const resultados_capados = JSON.stringify(data);
                                        //envio
                                        res.status(200).send(resultados_capados);
                                    } else {
                                        res.status(500).send("ERROR");
                                    }
                                });
                                break;
                            default:
                                res.status(500).send("ERROR");
                                break;
                        }
                    } else {
                        res.status(500).send("ERROR");
                    }
                });
            } else {
                res.status(500).send("ERROR");
            }
        }
    }
    );


}

export const subscribeToSubject = async (req : Request, res : Response , UC : UsersCollection , security : Security) => {
    security.execute(UC, "add", "subjects", req, res).then((userID) => {
        if(userID){ // si tiene permisos
            //veo si existe el nuevo usuario que se quiere añadir , segun el email
            UC.getBy("email",req.body.email).then((result)=>{
                if(result){ // si existe
                    //TODO
                    //añado su id a la lista de estudiantes de la asignatura
                    res.status(200).send("El usuario existe , se ha añadido a la asignatura");
                }else{
                    //TODO
                    res.status(200).send("El usuario no existe, se ha creado una precuenta");
                }
            });
        }
    } );    
}
export const unsubscribeFromSubject = (req : Request, res : Response , UC : UsersCollection) => {
    console.log("UNSUBSCRIBE FROM SUBJECT");  
    res.status(200).send("OK");     
}


//IDEA NUEVA PQ ESTOY VIENDO QUE ESTO ESCALA DE MADRE
export const GET_SUBJECTS = (req : Request, res : Response , UC : UsersCollection , SC : SubjectsCollection , security : Security) => {
    //comprobaciones de permisos y token AQUI
    security.execute(UC, "get", "subjects", req, res).then((userID) => {
        if(userID){
            console.log("GET SUBJECTS", userID);
            if (typeof userID == "string") {
                UC.getBy("uid", userID).then((result) => {
                    if (result) {
                        const dataUser = JSON.parse(result)[0];
                        console.log("GET SUBJECTS",dataUser.role);
                        switch (dataUser.role) {
                            case "admin":
                                GET_SUBJECTS_ADMIN(req,res,SC);
                                break;
                            case "prof":
                                GET_SUBJECTS_PROF(req,res,SC,userID);
                                break;
                                break;
                            case "student":
                                GET_SUBJECTS_STUDENT(req,res,SC,userID);
                                break;
                            default:
                                res.status(500).send("ERROR");
                                break;
                        }
                    } else {
                        res.status(500).send("ERROR");
                    }
                });
            } else {
                res.status(500).send("ERROR");
            }
        }
    }
    );
}
const GET_SUBJECTS_ADMIN = (req : Request, res : Response , SC : SubjectsCollection) => {}
const GET_SUBJECTS_PROF = (req : Request, res : Response , SC : SubjectsCollection , userID : string) => {}
const GET_SUBJECTS_STUDENT = (req : Request, res : Response , SC : SubjectsCollection , userID : string) => {}