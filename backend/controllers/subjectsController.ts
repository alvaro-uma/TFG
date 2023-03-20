import {Subject} from "../models/Subject";
import {SubjectsCollection} from "../database/SubjectsCollection";
import { Response } from 'express';
import { Request } from 'express';
import {Security} from "../database/Security";


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

export const getSubjects =  (req: Request, res: Response, SC: SubjectsCollection, security: Security) => {
    //Aqui deberiamos hacer una comprobacion de permisos y token
    if (!req.headers.authorization) {
        res
            .status(403)
            .send({ message: "Tu petición no tiene cabecera de autorización" });
    }else{
        const token = req.headers.authorization.split(" ")[1];
        security.getUid(token).then((ownerID) => {
            if (typeof ownerID == "string") {
                SC.getSubjectsByOwnerID(ownerID).then((result) => {
                    if (result) {
                        res.status(200).send(result);
                    } else {
                        res.status(500).send("ERROR");
                    }
                });
            } else {
                res.status(500).send("ERROR");
            }
        } );
    }

}