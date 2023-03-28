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
  //DELETE 
  async delete(route: string, token: string) {
    const response = await fetch(this.rootUrl + route, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      method: "DELETE",
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

    return response;
  }
  //PUT
  async put(route: string, data: string, token: string) {
    const response = await fetch(this.rootUrl + route, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      method: "PUT",
      body: data,
    });
    return response;
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
  getSubjects(token: string) : Promise <Response> {
    const response = this.get(routes.getSubjects, token);
    return response
  }

  //exams
  getExams(token: string, asignatueID : string) : Promise <Response> {
    const response = this.get(routes.getExams + asignatueID, token);
    return response
  }
  deleteExam(token: string, examID : string) : Promise <Response> {
    const response = this.delete(routes.deleteExam + examID, token);
    return response
  }
  createExam(token: string, data : string) : Promise <Response> {
    const response = this.post(routes.createExam, data, token);
    return response;
  }
  duplicateExam(token: string, examID : string) : Promise <Response> {
    const response = this.post(routes.duplicateExam + examID, "", token);
    return response;
  }
  updateExam(token: string, examID : string, data : string) : Promise <Response> {
    const response = this.put(routes.updateExam + examID, data, token);
    return response;
  }

  //users
  getStudentsFromAsignature(token: string,ids : string[]) : Promise <Response> {
    const JSONstring = JSON.stringify({"ids":ids});
    console.log("Se estan pidiendo : ",JSONstring);
    const response = this.post(routes.getUsers, JSONstring, token);
    return response;
  }
}
