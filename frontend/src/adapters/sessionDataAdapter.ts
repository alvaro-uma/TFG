import { codeFactoryHTTP, httpCode } from "../domain/models/httpResponses";
import { SessionData } from "../domain/redux/actions"

export const sessionDataAdapter = async (response : Response,token : string) : Promise<SessionData | boolean> => {
    const json = await response.json();
    const userData = JSON.parse(json)[0]
    switch (response.status) {
      case 200:
        return {
            name : userData.name,
            surname : userData.surname,
            email : userData.email,
            role : userData.role,
            token : token
             }
      default:
        return false;
    }
}