import {firestore} from "firebase-admin";
import CollectionReference = firestore.CollectionReference;
import Firestore = firestore.Firestore;
import {ICollection} from "./ICollection";
import {IModel} from "../models/IModel";
import {dataBaseNotifier} from "../utils/notifier";


export class SubjectsCollection implements ICollection{
    coll: FirebaseFirestore.CollectionReference;

    constructor(BasicDatabaseController: Firestore) {
        this.coll = BasicDatabaseController.collection('subjects');
    }

    async add(newModel: IModel) {
        try {
            await this.coll.doc(newModel.id).set(newModel.toJSON());
            dataBaseNotifier("New Subject added");
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async delete(id: string) {
        try {
            await this.coll.doc(id).delete();
            dataBaseNotifier("Subject deleted");
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async get(id: string): Promise<string | boolean>{
        try {
            const doc = await this.coll.doc(id).get();
            dataBaseNotifier("Subject getted\n" + JSON.stringify(doc.data()));
            return JSON.stringify(doc.data());
        } catch (e) {
            console.log(e);
            return  false;
        }
    }

    async update(id: string, updatedModel: IModel) {
        try {
            await this.coll.doc(id).update(updatedModel.toJSON());
            dataBaseNotifier("Subject updated");
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    async getSubjectsByOwnerID(ownerID : string){
        try {
            const docs = await this.coll.where('ownerID', '==', ownerID).get();
            dataBaseNotifier("Subjects getted");
            return JSON.stringify(docs.docs.map(doc => doc.data()));
        } catch (e) {
            console.log(e);
            return  false;
        }
    }
}