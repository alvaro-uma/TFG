const PORT = process.env.PORT || 3001;

//EXPRESS
const Express = require('express');
const app = new Express();
//JSON
const body_parser = require('body-parser');
app.use(body_parser.urlencoded({extended:false}));
app.use(body_parser.json());

//FIREBASE
const admin = require("firebase-admin");
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require("./tfg-portal-firebase-adminsdk-9sln2-950eb29c6a.json");
const {UsersCollection} = require("./database/UsersCollection");
const {User} = require("./models/User");
const {getAuth} = require("firebase-admin/auth");
const {Security} = require("./database/Security");
const roles = require("./config/config");
const getSessionDataRoute = require("./config/config");
const {Exam} = require("./models/Exam");
const {IQuestion} = require("./models/IQuestion");
const {examJSONtoModel} = require("./utils/parser");
const {Subject} = require("./models/Subject");
const {SubjectsCollection} = require("./database/SubjectsCollection");
const {postSubject, deleteSubject, updateSubject, getSubject, getSubjects} = require("./controllers/subjectsController");
const {ExamsCollection} = require("./database/ExamsCollection");
const {postExam, deleteExam, getExam, updateExam, getExams, duplicateExam} = require("./controllers/examsController");
const {getUsers} = require("./controllers/usersController");




//FUNCTIONS SPACE
async function run() {

}

const FireApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const Auth = getAuth(FireApp);
const security = new Security(Auth);


const db = getFirestore();
const UC = new UsersCollection(db);
const SC = new SubjectsCollection(db);
const EC = new ExamsCollection(db);


//LO DE CORS POLICY
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization',);

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.options('/*', (_, res) => {
    res.sendStatus(200);
});
//CRUD OPERATIONS


app.get("/getsessiondata",async (req, res) => {
    if (!req.headers.authorization) {
        res
            .status(403)
            .send({ message: "Tu petición no tiene cabecera de autorización" });
    }else{
        const token = req.headers.authorization.split(" ")[1];
        security.getUid(token).then((uid)=>{
            console.log("UID->",uid);
            if(uid == false){
                //aqui hemos tenido problemas con el token , esto hay que concretarlo
                res.status(404).send({message: "error"});
            }else{

                UC.getBy("uid" , uid).then((result)=>{
                    res.status(200).send(JSON.stringify(result));
                    console.log(JSON.stringify(result));
                })
            }
        });


    }

});


app.get(('/users/role/:role'),async (req, res) => {
    if (!req.headers.authorization) {
        res
            .status(403)
            .send({ message: "Tu petición no tiene cabecera de autorización" });
    }else{
        const _rol =  req.params.role;
        console.log("Buscando_>",_rol);
        const token = req.headers.authorization.split(" ")[1];
        security.getUid(token).then((uid)=>{
            console.log("TOKEN DECODED->",uid);
            if(uid == false){
                //aqui hemos tenido problemas con el token , esto hay que concretarlo
                res.status(404).send({message: "error"});
            }else{
                UC.getBy("uid",uid).then((results)=>{
                    const role = JSON.parse(results)[0].role;
                    if( role == roles.admin){
                        UC.getBy("role",_rol).then((professorList)=>{
                            res.status(200).send(professorList);
                        });
                    }else{
                        res.status(403).send({});
                    }
                })
            }
        });


    }

});

app.post('/register/student', async (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body));
    const user = new User(data.email,data.uid,data.rol);

});
//LAS ROUTAS SOBRE ASIGNATURAS
app.post('/subject', async (req, res) => { postSubject(req,res,SC)});
app.delete('/subject/:id', async (req, res) => { deleteSubject(req,res,SC)});
app.get('/subject/:id', async (req, res) => { getSubject (req,res,SC)});
app.put('/subject/:id', async (req, res) => { updateSubject (req,res,SC)});

app.get('/subjects', async (req, res) => { getSubjects (req,res,SC,security)});

//LAS ROUTAS SOBRE EXAMENES
app.post('/exam', async (req, res) => { postExam(req,res,EC)});
app.delete('/exam/:id', async (req, res) => { deleteExam(req,res,EC)});
app.get('/exam/:id', async (req, res) => { getExam (req,res,EC)});
app.put('/exam/:id', async (req, res) => { updateExam (req,res,EC)});

app.get('/exams/:asignatureID', async (req, res) => { getExams (req,res,EC,security)});
app.post('/exam/duplicate/:e    xamID', async (req, res) => { duplicateExam (req,res,EC,security)});

//LAS RUTAS SOBRE USUARUIOS

app.post('/users/getusersfromsubject', async (req, res) => { getUsers (req,res,UC,security)});


//CONNECTION TO DATABASE
run().catch(console.dir);

//LISTEN
app.listen(PORT,()=>{
    console.log('SERVER_SATUTS:LISTEN AT ',PORT);
});