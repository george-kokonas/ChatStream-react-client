import "./topbar.css";
import { Search } from "@mui/icons-material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <div className='topbarContainer'>
      <div className='topbarLeft'>
        <Link to='/' style={{ textDecoration: "none" }}>
          <span className='logo'>Chat App</span>
        </Link>
      </div>
      <div className='topbarCenter'>
        <div className='searchbar'>
          <Search className='searchIcon' />
          <input placeholder='Search...' className='searchInput' />
        </div>
      </div>
      <div className='topbarRight'>
        <div className='topbarIconItem'>
          <SettingsOutlinedIcon />
        </div>
        <Button component={Link} to='/logout' color='inherit'>
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Topbar;