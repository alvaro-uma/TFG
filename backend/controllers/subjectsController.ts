import {Subject} from "../models/Subject";
import {SubjectsCollection} from "../database/SubjectsCollection";
import { Response } from 'express';
import { Request } from 'express';


export const postSubject = (req : Request, res : Response , SC : SubjectsCollection) => {
    //comprobaciones de permisos y token AQUI
    const newSubject = new Subject(req.body.name,req.body.description);
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
    const newSubject = new Subject(req.body.name,req.body.description);
    newSubject.id = id;
    SC.update(id,newSubject).then((result)=>{
        if (result) {
            res.status(200).send("OK");
        }else{
            res.status(500).send("ERROR");
        }
    } );
}