import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import categories from "../../lists/categories";
import { useAuthContext } from "../../hooks/useAuthContext";
import { addDocument } from "../../firestore/firestoreService";

import styles from "./Create.module.css";

const Create = () => {
  const initialValues = { title: "", description: "", category: null };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState();

  const { loggedInUser } = useAuthContext();
  const navigate = useNavigate();

  const handleCloseClick = () => {
    navigate("/");
  };

  const submitForm = async () => {
    const newSuggestion = {
      suggestion: formValues.title,
      description: formValues.description,
      dateCreated: new Date(),
      category: formValues.category,
      author: {
        id: loggedInUser.uid,
        displayName: loggedInUser.displayName,
      },
      userVotes: [],
      approvedForRelease: false,
      archived: false,
      rejected: false,
    };

    console.log("loggedInUser: ", loggedInUser);
    console.log("The new suggestion: ", newSuggestion);

    await addDocument("suggestions", newSuggestion);

    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors(null);
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    const category = categories.find((c) => c.id === categoryId);
    setFormValues({ ...formValues, category });
    setFormErrors(null);
  };

  const validate = (values) => {
    const errors = {};
    let formHasErrors = false;

    if (!values.title) {
      errors.title = "The Suggestion field is required.";
      formHasErrors = true;
    } else if (values.title.length > 75) {
      errors.title =
        "The Suggestion field has a maximum length of 75 characters.";
      formHasErrors = true;
    }

    if (values.description.length > 500) {
      errors.description =
        "The Description field has a maximum length of 500 characters.";
      formHasErrors = true;
    }

    if (!values.category) {
      errors.category = "The Category field is required.";
      formHasErrors = true;
    }
    return formHasErrors ? errors : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validate(formValues);
    if (errors) {
      setFormErrors({ ...errors });
    } else {
      submitForm();
    }
  };

  return (
    <>
      <h1 className='page-heading text-uppercase mb-4'>Make a suggestion</h1>
      <Row className={`justify-content-center ${styles["create-form"]}`}>
        <Col xl={8} lg={10} className='form-layout'>
          <div className='close-button-section'>
            <Button
              variant='btn'
              className='btn-close'
              onClick={handleCloseClick}
            ></Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles["input-section"]}>
              {formErrors && (
                <ul className='validation-error'>
                  {formErrors.title && (
                    <li className='validation-message'>{formErrors.title}</li>
                  )}
                  {formErrors.category && (
                    <li className='validation-message'>
                      {formErrors.category}
                    </li>
                  )}
                  {formErrors.description && (
                    <li className='validation-message'>
                      {formErrors.description}
                    </li>
                  )}
                </ul>
              )}

              <label
                className='form-label fw-bold text-uppercase'
                htmlFor='suggestion-text'
              >
                Suggestion
              </label>
              <div className={styles["input-description"]}>
                Focus on the topic or technology you want to learn about.
              </div>
              <input
                className='form-control'
                type='text'
                name='title'
                onChange={handleChange}
                value={formValues.title}
                id='suggestion-text'
              />
            </div>
            <div className={styles["input-section"]}>
              <label
                className='form-label fw-bold text-uppercase'
                htmlFor='category'
              >
                Category
              </label>
              <div className={styles["input-description"]}>
                Choose one category.
              </div>
              <Col lg={8}>
                <div id='category'>
                  {categories.map((c) => (
                    <div key={c.id} className={styles["radio-item-group"]}>
                      <input
                        id={c.id}
                        className='valid'
                        type='radio'
                        value={c.id}
                        checked={formValues?.category?.id === c.id}
                        onChange={handleCategoryChange}
                      />
                      <label htmlFor={c.id}>
                        {c.categoryName} - {c.categoryDescription}
                      </label>
                    </div>
                  ))}
                </div>
              </Col>
            </div>
            <div className={styles["input-section"]}>
              <label
                className='form-label fw-bold text-uppercase'
                htmlFor='description'
              >
                Description
              </label>
              <div className={styles["input-description"]}>
                Briefly descripe your suggestion.
              </div>
              <textarea
                className={styles["form-control"]}
                onChange={handleChange}
                name='description'
                value={formValues.description}
                id='description'
              />
            </div>
            <div className={styles["center-children"]}>
              <Button
                variant='btn btn-lg'
                type='submit'
                className={`text-uppercase ${styles["btn-main"]}`}
              >
                Suggest
              </Button>
            </div>
          </form>
        </Col>
      </Row>
    </>
  );
};

export default Create;
