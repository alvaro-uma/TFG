const roles = {
    profesor: "prof",
    alumno: "student",
    admin: "admin",
};
const  routes = {
    getsesion : "getsessiondata"
}

const firebaseConfig = {
    apiKey: "AIzaSyDc80ZYHgjGfGQiP4ekQSNL4-X3J1OVH3A",
    authDomain: "tfg-portal.firebaseapp.com",
    projectId: "tfg-portal",
    storageBucket: "tfg-portal.appspot.com",
    messagingSenderId: "1002921619405",
    appId: "1:1002921619405:web:b0ca8076803d3715fcde84",
    measurementId: "G-24Z27H76ZJ"
};

//OPERATIONS
const POST_SUBJECT = 40;
const DELETE_SUBJECT = 41;
const UPDATE_SUBJECT = 42;
const GET_SUBJECTS = 43;


module.exports = firebaseConfig;
module.exports = routes;
module.exports = roles;
