/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { getProfile, logout } from "../services/AuthService";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchProfile();
    else setUser(null);
  }, [location]);

  const fetchProfile = async () => {
    try {
      const profileData = await getProfile();
      setUser(profileData);
    } catch {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  // Mobile menu
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#000",
          borderBottom: "2px solid #fff",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Brand */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "1px",
              fontSize: { xs: "1rem", sm: "1.3rem" },
              "&:hover": { color: "#ccc" },
            }}
          >
            Expense Splitter
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            {user ? (
              <>
                <Avatar
                  sx={{
                    bgcolor: "#fff",
                    color: "#000",
                    fontWeight: 700,
                    border: "2px solid #fff",
                  }}
                >
                  {(user.first_name || user.username || "").charAt(0)}
                </Avatar>
                <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                  Hi, {user.first_name || user.username}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    fontWeight: 700,
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#000",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/register"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    "&:hover": { color: "#ccc" },
                  }}
                >
                  Register
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    "&:hover": { color: "#ccc" },
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: "#000",
            color: "#fff",
            minWidth: 180,
            border: "1px solid #fff",
          },
        }}
      >
        {user ? (
          <>
            <MenuItem disabled>
              <Avatar sx={{ bgcolor: "#fff", color: "#000", mr: 1 }}>
                {(user.first_name || user.username || "").charAt(0)}
              </Avatar>
              {user.first_name || user.username}
            </MenuItem>
            <Divider sx={{ bgcolor: "#333" }} />
            <MenuItem
              onClick={handleLogout}
              sx={{ "&:hover": { bgcolor: "#111" } }}
            >
              Logout
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              component={Link}
              to="/register"
              onClick={handleMenuClose}
              sx={{ "&:hover": { bgcolor: "#111" } }}
            >
              Register
            </MenuItem>
            <MenuItem
              component={Link}
              to="/login"
              onClick={handleMenuClose}
              sx={{ "&:hover": { bgcolor: "#111" } }}
            >
              Login
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Spacer */}
      <Toolbar />
    </>
  );
}
