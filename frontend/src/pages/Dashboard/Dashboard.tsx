
import { Navigate } from "react-router-dom";

import { store } from "../..";
import { sessionStates } from "../../domain/redux/actions";

import { AdminBoard } from "./admin/AdminBoard";
import { DashboardProf } from "./prof/dashboard/DashBoardProf";
import { StudentDashBoard } from "./student/dashboard/StudentDashboard";

export function Dashboard() {

  if (store.getState().sessionState == sessionStates.LOGGED) {
    switch (store.getState().role) {
      case "admin":
        return <AdminBoard />;
      case "prof":
        return <DashboardProf/>;
      case "student":
        return <StudentDashBoard/>;
      default:
        return <div>nada</div>;
    }
  }
  return <Navigate to="/" />;
}
