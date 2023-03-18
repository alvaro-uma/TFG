import { rootAPIUrl , routes } from "../config";
import { IApiController } from "./IApiController";

export class APIController implements IApiController {
  rootUrl: string;
  constructor() {
    this.rootUrl = rootAPIUrl;
  }
  async get(route: string, token: string) : Promise<any>{
    const response = await fetch(this.rootUrl + route, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      method: "GET",
    });     

    return response;
  }

  //POST
  async post(route: string, data: string, token: string) {
    //AQUI DATA DEBE DE SER UN JSON.stringfy
    const response = await fetch(this.rootUrl + route, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      method: "POST",
      body: data,
    });

    const code = response.status;
    return code;
  }
  async getSessionData(token : string ) : Promise <Response>{
    const response = await this.get(routes.getSessionData, token);
    return response;
  }
  async getTeachers(token: string) : Promise <Response> {
    const response = await this.get(routes.getTeachers, token);
    return response
  }
  async getStudents(token: string) : Promise <Response> {
    const response = await this.get(routes.getStudents, token);
    return response
  }
}
