import {IQuestion} from "./IQuestion";

export class TestQuestion implements  IQuestion {
    id : string;
    type : string ;
    question : string;
    options : string[];
    answer : string | number;



    constructor(id : string, question : string, options : string[], answer : string | number, type : string){
        this.id = id;
        this.question = question;
        this.options = options;
        this.answer = answer;
        this.type = type;
    }
    toJSON(){
        return {
            "id": this.id,
            "question": this.question,
            "options": this.options,
            "answer": this.answer,
            "type": this.type
        };
    }
}