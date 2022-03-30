import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Spinner from "../../Spinner";

const PrivateRoute = () => {
  const { loggedInUser, authIsReady } = useAuthContext();

  if (!authIsReady) {
    return <Spinner />;
  }

  return loggedInUser ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;
