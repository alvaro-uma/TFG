import { useEffect, useState } from "react";
import { store } from "../../../..";
import { listAdapter } from "../../../../adapters/listAdapter";
import { APIController } from "../../../../services/APIController";
import { ExamsTable } from "./components/examsList/examsTable";
import { ProfHome } from "./components/Home/Home";


export const ProfDashboard = (props : any) =>{
    const API = new APIController();
    const [exams, setExams] = useState<any[]>(["No hay examenes"]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        setExams([]);
        if(exams.length > 0){
            setLoading(false);
        }else{
            setLoading(true);
        }
        API.getExams(store.getState().token,props.menuState.id).then((response)=>{
            console.log("response de get exams :",response.status);
            listAdapter(response).then((updatedExams)=>{
                console.log("Resultado de list adapter :",updatedExams);
                if(typeof updatedExams != "boolean"){
                    if(updatedExams.length == 0){
                        updatedExams = ["No hay examenes"];
                    }else{
                        setExams(updatedExams);
                    }
                    setLoading(false);
                }
            })
        })
        setRefresh(false);
        console.log("Refresh :",refresh);
    }, [props.menuState,refresh])
    
    switch (props.menuState) {
        case 1:
            return <ProfHome />  
        default:
            if(loading){
                return <div>Cargando ...</div>
            }
            return <div>
                <h1>{props.menuState.name}</h1>
                <ExamsTable exams={exams} setRefresh={setRefresh}/>
            </div>
    }
    return <div>
        
    </div>
}