import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import categories from "../../lists/categories";
import statuses from "../../lists/statuses";
import { Button, Row, Col } from "react-bootstrap";
import { useCollection } from "../../hooks/useCollection";
import { updateDocument } from "../../firestore/firestoreService";
import { toggleSuggestionVoted } from "../../utils/suggestionUtils";

import styles from "./Suggestions.module.css";

const defaultFilters = {
  selectedCategory: "All",
  selectedStatus: "All",
  searchText: "",
  isSortedByNew: true,
};

const Suggestions = () => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [archivingSuggestion, setArchivingSuggestion] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [showStatuses, setShowStatuses] = useState(false);

  const { loggedInUser } = useAuthContext();
  const navigate = useNavigate();

  const { documents: approvedSuggestions } = useCollection(
    // Collection name
    "suggestions",
    // Basic filters - approvedForRelease && !archived;
    [
      {
        conditionName: "approvedForRelease",
        conditionType: "==",
        conditionValue: true,
      },
      {
        conditionName: "archived",
        conditionType: "==",
        conditionValue: false,
      },
    ],
    // Order by
    [
      {
        fieldName: "dateCreated",
        desc: true,
      },
    ]
  );

  useEffect(() => {
    if (approvedSuggestions) {
      setSuggestions(approvedSuggestions);
      setLoading(false);
    }
  }, [approvedSuggestions]);

  const getFilteredSuggestions = (suggestions, currentFilters) => {
    if (!suggestions) {
      return [];
    }

    if (!currentFilters) {
      return suggestions;
    }

    let output = [...suggestions];

    // Basic sorting of suggestions
    output.sort((a, b) => b.dateCreated - a.dateCreated);

    // Sort by popularity if that is selected
    if (currentFilters.isSortedByNew === false) {
      output.sort((a, b) => b.userVotes?.length - a.userVotes?.length);
    }

    if (currentFilters.selectedCategory !== "All") {
      output = output.filter((s) => {
        return s.category?.categoryName === currentFilters.selectedCategory;
      });
    }

    if (currentFilters.selectedStatus !== "All") {
      output = output.filter((s) => {
        return s.suggestionStatus?.statusName === currentFilters.selectedStatus;
      });
    }

    if (currentFilters.searchText.trim().length > 0) {
      output = output.filter((s) => {
        const result =
          s.suggestion
            .toLowerCase()
            .includes(currentFilters.searchText.toLowerCase()) ||
          s.description
            .toLowerCase()
            .includes(currentFilters.searchText.toLowerCase());
        return result;
      });
    }
    return output;
  };

  useEffect(() => {
    const filtersFromStorage = JSON.parse(localStorage.getItem("filters"));
    if (filtersFromStorage) {
      setFilters(filtersFromStorage);
    }
  }, []);

  useEffect(() => {
    setFilteredSuggestions(getFilteredSuggestions(suggestions, filters));
  }, [suggestions, filters]);

  const setAndSaveFilters = (updatedFilters) => {
    setFilters(updatedFilters);
    localStorage.setItem("filters", JSON.stringify(updatedFilters));
  };

  const orderByNew = (isNew) => {
    const updatedFilters = { ...filters, isSortedByNew: isNew };
    setAndSaveFilters(updatedFilters);
  };

  const onSearchInput = (searchInput) => {
    const updatedFilters = { ...filters, searchText: searchInput };
    setAndSaveFilters(updatedFilters);
  };

  const onCategoryClick = (category) => {
    const updatedFilters = { ...filters, selectedCategory: category };
    setShowCategories(false);
    setAndSaveFilters(updatedFilters);
  };

  const onStatusClick = (status) => {
    const updatedFilters = { ...filters, selectedStatus: status };
    setShowStatuses(false);
    setAndSaveFilters(updatedFilters);
  };

  const handleSearchInputChange = async (event) => {
    onSearchInput(event.currentTarget.value);
  };

  const sortedByNewClass = (isNew) => {
    if (isNew === filters.isSortedByNew) {
      return styles["sort-selected"];
    } else {
      return "";
    }
  };

  const voteUp = async (suggestion) => {
    if (!loggedInUser) {
      navigate("/login");
    }

    if (suggestion.author.id === loggedInUser.id) {
      // Can't vote on your own suggerstion
      return;
    }
    suggestion = toggleSuggestionVoted(suggestion, loggedInUser.id);
    await updateDocument("suggestions", suggestion);
  };

  const archiveSuggestion = async () => {
    await updateDocument("suggestions", {
      ...archivingSuggestion,
      archived: true,
    });
    setArchivingSuggestion(null);
  };

  const getUserCanVoteClass = (suggestion) => {
    if (!loggedInUser || suggestion.author.id === loggedInUser.id) {
      return styles["cannot-vote"];
    }
    return styles["can-vote"];
  };

  const getVoteClass = (suggestion) => {
    let result = "";
    if (!suggestion.userVotes || suggestion.userVotes.length === 0) {
      result = styles["suggestion-entry-no-votes"];
    } else if (
      loggedInUser &&
      suggestion.userVotes.find((u) => u === loggedInUser.id)
    ) {
      result = styles["suggestion-entry-voted"];
    } else {
      result = styles["suggestion-entry-not-voted"];
    }
    result = result + " " + getUserCanVoteClass(suggestion);
    return result;
  };

  const handleDetailsClick = (suggestion) => {
    navigate(`/details/${suggestion.id}`);
  };

  const getUpvoteTopText = (suggestion) => {
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

  const getUpvoteBottomText = (suggestion) => {
    if (suggestion.userVotes?.length > 1) {
      return "Upvotes";
    } else {
      return "Upvote";
    }
  };

  const getSelectedCategoryClass = (category) => {
    if (category === filters.selectedCategory) {
      return styles["selected-category"];
    } else {
      return "";
    }
  };

  const getSelectedStatusClass = (status) => {
    if (status === filters.selectedStatus) {
      return styles["selected-status"];
    } else {
      return "";
    }
  };

  const getSuggestionStatusClass = (suggestion) => {
    switch (suggestion?.suggestionStatus?.statusName) {
      case "Completed":
        return styles["suggestion-entry-status-completed"];
      case "Watching":
        return styles["suggestion-entry-status-watching"];
      case "Upcoming":
        return styles["suggestion-entry-status-upcoming"];
      case "Dismissed":
        return styles["suggestion-entry-status-dismissed"];
      default:
        return styles["suggestion-entry-status-none"];
    }
  };

  return (
    <>
      <h1 className='page-heading text-uppercase mb-4'>Training Suggestions</h1>
      <div className={styles["suggestion-container"]}>
        <Button
          variant='btn btn-outline-light btn-lg'
          className='primary-button text-uppercase'
          onClick={() => navigate(loggedInUser ? "/create" : "/login")}
        >
          Suggest
        </Button>
      </div>

      <Row>
        <Col md={4} className='suggestions-count mt-2 text-light'>
          {!loading && `${filteredSuggestions?.length} Suggestions`}
        </Col>
        <Col md={4} xl={5} className='btn-group'>
          <Button
            variant='btn'
            className={`${styles["btn-order"]} ${sortedByNewClass(true)}`}
            onClick={() => {
              orderByNew(true);
            }}
          >
            New
          </Button>
          <Button
            variant='btn'
            className={`${styles["btn-order"]} ${sortedByNewClass(false)}`}
            onClick={() => {
              orderByNew(false);
            }}
          >
            Popular
          </Button>
        </Col>
        <Col md={4} xl={3} className={styles["search-box"]}>
          <input
            aria-label='Search box'
            type='text'
            value={filters.searchText}
            placeholder='Search'
            className='form-control rounded-control'
            onChange={(evt) => handleSearchInputChange(evt)}
          />
        </Col>
      </Row>
      <Col className='d-block d-md-none'>
        {showCategories && (
          <>
            <div className={styles.categories}>
              <span
                className={`${styles["cursor-pointer"]} text-uppercase fw-bold`}
                onClick={() => setShowCategories(false)}
              >
                Category
              </span>
              <div
                className={getSelectedCategoryClass("All")}
                onClick={() => onCategoryClick("All")}
              >
                All
              </div>
              {categories.map((c) => (
                <div
                  key={c.id}
                  className={getSelectedCategoryClass(c.categoryName)}
                  onClick={() => onCategoryClick(c.categoryName)}
                >
                  {c.categoryName}
                </div>
              ))}
            </div>
          </>
        )}
        {!showCategories && (
          <div
            className={styles.categories}
            onClick={() => setShowCategories(true)}
          >
            <span className={styles["selected-category"]}>
              {filters.selectedCategory}
            </span>
          </div>
        )}

        {showStatuses && (
          <>
            <div className={styles.statuses}>
              <span
                className={`${styles["cursor-pointer"]} text-uppercase fw-bold`}
                onClick={() => setShowStatuses(false)}
              >
                Status
              </span>
              <div
                className={getSelectedStatusClass("All")}
                onClick={() => onStatusClick("All")}
              >
                All
              </div>
              {statuses.map((s) => (
                <div
                  key={s.id}
                  className={getSelectedStatusClass(s.statusName)}
                  onClick={() => onStatusClick(s.statusName)}
                >
                  {s.statusName}
                </div>
              ))}
            </div>
          </>
        )}
        {!showStatuses && (
          <div
            className={styles.statuses}
            onClick={() => setShowStatuses(true)}
          >
            <span className={styles["selected-status"]}>
              {filters.selectedStatus}
            </span>
          </div>
        )}
      </Col>

      <Row>
        <Col md={8} xl={9}>
          {loading && (
            <div className={styles["suggestions-loading"]}>
              <h5 className={styles["loading-text"]}>
                Loading suggestions ...
              </h5>
            </div>
          )}
          {filteredSuggestions &&
            filteredSuggestions.map((s) => (
              <div key={s.id} className={styles["suggestion-entry"]}>
                <div className={`${getVoteClass(s)}`} onClick={() => voteUp(s)}>
                  <div className='text-uppercase'>{getUpvoteTopText(s)}</div>
                  <span
                    className={`oi oi-caret-top ${styles["entry-upvote"]}`}
                  ></span>
                  <div className='text-uppercase'>{getUpvoteBottomText(s)}</div>
                </div>
                <div className={styles["suggestion-entry-text"]}>
                  <div
                    className={styles["suggestion-entry-text-title"]}
                    onClick={() => handleDetailsClick(s)}
                  >
                    {s.suggestion}
                  </div>
                  {(!archivingSuggestion ||
                    archivingSuggestion.id !== s.id) && (
                    <div className={styles["suggestion-entry-bottom"]}>
                      <div className={styles["suggestion-entry-text-category"]}>
                        {s.category?.categoryName}
                      </div>
                      {loggedInUser?.isAdmin && (
                        <Button
                          variant='btn'
                          className={`${styles["suggestion-entry-text-category"]} ${styles["btn-archive"]}`}
                          onClick={() => setArchivingSuggestion(s)}
                        >
                          archive
                        </Button>
                      )}
                    </div>
                  )}
                  {archivingSuggestion?.id === s.id && (
                    <div className={styles["suggestion-entry-bottom"]}>
                      <Button
                        variant='btn'
                        className={`${styles["btn-archive"]} ${styles["btn-archive-confirm"]}`}
                        onClick={archiveSuggestion}
                      >
                        confirm
                      </Button>
                      <Button
                        variant='btn'
                        className={`${styles["btn-archive"]} ${styles["btn-archive-reject"]}`}
                        onClick={() => setArchivingSuggestion(null)}
                      >
                        cancel
                      </Button>
                    </div>
                  )}
                </div>
                <div
                  className={`${
                    styles["suggestion-entry-status"]
                  } ${getSuggestionStatusClass(s)}`}
                >
                  <div className={styles["suggestion-entry-status-text"]}>
                    {s.suggestionStatus?.statusName}
                  </div>
                </div>
              </div>
            ))}
        </Col>
        <Col md={4} xl={3} className='d-none d-md-block'>
          <div className={styles.categories}>
            <span className='text-uppercase fw-bold'>Category</span>
            <div
              className={getSelectedCategoryClass("All")}
              onClick={() => onCategoryClick("All")}
            >
              All
            </div>
            {categories.map((c) => (
              <div
                key={c.id}
                className={getSelectedCategoryClass(c.categoryName)}
                onClick={() => onCategoryClick(c.categoryName)}
              >
                {c.categoryName}
              </div>
            ))}
          </div>
          <div className={styles.statuses}>
            <span className='text-uppercase fw-bold'>Status</span>
            <div
              className={getSelectedStatusClass("All")}
              onClick={() => onStatusClick("All")}
            >
              All
            </div>
            {statuses.map((s) => (
              <div
                key={s.id}
                className={getSelectedStatusClass(s.statusName)}
                onClick={() => onStatusClick(s.statusName)}
              >
                {s.statusName}
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Suggestions;
