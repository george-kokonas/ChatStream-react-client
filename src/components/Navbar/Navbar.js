import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
            <>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                <Link to='/' style={{ textDecoration: "none", color: "white" }}>
                  Chat App
                </Link>
              </Typography>
              <Button component={Link} to='/signup' color='inherit'>
                Sign Up
              </Button>
              <Button component={Link} to='/login' color='inherit'>
                Log In
              </Button>
            </>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
