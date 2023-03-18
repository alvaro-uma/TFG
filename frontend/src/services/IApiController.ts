import { httpCode } from "../domain/models/httpResponses";

export interface IApiController {
    rootUrl : string;

    get(route : string , token : string) : Promise<httpCode> | Promise <string>;
    post(route : string , token : string , data : string) : Promise<httpCode>;
}