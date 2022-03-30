import { useEffect } from "react";
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

function App() {
  const { loggedInUser, authIsReady } = useAuthContext();

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
                  <Route path='/login' element={<Login />} />
                  <Route path='/signup' element={<Signup />} />
                  <Route path='/create' element={<Create />} />
                  <Route path='/profile' element={<Profile />} />
                  <Route path='/edit-profile' element={<EditProfile />} />
                  <Route path='/admin' element={<AdminApproval />} />
                  <Route path='/not-authorized' element={<NotAuthorized />} />
                  <Route path='/profile' element={<Profile />} />
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
