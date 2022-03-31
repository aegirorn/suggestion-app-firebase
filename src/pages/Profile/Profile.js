import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";
import { getUserSuggestions } from "../../firestore/firestoreService";
import ProfileSuggestionList from "../../components/profile/ProfileSuggestionList";

import styles from "./Profile.module.css";
import Spinner from "../../components/Spinner";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState(null);
  const [approved, setApproved] = useState(null);
  const [archived, setArchived] = useState(null);
  const [pending, setPending] = useState(null);
  const [rejected, setRejected] = useState(null);

  const { loggedInUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getSuggestions = async () => {
      const userSuggestions = await getUserSuggestions(loggedInUser.uid);
      setSuggestions(userSuggestions);
    };

    if (loggedInUser) {
      getSuggestions();
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (suggestions) {
      let filteredSuggestions = suggestions.filter(
        (s) => s.approvedForRelease && !s.archived && !s.rejected
      );
      setApproved(filteredSuggestions);

      filteredSuggestions = suggestions.filter(
        (s) => s.approvedForRelease && s.archived && !s.rejected
      );
      setArchived(filteredSuggestions);

      filteredSuggestions = suggestions.filter(
        (s) => !s.approvedForRelease && !s.rejected && !s.archived
      );
      setPending(filteredSuggestions);

      filteredSuggestions = suggestions.filter((s) => s.rejected);
      setRejected(filteredSuggestions);

      setLoading(false);
    }
  }, [suggestions]);

  const handleCloseClick = () => {
    navigate("/");
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <h1 className='page-heading text-uppercase mb-4'>My Profile</h1>
      <Row>
        <Col className='close-button-section'></Col>
        <Button
          variant='btn'
          className={`btn-close ${styles["x-button"]}`}
          onClick={handleCloseClick}
        ></Button>
      </Row>

      <div className='form-layout mb-3'>
        <h2 className={styles["my-submission-heading"]}>My Account</h2>
        <Link to='/edit-profile' className={styles["profile-edit-link"]}>
          <span className={styles["profile-edit-text"]}>Edit My Login</span>
        </Link>
      </div>

      {approved?.length > 0 && (
        <ProfileSuggestionList
          suggestions={approved}
          title={"Approved Suggestions"}
          description={"These are your suggestions that are currently active."}
        />
      )}

      {archived?.length > 0 && (
        <ProfileSuggestionList
          suggestions={archived}
          title={"Archived Suggestions"}
          description={
            "These are your suggestions that were active but did not gain enough traction."
          }
        />
      )}

      {pending?.length > 0 && (
        <ProfileSuggestionList
          suggestions={pending}
          title={"Pending Suggestions"}
          description={
            "These are your suggestions that have not yet been reviewed by the administrators."
          }
        />
      )}

      {rejected?.length > 0 && (
        <ProfileSuggestionList
          suggestions={rejected}
          title={"Rejected Suggestions"}
          description={
            "These are your suggestions that were not deemed to be appropriate for the training suggestion site."
          }
        />
      )}
    </>
  );
};

export default Profile;
