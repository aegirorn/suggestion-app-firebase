function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

export function formatDate(date) {
  return [
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    date.getFullYear(),
  ].join(".");
}

export function toggleSuggestionVoted(suggestion, userId) {
  if (suggestion.author.id === userId) {
    // Can't vote on your own suggerstion
    return suggestion;
  }

  const userVote = suggestion.userVotes.find((u) => u === userId);
  if (userVote) {
    const updatedVotes = suggestion.userVotes.filter((id) => id !== userId);
    suggestion.userVotes = updatedVotes;
  } else {
    suggestion.userVotes.push(userId);
  }
  return suggestion;
}
