import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useSignup } from "../../hooks/useSignup";
import Profile from "../../assets/Profile.png";

const Signup = () => {
  const initialValues = {
    email: "",
    newPassword: "",
    confirmedPassword: "",
    firstName: "",
    lastName: "",
    displayName: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState();
  const { signup, error, isPending } = useSignup();
  const { loggedInUser } = useAuthContext();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors(null);
  };

  const validate = (values) => {
    const errors = {};
    let formHasErrors = false;

    if (values.newPassword?.length < 7) {
      //newPassword
      errors.newPassword = "The Password must be at least 6 characters.";
      formHasErrors = true;
    }

    if (formValues.newPassword !== formValues.confirmedPassword) {
      errors.confirmedPassword =
        "Password and Confirmed Password do not match.";
      formHasErrors = true;
    }

    return formHasErrors ? errors : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(formValues);

    if (errors) {
      setFormErrors({ ...errors });
    } else {
      signup(
        formValues.email,
        formValues.newPassword,
        formValues.firstName,
        formValues.lastName,
        formValues.displayName
      );
    }
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

        <h5>Sign up for a new account</h5>
        <form onSubmit={handleSubmit}>
          <div className='form-floating mb-2'>
            <input
              required
              type='email'
              value={formValues.email}
              name='email'
              onChange={handleChange}
              className='form-control'
              id='emailInput'
              placeholder='Email Address'
            />
            <label htmlFor='emailInput'>Email Address</label>
          </div>

          <div className='form-floating mb-2'>
            <input
              required
              type='password'
              value={formValues.newPassword}
              onChange={handleChange}
              className='form-control'
              name='newPassword'
              id='password'
              autoComplete='new-password'
              placeholder='New Password'

              // onBlur={handleOnBlur}
            />
            <label htmlFor='password'>New Password</label>
            {formErrors?.newPassword && (
              <div className='error'>{formErrors.newPassword}</div>
            )}
          </div>

          <div className='form-floating mb-2'>
            <input
              required
              type='password'
              value={formValues.confirmedPassword}
              name='confirmedPassword'
              onChange={handleChange}
              className='form-control'
              id='confirmedPassword'
              placeholder='Confirm New Password'
              //onBlur={handleOnBlur}
            />
            <label htmlFor='confirmedPassword'>Confirm New Password</label>
            {formErrors?.confirmedPassword && (
              <div className='error'>{formErrors.confirmedPassword}</div>
            )}
          </div>

          <div className='form-floating mb-2'>
            <input
              required
              type='text'
              value={formValues.firstName}
              name='firstName'
              onChange={handleChange}
              className='form-control'
              id='firstNameInput'
              placeholder='Given Name'
            />
            <label htmlFor='firstNameInput'>Given Name</label>
          </div>

          <div className='form-floating mb-2'>
            <input
              required
              type='text'
              value={formValues.lastName}
              name='lastName'
              onChange={handleChange}
              className='form-control'
              id='lastNameInput'
              placeholder='Surname'
            />
            <label htmlFor='lastNameInput'>Surname</label>
          </div>

          <div className='form-floating mb-2'>
            <input
              required
              type='text'
              value={formValues.displayName}
              name='displayName'
              onChange={handleChange}
              className='form-control'
              id='displayNameInput'
              placeholder='Display Name'
            />
            <label htmlFor='displayNameInput'>Display Name</label>
          </div>
          {!isPending && (
            <Button
              variant='btn btn-outline-light btn-lg'
              className='primary-button text-uppercase w-100'
              type='submit'
            >
              Sign up
            </Button>
          )}
          {isPending && (
            <Button
              variant='btn btn-outline-light btn-lg'
              className='primary-button text-uppercase w-100'
              disabled
            >
              Signing up...
            </Button>
          )}
          <div className='my-4' style={{ display: "flex" }}>
            <h5>Already have an account?</h5>
            <Link to='/login' className='sign-up-in-link'>
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
