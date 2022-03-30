import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const { loggedInUser } = useAuthContext();
  const { logout, isPending } = useLogout();

  const location = useLocation();
  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/edit-profile"
  ) {
    return <></>;
  }

  //edit-profile

  if (!loggedInUser) {
    return (
      <div className='px-5 pt-3 mb-5 nav-links'>
        <Link to='/login' className='login-link'>
          Login
        </Link>
        <Link to='/about' className='login-link'>
          About
        </Link>
      </div>
    );
  }

  return (
    <div className='px-5 pt-3 mb-5 nav-links'>
      {loggedInUser.isAdmin && (
        <Link to='/admin' className='login-link'>
          Admin
        </Link>
      )}

      <Link to='/profile' className='login-link'>
        Profile
      </Link>

      <Link to='/about' className='login-link'>
        About
      </Link>

      {!isPending && (
        <Link to='/' className='login-link' onClick={logout}>
          Logout
        </Link>
      )}

      {isPending && (
        <Link to='/' className={styles["disabled-link"]}>
          Logging out...
        </Link>
      )}
    </div>
  );
}
