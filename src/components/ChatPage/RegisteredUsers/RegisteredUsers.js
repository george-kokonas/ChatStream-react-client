const RegisteredUsers = ({
  loggedUser,
  registeredUser,
  rooms,
  onNewConversation,
}) => {
  //render the registered users with whom the user haven't chatted yet
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].members.includes(registeredUser._id)) return;
  }

  const selectedUserHandler = () => {
    //create a room with the selected user
    const selectedUserId = registeredUser._id;
    onNewConversation(selectedUserId);
  };

  return <p onClick={selectedUserHandler}>{registeredUser.username}</p>;
};

export default RegisteredUsers;
