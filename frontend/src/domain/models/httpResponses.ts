import { type } from "os";

//codes 
export type httpCode = number ;

export const codeFactoryHTTP = (code : number) : httpCode => {
    let res : httpCode;
    res = code;
    return res;
}
