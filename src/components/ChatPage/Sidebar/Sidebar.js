import { useState } from "react";

import ProfileButton from "./ProfileButton/ProfileButton";
import Searchbar from "./Searchbar/Searchbar";
import Tabs from "./Tabs/Tabs";
import Rooms from "./Rooms/Rooms";
import AllUsers from "./AllUsers/AllUsers";
import styles from "./Sidebar.module.scss";

const Sidebar = ({
  currentUser,
  allUsers,
  onlineUsers,
  rooms,
  setRooms,
  currentRoom,
  setCurrentRoom,
  messagesPreview,
  unseenMessages,
  updateMessagesStatus,
  setMainWindowContent,
  onUserChangeState,
  socket,
}) => {
  const [tab, setTab] = useState("rooms");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(allUsers);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <ProfileButton
          currentUser={currentUser}
          setMainWindowContent={setMainWindowContent}
          onUserChangeState={onUserChangeState}
          socket={socket}
        />
        <Searchbar
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          allUsers={allUsers}
          setFilteredUsers={setFilteredUsers}
        />
      </div>

      <Tabs tab={tab} setTab={setTab} />
      <div className={styles.content}>
        {tab === "users" && (
          <AllUsers
            currentUser={currentUser}
            users={searchQuery ? filteredUsers : allUsers}
            onlineUsers={onlineUsers}
            rooms={rooms}
            setRooms={setRooms}
            setCurrentRoom={setCurrentRoom}
            />
            )}
        {tab === "rooms" && (
          <Rooms
          rooms={rooms}
          currentRoom={currentRoom}
          friends = {allUsers?.filter(user => user._id !== currentUser._id)}
          onlineUsers={onlineUsers.filter(user => user.userId !== currentUser._id)}
          messagesPreview={messagesPreview}
          unseenMessages={unseenMessages}
          setCurrentRoom={setCurrentRoom}
            setMainWindowContent={setMainWindowContent}
            updateMessagesStatus={updateMessagesStatus}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
