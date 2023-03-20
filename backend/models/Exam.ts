import {IQuestion} from "./IQuestion";
const uuid = require('uuid');
import {IModel} from "./IModel";


export class Exam implements IModel{
    id : string;
    name : string;
    description : string;
    questions : IQuestion[];
    asignatureID : string;
    startDate : Date;
    endDate : Date;
    visibility : boolean;
    constructor(name : string, description : string, questions : IQuestion[], asignatureID : string, startDate : number, endDate : number){
        this.id = uuid.v4();
        this.name = name;
        this.description = description;
        this.questions = questions;
        this.asignatureID = asignatureID;
        this.startDate = new Date(startDate * 1000);
        this.endDate = new Date(endDate * 1000);
        this.visibility = false;
    }
    addQuestion(question : IQuestion){
        this.questions.push(question);
    }
    deleteQuestion(id : string){
        this.questions = this.questions.filter((question : IQuestion) => question.id !== id);
    }
    updateQuestion(id : string, question : IQuestion){
        this.questions = this.questions.map((question : IQuestion) => {
            if(question.id === id){
                return question;
            }
            return question;
        });
    }
    show(){
        console.log("###############################################");
        console.log(this.toJSON());
        console.log("###############################################");
    }
    toJSON(){
        return {
            "id": this.id,
            "name": this.name,
            "description": this.description,
            "questions": this.questions,
            "asignatureID": this.asignatureID,
            "startDate": this.startDate,
            "endDate": this.endDate,
            "visibility": this.visibility
        };
    }
}