import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// pages & components
import { useAuthContext } from "./hooks/useAuthContext";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Navbar from "./components/Navbar/Navbar";
import Suggestions from "./pages/Suggestions/Suggestions";
import Profile from "./pages/Profile/Profile";
import Details from "./pages/Details/Details";
import Create from "./pages/Create/Create";
import AdminApproval from "./pages/AdminApproval/AdminApproval";
import { NotAuthorized } from "./pages/NotAuthorized/NotAuthorized";
import EditProfile from "./pages/EditProfile/EditProfile";
import { About } from "./pages/About/About";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import PrivateRoute from "./components/profile/RouteProtection/PrivateRoute";
import AdminRoute from "./components/profile/RouteProtection/AdminRoute";
import GuestRoute from "./components/profile/RouteProtection/GuestRoute";

function App() {
  const { authIsReady } = useAuthContext();

  return (
    <div className='page'>
      <main className='container-xxl'>
        {authIsReady && (
          <>
            <Router>
              <Navbar />
              <article className='content pt-1'>
                <Routes>
                  <Route path='/' element={<Suggestions />} />
                  <Route path='/login' element={<GuestRoute />}>
                    <Route path='/login' element={<Login />} />
                  </Route>
                  <Route path='/signup' element={<GuestRoute />}>
                    <Route path='/signup' element={<Signup />} />
                  </Route>
                  <Route path='/create' element={<Create />} />
                  <Route path='/profile' element={<Profile />} />
                  <Route path='/edit-profile' element={<EditProfile />} />
                  <Route path='/admin' element={<AdminRoute />}>
                    <Route path='/admin' element={<AdminApproval />} />
                  </Route>
                  <Route path='/not-authorized' element={<NotAuthorized />} />
                  <Route path='/profile' element={<PrivateRoute />}>
                    <Route path='/profile' element={<Profile />} />
                  </Route>
                  <Route path='/forgot-password' element={<ForgotPassword />} />
                  <Route path='/about' element={<About />} />
                  <Route path='/details/:id' element={<Details />} />
                </Routes>
              </article>
            </Router>
            <ToastContainer autoClose={2500} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
