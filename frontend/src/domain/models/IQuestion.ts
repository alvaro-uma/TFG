export interface IQuestion {
    statement : string ;
    answer : string | number;
    setAnswer() : void;
    getStatement() : string ;
}