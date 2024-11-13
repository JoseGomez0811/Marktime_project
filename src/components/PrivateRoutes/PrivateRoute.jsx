import { Navigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import { LOGIN_URL, NOTFOUND_URL } from "../../constants/urls";
import { Loading } from "../Loading/Loading";

export function PrivateRoute({ children }) {
    const { user, isLoadingUser } = useUserContext();

    if (isLoadingUser) {
        return <Loading />;
    }

    if (!isLoadingUser && !user) {
        return <Navigate to={NOTFOUND_URL} />;
    }

    return children;
}