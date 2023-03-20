import {Exam} from "./Exam";
import {IModel} from "./IModel";
const uuid = require('uuid');



export class Subject implements IModel{
    id : string;
    name : string;
    description : string;
    exams : Exam[];
    ownerID : string; //por ahora vamos con 1 solo profesor por asignatura
    constructor(name : string, description : string , ownerID : string){
        this.id = uuid.v4();
        this.name = name;
        this.description = description;
        this.exams = [];
        this.ownerID = ownerID;
    }
    toJSON(){
        return {
            "id": this.id,
            "name": this.name,
            "description": this.description,
            "exams": this.exams,
            "ownerID": this.ownerID
        };
    }
}