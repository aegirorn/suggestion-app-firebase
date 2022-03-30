import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useResetPassword } from "../../hooks/useResetPassword";
import Profile from "../../assets/Profile.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const { resetPassword, error, isPending } = useResetPassword();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(email);
  };

  return (
    <>
      <div className='form-signin mt-5'>
        <Link to={-1}>
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

        <h5>Password Reset</h5>
        <form onSubmit={handleSubmit}>
          <div className='form-floating mb-2'>
            <input
              required
              type='email'
              value={email}
              name='email'
              onChange={handleChange}
              className='form-control'
              id='emailInput'
              placeholder='Email Address'
            />
            <label htmlFor='emailInput'>Email Address</label>
          </div>

          {!isPending && (
            <Button
              variant='btn btn-outline-light btn-lg'
              className='primary-button text-uppercase w-100'
              type='submit'
            >
              Reset Password
            </Button>
          )}
          {isPending && (
            <Button
              variant='btn btn-outline-light btn-lg'
              className='primary-button text-uppercase w-100'
              disabled
            >
              Sending reset email...
            </Button>
          )}
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
