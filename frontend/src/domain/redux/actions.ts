//definiciones de tipos que esto no se si deberia de ir aqui o en otro lado

export type SessionData = {
    name : string,
    surname : string,
    email : string,
    role : string,
    token : string
};

export type Action = {
    type: string,
    name : string,
    surname : string,
    email : string,
    role : string,
    token : string,
};

//tipos de acciones
export const SIGN_IN_EVENT  = "SIGN_IN_EVENT";
export const SIGN_OUT_EVENT = "SIGN_OUT_EVENT";


//creadores de acciones

export const userSignIn = (sessionData : SessionData) => {
    return {type : SIGN_IN_EVENT , 
        name : sessionData.name,
        surname :  sessionData.surname,
        email :  sessionData.email,
        role :  sessionData.role,
        token :  sessionData.token
     }
}

export const userSignOut = () => {
    return {type : SIGN_OUT_EVENT,
        name : "",
        surname :  "",
        email :  "",
        role :  "",
        token :  ""
    }
}


//otras definiciones

export const sessionStates = {
    LOGGED : "USER_LOGGED",
    NO_LOGGED : "USER_NO_LOGGED"
}