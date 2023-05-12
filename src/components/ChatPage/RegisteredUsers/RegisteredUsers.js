const RegisteredUsers = ({ user, rooms }) => {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].members.includes(user._id)) return;
  }

  const newRoomHandler = () => {
    const selectedUser = user;
    console.log(selectedUser);
  };

  return <p onClick={newRoomHandler}>{user.username}</p>;
};

export default RegisteredUsers;
