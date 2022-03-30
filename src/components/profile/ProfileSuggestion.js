import { formatDate } from "../../utils/suggestionUtils";
import OwnerNotes from "../../components/OwnerNotes";

import styles from "./Profile.module.css";

const ProfileSuggestion = (props) => {
  const { suggestion } = props;

  return (
    <div key={suggestion.id}>
      <hr className={styles["my-submission-separator"]} />
      <div className={`fw-bold ${styles["suggestion-detail-suggestion"]}`}>
        {suggestion.suggestion}
      </div>
      <p className={styles["my-submission-text"]}>
        {formatDate(suggestion.dateCreated)}
      </p>
      <p className={styles["my-submission-text"]}>
        {`Total Votes: ${suggestion.userVotes.length}`}
      </p>
      <p className={styles["my-submission-text"]}>
        {suggestion.category.categoryName}
      </p>
      <p className={styles["my-submission-text"]}>{suggestion.description}</p>
      {suggestion.suggestionStatus && (
        <>
          <div className={`fw-bold ${styles["suggestion-detail-suggestion"]}`}>
            {suggestion.suggestionStatus.statusName}
          </div>
          <div className={styles["my-submission-text"]}>
            <OwnerNotes notes={suggestion?.ownerNotes} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileSuggestion;
