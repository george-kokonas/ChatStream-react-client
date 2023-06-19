import styles from "./Tabs.module.scss"

const Tabs = ({tab,setTab}) => {
    return ( <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${tab === "rooms" ? styles.active : ""}`}
          onClick={() => setTab("rooms")}
        >
          CHATS
        </div>
        <div
          className={`${styles.tab} ${tab === "users" ? styles.active : ""}`}
          onClick={() => setTab("users")}
        >
          USERS
        </div>
      </div>)
}

export default Tabs;