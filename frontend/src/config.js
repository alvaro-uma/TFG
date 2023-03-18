export const MARCA = {
    nombre : "zumbii",
    banner: "Una plataforma para profesores y alumnos , crear pruebas , practica y mucho mas."
}

export const  rootAPIUrl = "http://localhost:3001";

export const roles = {
    profesor : "prof",
    alumno : "student",
    admin : "admin",
}

//API ROUTES
export const routes = {
    getSessionData :  "/getsessiondata",
    getTeachers : "/users/role/" + roles.profesor,
    getStudents : "/users/role/" + roles.alumno
};

//MENU 

