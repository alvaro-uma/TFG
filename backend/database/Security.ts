import {auth} from "firebase-admin";
import Auth = auth.Auth;
import DecodedIdToken = auth.DecodedIdToken;
import {ICollection} from "./ICollection";
import {UsersCollection} from "./UsersCollection";
import { Response } from 'express';
import { Request } from 'express';


const permissionsMap : { [key: string]: { [key: string]: { [key: string]: boolean; }; }; } = {
    "admin": {
        "subjects": {
            "add": true,
            "delete": true,
            "update": true,
            "get": true
            },
        },
    "prof": {
        "subjects": {
            "add": false,
            "delete": false,
            "update": false,
            "get": true
            },
        },
    "student": {
        "subjects": {
            "add": false,
            "delete": false,
            "update": false,
            "get": true
        },

    }
}

interface UID{
    uid:string;
}


export class Security {
    auth : Auth;
    constructor ( auth : Auth) {
        this.auth = auth;
    }
    async getUid(token: string): Promise< string | boolean> {
        try {
            const user = await this.auth.verifyIdToken(token);
            return user.uid;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    checkPermission(rol : string , collection : string, operation : string) {
        return permissionsMap[rol][collection][operation];
    }

    //Esto hay que probarlo todavia
    async execute(UC : UsersCollection, operation : string ,collection : string,req:Request, res : Response) {
        console.log("EXECUTING SECURITY");
        if (!req.headers || !req.headers.authorization) {
            console.log("ERROR:no token provided");
            res.status(500).send("ERROR:no token provided");
            return false;

        }else{
            const token = req.headers.authorization.split(" ")[1];
                const uid = await this.getUid(token);
                console.log("TOKEN DECODED->",uid);
                if(uid == false){
                    console.log("ERROR:invalid token");
                    res.status(500).send("ERROR:invalid token");
                    return false;
                }else{
                    const results = await UC.getBy("uid",uid.toString());
                    if(results.length == 0){
                        res.status(500).send("ERROR:user not found");
                        return false;
                    }
                    const role = JSON.parse(results)[0].role;
                    if(this.checkPermission(role,collection,operation)) {
                        console.log("PERMISSION GRANTED");
                        return uid;
                    }

                }

        }
        res.status(500).send("ERROR:you don't have permission to do this operation");
        return false;
    }
}