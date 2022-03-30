import { Markup } from "react-markup-string";

const OwnerNotes = (props) => {
  const { notes } = props;
  const regExp = /https?:\/\/[a-zA-Z0-9/.?_%=\\-]+/g;

  const markuper = (matchText, key) => (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a
      href={matchText}
      key={key}
      target='_blank'
      style={{ color: "var(--primary-color)" }}
    >
      {matchText}
    </a>
  );

  if (!notes || notes.length === 0) {
    return <></>;
  }

  return (
    <Markup regExp={regExp} markuper={markuper}>
      {notes}
    </Markup>
  );
};

export default OwnerNotes;
