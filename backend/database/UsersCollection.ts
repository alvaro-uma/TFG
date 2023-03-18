import {firestore} from "firebase-admin";
import CollectionReference = firestore.CollectionReference;
import Firestore = firestore.Firestore;
import { getAuth, signInWithCustomToken } from "firebase/auth";
import {User} from "../models/User";

export class UsersCollection {
    coll : CollectionReference;
    constructor(BasicDatabaseController : Firestore){
        this.coll = BasicDatabaseController.collection('users');
    }
    //CREATE
    /*async addUser(user : User){
        const data = {
            email : user.email,
            uid : user.uid,
            rol : user.rol
        }
        try {
            await this.coll.doc().set(data);
        }   catch (e) {
            console.log(e);
        }
    }*/

    async registerUserPhase1(user:User){

    }
    //READ
    /*async getByRol(rol: string) {
        console.log(("Nueva peticion de GET por ROL"));
        const snapshot = await this.coll.where('rol', '==', rol).get();
        let arr : User [];
        arr = [];
        if (snapshot.empty) {
            console.log('No matching documents.');
            return ('No matching documents.');
        }
        snapshot.forEach(doc => {
            const user = new User(doc.data().email,doc.data().uid,doc.data().rol,doc.data().name,doc.data().surname);
            arr.push(user);
        });
        console.log(JSON.parse(JSON.stringify(arr)));
        return JSON.parse(JSON.stringify(arr));
    }*/

    async getBy(field: string , value : string) {//esto lo podemos mejorar con un ENUM de tipos del field o algo parecido
        const snapshot = await this.coll.where(field, '==', value).get();
        let user : User ;
        if (snapshot.empty) {
            console.log('No matching documents.');
            return ('No matching documents.');
        }
        const docs = snapshot.docs;
        const results = [];
        for (const doc of docs) {
            user = new User(
                doc.data().email
                ,doc.data().role
                ,doc.data().name
                ,doc.data().surname );
            results.push(user.toJSON());
        }

        return JSON.stringify(results);
    }
}