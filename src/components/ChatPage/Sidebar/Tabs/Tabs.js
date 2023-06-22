import styles from "./Tabs.module.scss";

const Tabs = ({ tab, setTab, setMainWindowContent, setSearchQuery }) => {
  return (
    <div className={styles.tabs}>
      <div
        className={`${styles.tab} ${tab === "rooms" ? styles.active : ""}`}
        onClick={() => {
          setTab("rooms");
          setSearchQuery("");
        }}
      >
        CHATS
      </div>
      <div
        className={`${styles.tab} ${tab === "users" ? styles.active : ""}`}
        onClick={() => {
          setTab("users");
          setMainWindowContent("overview")
          setSearchQuery("")
        }}
      >
        USERS
      </div>
    </div>
  );
};

export default Tabs;
