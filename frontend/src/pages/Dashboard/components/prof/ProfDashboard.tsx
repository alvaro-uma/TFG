import { ProfHome } from "./components/Home/Home";


export const ProfDashboard = (props : any) =>{
    switch (props.menuState) {
        case 1:
            return <ProfHome />  
        default:
            return <div>
                Dashboard default para profesor
            </div>
            break;
    }
    return <div>
        
    </div>
}