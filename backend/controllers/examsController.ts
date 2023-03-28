
import { Response } from 'express';
import { Request } from 'express';
import {ExamsCollection} from "../database/ExamsCollection";
import {Exam} from "../models/Exam";
import {IQuestion} from "../models/IQuestion";
import {Security} from "../database/Security";

export const postExam = (req : Request, res : Response , EC : ExamsCollection) => {
    const newExam = new Exam(req.body.name, req.body.description, req.body.questions , req.body.asignatureID , req.body.startDate,req.body.endDate);
    EC.add(newExam).then((result)=>{
        if (result) {
            res.status(200).send("OK");
        }else{
            res.status(500).send("ERROR");
            console.log(result);
        }
    } );
}

export const deleteExam = (req : Request, res : Response , EC : ExamsCollection) => {
    console.log("DELETE EXAM");
    const id = req.params.id;
    EC.delete(id).then((result)=>{
        if (result) {
            res.status(200).send("OK");

        }else{
            res.status(500).send("ERROR");
        }
    });
}

export const getExam = (req : Request, res : Response , EC : ExamsCollection) => {
    const id = req.params.id;
    EC.get(id).then((result)=>{
        if (result) {
            res.status(200).send(result);
        }else{
            res.status(500).send("ERROR");
        }
    } );
}

export const updateExam = (req : Request, res : Response , EC : ExamsCollection) => {
    const id = req.params.id;
    const startDate =  req.body.startDate._seconds +  req.body.startDate._nanoseconds/1000000000;
    const endDate =  req.body.endDate._seconds +  req.body.endDate._nanoseconds/1000000000;

    const newExam = new Exam(req.body.name, req.body.description, req.body.questions , req.body.asignatureID ,startDate,endDate);
    newExam.visibility = req.body.visibility;
    newExam.id = req.body.id;
    EC.update(id,newExam).then((result)=>{
        if (result) {
            res.status(200).send("OK");
        }else{
            res.status(500).send("ERROR");
        }
    }   );
}

export const getExams =  (req: Request, res: Response, EC: ExamsCollection , security : Security) => {
    if (!req.headers.authorization) {
        res
            .status(403)
            .send({ message: "Tu petición no tiene cabecera de autorización" });
    }else{
        const token = req.headers.authorization.split(" ")[1];
        const asignatureID = req.params.asignatureID;
        security.getUid(token).then((ownerID) => {
            if (typeof ownerID == "string") {
                EC.getExamsByAsignatureID(asignatureID).then((result) => {
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
export const duplicateExam =  (req: Request, res: Response, EC: ExamsCollection , security : Security) => {
    if (!req.headers.authorization) {
        res
            .status(403)
            .send({ message: "Tu petición no tiene cabecera de autorización" });
    }else{
        const token = req.headers.authorization.split(" ")[1];
        const examID = req.params.examID;
        security.getUid(token).then((ownerID) => {
            if (typeof ownerID == "string") {
                //aqui falta comprobar que el ownerID es un profesor de la asignatura
                EC.get(examID).then((result) => {
                    if (typeof result == "string") {
                        const JSONresult = JSON.parse(result);

                        const startDate = JSONresult.startDate._seconds + JSONresult.startDate._nanoseconds/1000000000;
                        const endDate = JSONresult.endDate._seconds + JSONresult.endDate._nanoseconds/1000000000;
                        console.log(startDate);
                        console.log(endDate);
                        const newExam = new Exam(JSONresult.name, JSONresult.description, JSONresult.questions , JSONresult.asignatureID , startDate,endDate);
                        newExam.show();
                        EC.add(newExam).then((result)=>{
                            if (result) {
                                res.status(200).send("OK");
                            }else{
                                res.status(500).send("ERROR");
                            }
                        } );
                    } else {
                        res.status(500).send("ERROR");
                    }
                } );
            } else {
                res.status(500).send("ERROR");
            }
        } );
    }
}

