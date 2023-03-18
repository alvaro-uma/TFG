import {Exam} from "./Exam";
import {IModel} from "./IModel";
const uuid = require('uuid');



export class Subject implements IModel{
    id : string;
    name : string;
    description : string;
    exams : Exam[];
    constructor(name : string, description : string){
        this.id = uuid.v4();
        this.name = name;
        this.description = description;
        this.exams = [];
    }
    toJSON(){
        return {
            "id": this.id,
            "name": this.name,
            "description": this.description,
            "exams": this.exams
        };
    }
}