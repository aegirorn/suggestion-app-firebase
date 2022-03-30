import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";
import { updateDocument } from "../../firestore/firestoreService";

import styles from "./AdminApproval.module.css";
import { useCollection } from "../../hooks/useCollection";

const AdminApproval = () => {
  const [loading, setLoading] = useState(true);
  const [currentEditingTitle, setCurrentEditingTitle] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [currentEditingDescription, setCurrentEditingDescription] =
    useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const navigate = useNavigate();
  //const { user: loggedInUser } = useAuthContext();

  const { loggedInUser } = useAuthContext();
  console.log("loggedInUser", loggedInUser);

  if (!loggedInUser) {
    navigate("/not-authorized");
  }

  let filters = [
    {
      conditionName: "approvedForRelease",
      conditionType: "==",
      conditionValue: false,
    },
    {
      conditionName: "rejected",
      conditionType: "==",
      conditionValue: false,
    },
  ];

  let direction = [
    {
      fieldName: "dateCreated",
      desc: true,
    },
  ];

  const { documents: submissions } = useCollection(
    "suggestions",
    filters,
    direction
  );

  useEffect(() => {
    if (submissions) {
      setLoading(false);
    }
  }, [submissions]);

  const handleCloseClick = () => {
    navigate("/");
  };

  const editTitle = (suggestion) => {
    setEditedTitle(suggestion.suggestion);
    setCurrentEditingTitle(suggestion.id);
    setCurrentEditingDescription("");
  };

  const editDescription = (suggestion) => {
    setEditedDescription(suggestion.description);
    setCurrentEditingTitle("");
    setCurrentEditingDescription(suggestion.id);
  };

  const saveTitle = async (suggestion) => {
    setCurrentEditingTitle("");

    const updatedSuggestion = {
      ...suggestion,
      suggestion: editedTitle,
    };
    updateDocument("suggestions", updatedSuggestion);
  };

  const saveDescription = async (suggestion) => {
    setCurrentEditingDescription("");

    const updatedSuggestion = {
      ...suggestion,
      description: editedDescription,
    };
    await updateDocument("suggestions", updatedSuggestion);
  };

  const approveSubmission = async (suggestion) => {
    const updatedSuggestion = {
      ...suggestion,
      approvedForRelease: true,
    };
    await updateDocument("suggestions", updatedSuggestion);
  };
  const rejectSubmission = async (suggestion) => {
    const updatedSuggestion = {
      ...suggestion,
      rejected: true,
    };
    await updateDocument("suggestions", updatedSuggestion);
  };

  if (loading) {
    return (
      <>
        <h1 className='page-heading text-uppercase mb-4'>
          Pending Submissions
        </h1>
        <Row>
          <Col className='close-button-section'>
            <Button
              variant='btn'
              className='btn-close'
              onClick={handleCloseClick}
            ></Button>
          </Col>
        </Row>
        <div className={styles["suggestions-loading"]}>
          <h5 className={styles["loading-text"]}>Loading submissions ...</h5>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className='page-heading text-uppercase mb-4'>Pending Submissions</h1>
      <Row>
        <Col sm={8} className={styles["suggestions-count"]}>{`${
          submissions ? submissions.length : "0"
        } Submissions`}</Col>
        <Col sm={4} className='close-button-section'>
          <Button
            variant='btn'
            className='btn-close'
            onClick={handleCloseClick}
          ></Button>
        </Col>
      </Row>
      {submissions?.length > 0 && (
        <Row>
          {submissions
            .sort((a, b) => b.dateCreated - a.dateCreated)
            .map((s) => (
              <Row key={s.id} className={styles["submission"]}>
                <Col lg={2} md={3} sm={4}>
                  <Button
                    variant='btn'
                    className={styles["btn-approve"]}
                    onClick={() => approveSubmission(s)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant='btn'
                    className={styles["btn-reject"]}
                    onClick={() => rejectSubmission(s)}
                  >
                    Reject
                  </Button>
                </Col>
                <Col lg={10} md={9} sm={8}>
                  <div>
                    {currentEditingTitle === s.id && (
                      <form
                        className={styles["approval-edit-form"]}
                        onSubmit={() => saveTitle(s)}
                      >
                        <input
                          type='text'
                          onChange={(e) => setEditedTitle(e.target.value)}
                          value={editedTitle}
                          className='form-control'
                        />
                        <Button variant='btn' type='submit'>
                          <span
                            className={`${styles["submission-edit-approve"]} oi oi-check`}
                          ></span>
                        </Button>
                        <Button
                          variant='btn'
                          type='button'
                          onClick={() => setCurrentEditingTitle("")}
                        >
                          <span
                            className={`${styles["submission-edit-reject"]} oi oi-x`}
                          ></span>
                        </Button>
                      </form>
                    )}
                    {currentEditingTitle !== s.id && (
                      <div>
                        {s.suggestion}
                        <span
                          onClick={() => editTitle(s)}
                          className={`${styles["submission-edit-icon"]} oi oi-pencil`}
                        ></span>
                      </div>
                    )}
                  </div>
                  <div>{s.category.categoryName}</div>
                  <div>{s.author.displayName}</div>
                  <div>
                    {currentEditingDescription === s.id && (
                      <form
                        className={styles["approval-edit-form"]}
                        onSubmit={() => saveDescription(s)}
                      >
                        <input
                          type='text'
                          onChange={(e) => setEditedDescription(e.target.value)}
                          value={editedDescription}
                          className='form-control'
                        />
                        <Button variant='btn' type='submit'>
                          <span
                            className={`${styles["submission-edit-approve"]} oi oi-check`}
                          ></span>
                        </Button>
                        <Button
                          variant='btn'
                          type='button'
                          onClick={() => setCurrentEditingDescription("")}
                        >
                          <span
                            className={`${styles["submission-edit-reject"]} oi oi-x`}
                          ></span>
                        </Button>
                      </form>
                    )}
                    {currentEditingDescription !== s.id && (
                      <div>
                        {s.description}
                        <span
                          onClick={() => editDescription(s)}
                          className={`${styles["submission-edit-icon"]} oi oi-pencil`}
                        ></span>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            ))}
        </Row>
      )}
    </>
  );
};

export default AdminApproval;
