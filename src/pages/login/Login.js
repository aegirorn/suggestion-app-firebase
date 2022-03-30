import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { toast } from "react-toastify";
import { useAuthContext } from "../../hooks/useAuthContext";

import { Button } from "react-bootstrap";
import Profile from "../../assets/Profile.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loggedInUser } = useAuthContext();

  //const [error, setError] = useState("An error");

  const { login, error, isPending } = useLogin();
  //const isPending = false;
  //const error = null;

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      navigate("/");
    }

    return () => {};
  }, [loggedInUser, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      login(email, password);
    } catch {}
  };

  return (
    <>
      <div className='form-signin mt-5'>
        <Link to='/'>
          <span className='oi oi-chevron-left me-1'></span>Cancel
        </Link>
        <div className='text-center'>
          <img
            className='mb-4 mt-2'
            src={Profile}
            alt=''
            width='280'
            height='57'
          />
        </div>

        <h5>Sign in with your email address</h5>
        <form onSubmit={handleSubmit}>
          <div className='form-floating mb-2'>
            <input
              required
              type='email'
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              className='form-control'
              id='floatingInput'
              placeholder='name@example.com'
            />
            <label htmlFor='floatingInput'>Email address</label>
          </div>
          <div className='form-floating mb-2'>
            <input
              required
              type='password'
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              className='form-control'
              id='floatingPassword'
              placeholder='Password'
            />
            <label htmlFor='floatingPassword'>Password</label>
          </div>
          <div className='mb-3 mx-auto'>
            <Link to='/forgot-password'>Forgot password?</Link>
          </div>

          {!isPending && (
            <Button
              variant='btn btn-outline-light btn-lg'
              className='primary-button text-uppercase w-100'
              type='submit'
            >
              Sign in
            </Button>
          )}
          {isPending && (
            <Button
              variant='btn btn-outline-light btn-lg'
              className='primary-button text-uppercase w-100'
              disabled
            >
              Signing in...
            </Button>
          )}

          <div className='my-4' style={{ display: "flex" }}>
            <h5>Don't have an account?</h5>
            <Link to='/signup' className='sign-up-in-link'>
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
