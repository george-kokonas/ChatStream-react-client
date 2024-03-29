import TextInput from "../../../UI/TextInput/TextInput";

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
    <TextInput
      type='text'
      value={searchQuery}
      placeholder='Search...'
      width='70%'
      height='40px'
      mobileWidth='70%'
      mobileHeight='70%'
      backgroundColor='rgb(186, 201, 207)'
      borderRadius='7px'
      onChange={tab === "users" ? handleSearchUser : handleSearchRoom}
    />
  );
};

export default Searchbar;
