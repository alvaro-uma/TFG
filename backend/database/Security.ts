import {auth} from "firebase-admin";
import Auth = auth.Auth;
import DecodedIdToken = auth.DecodedIdToken;
import {ICollection} from "./ICollection";
import {UsersCollection} from "./UsersCollection";


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
    execute(token: string,UC : UsersCollection, operation : string ,collection : string,callback : () => any) {
        this.getUid(token).then((uid)=>{
            console.log("TOKEN DECODED->",uid);
            if(uid == false){
                return false;
            }else{
                UC.getBy("uid",uid.toString()).then((results)=>{
                    if(results.length == 0){
                        return false;
                    }
                    const role = JSON.parse(results)[0].role;
                    if(this.checkPermission(role,collection,operation)) {
                        return callback();
                    }
                    return false;
                });
            }
        });
    }
}