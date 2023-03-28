export interface IQuestion {
    id : string ;
    statement : string ;
    answer : any;
    type : QuestionType;
    //generateComponent() : JSX.Element;
    component : JSX.Element;
    toJSON() : any;
}

export enum QuestionType {
    "fill-in-the-blank" ,
    "multiple-choice" ,
    "true-false" ,
    "short-answer" ,
}