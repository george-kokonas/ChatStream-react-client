import styles from "./Overview.module.scss";

const Overview = ({ currentUser, allUsers, onlineUsers }) => {
  return (
    <div className={styles.container}>
      <h2> Hello, {currentUser.username}! </h2>
      <div className={styles.overview}>
        <h1>ChatStream Overview :</h1>
        <h2>Total Number of Users : {allUsers?.length} </h2>
        <h3>Online : {onlineUsers?.length} </h3>
        <h3>Offline : {allUsers?.length - onlineUsers?.length} </h3>
      </div>
      <div className={styles.prompt}>
        <p>Select a user from the list to start chatting...</p>
      </div>
    </div>
  );
};

export default Overview;
