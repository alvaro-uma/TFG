import { UsersCollection } from "../database/UsersCollection";
import { Response } from 'express';
import { Request } from 'express';

export const getUsers = (req : Request, res : Response , UC : UsersCollection) => {
    console.log("GET USERS");       
    if(req.body.ids){
        const ids = req.body.ids;
        const students = ids.map((id : string)=>{
            console.log(id);
            return UC.getBy("uid",id);
        });


        Promise.all(students).then((result)=>{
            console.log(students);
            res.status(200).send(JSON.parse(JSON.stringify(result)) );
        });
    }else{
        res.status(500).send("ERROR:no ids provided");
    }
}



export const subscribeToSubject = (req : Request, res : Response , UC : UsersCollection) => {
    console.log("SUBSCRIBE TO SUBJECT");       
}
export const unsubscribeFromSubject = (req : Request, res : Response , UC : UsersCollection) => {
    console.log("UNSUBSCRIBE FROM SUBJECT");       
}