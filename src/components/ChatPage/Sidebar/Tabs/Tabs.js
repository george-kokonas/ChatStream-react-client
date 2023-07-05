import styles from "./Tabs.module.scss";

const Tabs = ({
  tab,
  setTab,
  setSearchQuery,
  hasPreviousChats,
}) => {
  return (
    <div className={styles.tabs}>
      {hasPreviousChats > 0 && (
        <div
          className={`${styles.tab} ${tab === "rooms" ? styles.active : ""}`}
          onClick={() => {
            setTab("rooms");
            setSearchQuery("");
          }}
        >
          CHATS
        </div>
      )}

      <div
        className={`${styles.tab} ${tab === "users" ? styles.active : ""}`}
        onClick={() => {
          setTab("users");
          setSearchQuery("");
        }}
      >
        USERS
      </div>
    </div>
  );
};

export default Tabs;
