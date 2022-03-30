import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Spinner from "../../Spinner";

const AdminRoute = () => {
  const { loggedInUser, authIsReady } = useAuthContext();

  if (!authIsReady) {
    return <Spinner />;
  }
  return loggedInUser?.isAdmin ? <Outlet /> : <Navigate to='/not-authorized' />;
};

export default AdminRoute;
