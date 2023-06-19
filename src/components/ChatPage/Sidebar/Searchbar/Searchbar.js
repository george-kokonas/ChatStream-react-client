import styles from "./Searchbar.module.scss";

const Searchbar = ({
  allUsers,
  setFilteredUsers,
  setSearchQuery,
  searchQuery,
}) => {
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter users based on search query
    const filteredUserResults = allUsers.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filteredUserResults);
  };
  return (
    <>
      <input
        className={styles.searchbar}
        type='text'
        placeholder='Search...'
        value={searchQuery}
        onChange={handleSearch}
      />
    </>
  );
};

export default Searchbar;
