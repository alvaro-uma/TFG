import {IModel} from "../models/IModel";
import {firestore} from "firebase-admin";
import CollectionReference = firestore.CollectionReference;
import Firestore = firestore.Firestore;

export interface ICollection {
    coll : CollectionReference;
    //CREATE
    add(newModel : IModel);
    //READ
    get(id : string);
    //UPDATE
    update(id : string,updatedModel : IModel);
    //DELETE
    delete(id : string);
}