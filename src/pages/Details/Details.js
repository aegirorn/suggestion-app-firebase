import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";
import { getDocById } from "../../firestore/firestoreService";
import { toggleSuggestionVoted } from "../../utils/suggestionUtils";
import statuses from "../../lists/statuses";
import OwnerNotes from "../../components/OwnerNotes";
import { useDocument } from "../../hooks/useDocument";

import styles from "./Details.module.css";
import Spinner from "../../components/Spinner";

const Details = () => {
  const { id } = useParams();
  const { loggedInUser } = useAuthContext();
  const navigate = useNavigate();

  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [settingStatus, setSettingStatus] = useState("");
  const [urlText, setUrlText] = useState("");

  const { isPending, updateDocument } = useDocument("suggestions", id);

  useEffect(() => {
    const fetchSuggestion = async () => {
      const suggestionfromDb = await getDocById("suggestions", id);

      if (suggestionfromDb) {
        setSuggestion(suggestionfromDb);
      }
      setLoading(false);
      setLoaded(true);
    };

    fetchSuggestion();
  }, [id, loaded]);

  const handleCloseClick = () => {
    navigate("/");
  };

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return [
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
      date.getFullYear(),
    ].join(".");
  }

  const voteUp = () => {
    if (!loggedInUser) {
      navigate("/login");
    }

    if (suggestion.author.id === loggedInUser.uid) {
      // Can't vote on your own suggerstion
      return;
    }
    const updatedSuggestion = toggleSuggestionVoted(
      suggestion,
      loggedInUser.uid
    );
    updateDocument("suggestions", updatedSuggestion);
    setLoaded(false);
  };

  const getStatusByName = (statusName) => {
    const result = statuses.find(
      (s) => s.statusName.toLowerCase() === statusName.toLowerCase()
    );
    return result;
  };

  const completeSetStatus = () => {
    let updatedSuggestion = { ...suggestion };

    const completedNotes =
      "You are right, this is an important topic for developers. We created a resource about it here:";
    const watchingNotes =
      "We noticed the interest this suggestion is getting! If more people are interested we may address this topic in an upcoming resource.";
    const upcomingNotes =
      "Great suggestion! We have a resource in the pipeline to address this topic.";
    const dismissedNotes =
      "Somtimes a good idea doesn't fit within our scope and vision. This is one of those ideas.";

    switch (settingStatus.toLowerCase()) {
      case "completed":
        if (urlText.length === 0) {
          return;
        }
        updatedSuggestion.suggestionStatus = getStatusByName(settingStatus);
        updatedSuggestion.ownerNotes = `${completedNotes} ${urlText}`;
        break;
      case "watching":
        updatedSuggestion.suggestionStatus = getStatusByName(settingStatus);
        updatedSuggestion.ownerNotes = watchingNotes;
        break;
      case "upcoming":
        updatedSuggestion.suggestionStatus = getStatusByName(settingStatus);
        updatedSuggestion.ownerNotes = upcomingNotes;
        break;
      case "dismissed":
        updatedSuggestion.suggestionStatus = getStatusByName(settingStatus);
        updatedSuggestion.ownerNotes = dismissedNotes;
        break;

      default:
        return;
    }
    updateDocument("suggestions", updatedSuggestion);
    setSuggestion(updatedSuggestion);
    setSettingStatus("");
  };

  const getUpvoteTopText = () => {
    if (suggestion.userVotes?.length > 0) {
      let voteCount = suggestion.userVotes.length.toString();
      if (voteCount.length < 2) {
        voteCount = "0" + voteCount;
      }
      return voteCount;
    } else {
      if (suggestion.author.id === loggedInUser?.id) {
        return "Awaiting";
      } else {
        return "Click To";
      }
    }
  };

  const getUpvoteBottomText = () => {
    if (suggestion.userVotes?.length > 1) {
      return "Upvotes";
    } else {
      return "Upvote";
    }
  };

  const getUserCanVoteClass = () => {
    if (!loggedInUser || suggestion.author.id === loggedInUser.uid) {
      return styles["cannot-vote"];
    }
    return styles["can-vote"];
  };

  const getVoteClass = () => {
    let result = "";

    let loggedInUserVote = suggestion?.userVotes.find(
      (vote) => vote === loggedInUser?.id
    );

    if (!suggestion.userVotes || suggestion.userVotes.length === 0) {
      result = styles["suggestion-detail-no-votes"];
    } else if (loggedInUserVote) {
      result = styles["suggestion-detail-voted"];
    } else {
      result = styles["suggestion-detail-not-voted"];
    }

    result = result + " " + getUserCanVoteClass();
    return result;
  };

  const getStatusClass = () => {
    switch (suggestion?.suggestionStatus?.statusName) {
      case "Completed":
        return styles["suggestion-detail-status-complete"];
      case "Watching":
        return styles["suggestion-detail-status-watching"];
      case "Upcoming":
        return styles["suggestion-detail-status-upcoming"];
      case "Dismissed":
        return styles["suggestion-detail-status-dismissed"];

      default:
        return styles["suggestion-detail-status-none"];
    }
  };

  if (isPending) {
    return <Spinner />;
  }

  if (!suggestion) {
    return <h4>{`No suggestion with the id of ${id} was found`}</h4>;
  }

  return (
    <>
      <h1 className='page-heading text-uppercase mb-4'>Suggestion Details</h1>
      <Row className={`justify-content-center ${styles["detail-form"]}`}>
        <Col xl={8} lg={10} className='form-layout'>
          {suggestion && (
            <>
              <Row className={styles["suggestion-detail-row"]}>
                <Col xs={11} className={styles["suggestion-detail"]}>
                  <div>
                    <div className={getVoteClass()} onClick={() => voteUp()}>
                      <div className='text-uppercase'>{getUpvoteTopText()}</div>
                      <span className='oi oi-caret-top detail-upvote'></span>
                      <div className='text-uppercase'>
                        {getUpvoteBottomText()}
                      </div>
                    </div>
                    <div className={styles["suggestion-detail-date"]}>
                      <div>{formatDate(suggestion.dateCreated.toDate())} </div>
                    </div>
                  </div>
                  <div className={styles["suggestion-detail-text"]}>
                    <div
                      className={`fw-bold mb-2 ${styles["suggestion-detail-suggestion"]}`}
                    >
                      {suggestion.suggestion}
                    </div>
                    <div
                      className={`mb-2 ${styles["suggestion-detail-author"]}`}
                    >
                      {suggestion.author.displayName}
                    </div>
                    <div className='mb-2 d-none d-md-block'>
                      {suggestion.description}
                    </div>
                    <div
                      className={`d-none d-md-block ${styles["suggestion-entry-text-category"]}`}
                    >
                      {suggestion.category.categoryName}
                    </div>
                  </div>
                </Col>
                <Col xs={1} className='close-button-section'>
                  <Button
                    variant='btn'
                    className='btn-close'
                    onClick={handleCloseClick}
                  ></Button>
                </Col>
              </Row>
              <Row className='d-block d-md-none'>
                <div className={styles["suggestion-detail-text"]}>
                  <div>{suggestion.description}</div>
                  <div className={styles["suggestion-entry-text-category"]}>
                    {suggestion.category.categoryName}
                  </div>
                </div>
              </Row>
            </>
          )}
        </Col>
      </Row>
      {suggestion.suggestionStatus && (
        <Row className={`justify-content-center ${styles["detail-form"]}`}>
          <Col
            xl={8}
            lg={10}
            className={`form-layout ${styles["suggestion-results"]}`}
          >
            <div className={getStatusClass()}></div>
            <div className={styles["suggestion-detail-status-section"]}>
              <div
                className={`fw-bold mb-2 ${styles["suggestion-detail-status"]} ${styles["suggestion-detail-suggestion"]}`}
              >
                {suggestion.suggestionStatus.statusName}
              </div>
              <div className={styles["suggestion-detail-owner-notes"]}>
                <OwnerNotes notes={suggestion.ownerNotes} />
              </div>
            </div>
          </Col>
        </Row>
      )}

      {suggestion && loggedInUser?.isAdmin && (
        <>
          <Row className={`justify-content-center ${styles["detail-form"]}`}>
            <Col
              xl={8}
              lg={10}
              className={`form-layout ${styles["admin-details"]}`}
            >
              <div
                className={`fw-bold mb-2 ${styles["suggestion-detail-status"]} ${styles["suggestion-detail-suggestion"]}`}
              >
                Set Status
              </div>
              {settingStatus.length === 0 && (
                <div className={styles["admin-set-statuses"]}>
                  <Button
                    variant='btn'
                    className={`${styles["suggestion-entry-text-category"]} ${styles["btn-archive"]} ${styles["btn-status-completed"]}`}
                    onClick={() => {
                      setSettingStatus("completed");
                    }}
                  >
                    completed
                  </Button>
                  <Button
                    variant='btn'
                    className={`${styles["suggestion-entry-text-category"]} ${styles["btn-archive"]} ${styles["btn-status-watching"]}`}
                    onClick={() => {
                      setSettingStatus("watching");
                    }}
                  >
                    watching
                  </Button>
                  <Button
                    variant='btn'
                    className={`${styles["suggestion-entry-text-category"]} ${styles["btn-archive"]} ${styles["btn-status-upcoming"]}`}
                    onClick={() => {
                      setSettingStatus("upcoming");
                    }}
                  >
                    upcoming
                  </Button>
                  <Button
                    variant='btn'
                    className={`${styles["suggestion-entry-text-category"]} ${styles["btn-archive"]} ${styles["btn-status-dismissed"]}`}
                    onClick={() => {
                      setSettingStatus("dismissed");
                    }}
                  >
                    dismissed
                  </Button>
                </div>
              )}
              {settingStatus === "completed" && (
                <div>
                  <input
                    onChange={(e) => setUrlText(e.target.value)}
                    type='text'
                    value={urlText}
                    placeholder='Url'
                    aria-label='Content Url'
                    className='form-control rounded-control'
                  />
                  <div className={styles["suggestion-entry-bottom"]}>
                    <Button
                      variant='btn'
                      className={styles["btn-archive-confirm"]}
                      onClick={completeSetStatus}
                    >
                      confirm
                    </Button>
                    <Button
                      variant='btn'
                      className={styles["btn-archive-reject"]}
                      onClick={() => {
                        setSettingStatus("");
                      }}
                    >
                      cancel
                    </Button>
                  </div>
                </div>
              )}
              {settingStatus.length > 0 && settingStatus !== "completed" && (
                <div className={styles["suggestion-entry-bottom"]}>
                  <Button
                    variant='btn'
                    className={styles["btn-archive-confirm"]}
                    onClick={completeSetStatus}
                  >
                    confirm
                  </Button>
                  <Button
                    variant='btn'
                    className={styles["btn-archive-reject"]}
                    onClick={() => {
                      setSettingStatus("");
                    }}
                  >
                    cancel
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default Details;
