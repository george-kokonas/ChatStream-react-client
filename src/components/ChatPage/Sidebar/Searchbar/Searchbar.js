import styles from "./Searchbar.module.scss";

const Searchbar = ({
  allUsers,
  setFilteredUsers,
  setSearchQuery,
  searchQuery,
  setFilteredUserNames,
  friendsUserNames,
  tab,
}) => {
  const handleSearchUser = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter users based on search query
    const filteredUsersResults = allUsers.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filteredUsersResults);
  };

  const handleSearchRoom = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter friends usernames based on search query
    const filteredFriendsUserNames = friendsUserNames.filter((friend) =>
      friend.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUserNames(filteredFriendsUserNames);
  };

  return (
    <>
      <input
        className={styles.searchbar}
        type='text'
        placeholder='Search...'
        value={searchQuery}
        onChange={tab === "users" ? handleSearchUser : handleSearchRoom}
      />
    </>
  );
};

export default Searchbar;
