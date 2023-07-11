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
                                    if (result) {
                                        res.status(200).send(result);
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