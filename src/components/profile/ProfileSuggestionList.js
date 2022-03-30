import styles from "./Profile.module.css";
import ProfileSuggestion from "./ProfileSuggestion";

const ProfileSuggestionList = (props) => {
  const { suggestions, title, description } = props;

  return (
    <>
      <div className='form-layout mb-3'>
        <h2 className={styles["my-submission-heading"]}>{title}</h2>
        <p className={styles["my-submission-text"]}>{description}</p>

        {suggestions.map((s) => (
          <ProfileSuggestion key={s.id} suggestion={s} />
        ))}
      </div>
    </>
  );
};

export default ProfileSuggestionList;
