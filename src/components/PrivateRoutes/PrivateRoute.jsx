import { Navigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import { LOGIN_URL } from "../../constants/urls";
import { Loading } from "../Loading/Loading";

export function PrivateRoute({ children }) {
  const { user, loading } = useUserContext();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={LOGIN_URL} />;
  }

  return children;
}
