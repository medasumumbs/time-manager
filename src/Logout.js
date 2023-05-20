import { Navigate } from "react-router-dom";
import { logout } from "./auth";

export default function Logout(props){
    if (props.currentUser) {
        logout();
        return null
    } else {
        return <Navigate to="/login" replace/>
    }
}