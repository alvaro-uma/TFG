
import { Action, sessionStates, SIGN_IN_EVENT, SIGN_OUT_EVENT } from "./actions";


const initialState = {
    sessionState: sessionStates.NO_LOGGED,
    name : "",
    surname :  "",
    email :  "",
    role :  "",
    token :  ""
}

export const sessionReducer = (state = initialState,action : Action) =>{
    switch(action.type){
        case SIGN_IN_EVENT:
            return Object.assign({}, state, {
                sessionState : sessionStates.LOGGED,
                name : action.name,
                surname : action.surname,
                email : action.email,
                role : action.role,
                token : action.token
              })
        case SIGN_OUT_EVENT:
            return Object.assign({}, state, {
                sessionState: sessionStates.NO_LOGGED,
                name : "",
                surname :  "",
                email :  "",
                role :  "",
                token :  ""
              })
        default:
            return state;
    }
    return state;
}