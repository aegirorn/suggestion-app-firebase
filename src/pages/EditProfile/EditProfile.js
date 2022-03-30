import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import Profile from "../../assets/Profile.png";
import { collectionGroup } from "firebase/firestore";

const EditProfile = () => {
  const { loggedInUser } = useAuthContext();

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
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    updateNames,
    updateUserEmail,
    updateUserPassword,
    error,
    success,
    isPending,
  } = useUpdateProfile();

  const navigate = useNavigate();

  useEffect(() => {
    if (hasSubmitted && success) {
      toast.success(success, {
        autoClose: 2000,
        onClose: () => navigate(-1),
      });
    }
  }, [hasSubmitted, success, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (loggedInUser) {
      const userValues = {
        email: loggedInUser.email,
        newPassword: "",
        confirmedPassword: "",
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        displayName: loggedInUser.displayName,
      };
      setFormValues(userValues);
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors(null);
  };

  const validate = (values) => {
    if (formValues.newPassword === "" && formValues.confirmedPassword === "") {
      // Nothing to validate - the form is OK
      return null;
    }

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
      if (formValues.newPassword !== "") {
        // Ghange password.
        await updateUserPassword(formValues.newPassword);
      }

      if (formValues.email !== loggedInUser.email) {
        // Ghange email.
        console.log("Email has changed");
        await updateUserEmail(formValues.email);
      }

      console.log("Email has not changed");

      if (
        formValues.firstName !== loggedInUser.firstName ||
        formValues.lastName !== loggedInUser.lastName ||
        formValues.displayName !== loggedInUser.displayName
      ) {
        console.log("Names have changed");

        // Ghange the rest.
        await updateNames(
          formValues.firstName,
          formValues.lastName,
          formValues.displayName
        );
      }
    }
    setHasSubmitted(true);
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

        <h5>Update Profile</h5>
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
              type='password'
              value={formValues.newPassword}
              onChange={handleChange}
              className='form-control'
              name='newPassword'
              id='password'
              autoComplete='new-password'
              placeholder='Leave blank to keep the same'

              // onBlur={handleOnBlur}
            />
            <label htmlFor='password'>
              Password (Leave blank to keep the same)
            </label>
            {formErrors?.newPassword && (
              <div className='error'>{formErrors.newPassword}</div>
            )}
          </div>

          <div className='form-floating mb-2'>
            <input
              type='password'
              value={formValues.confirmedPassword}
              name='confirmedPassword'
              onChange={handleChange}
              className='form-control'
              id='confirmedPassword'
              placeholder='Leave blank to keep the same'
              //onBlur={handleOnBlur}
            />
            <label htmlFor='confirmedPassword'>
              Confirm Password (Leave blank to keep the same)
            </label>
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
              Update
            </Button>
          )}
          {isPending && (
            <Button
              variant='btn btn-outline-light btn-lg'
              className='primary-button text-uppercase w-100'
              disabled
            >
              Updating...
            </Button>
          )}
        </form>
      </div>
    </>
  );
};

export default EditProfile;
