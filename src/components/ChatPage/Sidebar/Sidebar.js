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
  setIsBarVisible,
}) => {
  // Search for Chats tab is by friend's username
  const [filteredUserNames, setFilteredUserNames] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(allUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("users");

  const filteredRoomsHandler = () => {
    //return the rooms array unmodified
    if (!searchQuery) return rooms;

    //Will hold the rooms that contains the filtered usernames result
    let requestedRooms = [];

    //Find another way - Bad O(n^2) complexity
    for (let i = 0; i < filteredUserNames.length; i++) {
      for (let j = 0; j < rooms.length; j++) {
        if (rooms[j].members.includes(filteredUserNames[i]._id)) {
          requestedRooms.push(rooms[j]);
        }
      }
    }
    //return the matching rooms
    return requestedRooms;
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <ProfileButton
          currentUser={currentUser}
          setMainWindowContent={setMainWindowContent}
          onUserChangeState={onUserChangeState}
          socket={socket}
          setIsBarVisible={setIsBarVisible}
        />
        <Searchbar
          tab={tab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          allUsers={allUsers}
          setFilteredUsers={setFilteredUsers}
          friendsUserNames={allUsers?.filter(
            (user) => user._id !== currentUser._id
          )}
          setFilteredUserNames={setFilteredUserNames}
        />
      </div>

      <div className={styles.tabs}>
        <Tabs
          tab={tab}
          setTab={setTab}
          setMainWindowContent={setMainWindowContent}
          setSearchQuery={setSearchQuery}
          hasPreviousChats={rooms.length}
        />
      </div>
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
          rooms={filteredRoomsHandler()}
          currentRoom={currentRoom}
          friends={allUsers?.filter((user) => user._id !== currentUser._id)}
          onlineUsers={onlineUsers.filter(
            (user) => user.userId !== currentUser._id
            )}
            messagesPreview={messagesPreview}
            unseenMessages={unseenMessages}
            setCurrentRoom={setCurrentRoom}
            setMainWindowContent={setMainWindowContent}
            updateMessagesStatus={updateMessagesStatus}
            setIsBarVisible={setIsBarVisible}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
