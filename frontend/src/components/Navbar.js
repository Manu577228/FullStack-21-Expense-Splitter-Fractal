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
  ListItemIcon,
  Divider,
} from "@mui/material";
import { getProfile, logout } from "../services/AuthService";
import MenuIcon from "@mui/icons-material/Menu";
import CallSplitRoundedIcon from "@mui/icons-material/CallSplitRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

/* Design tokens */
const ui = {
  ink: "#0B1020",
  muted: "#64748B",
  teal: "#14B8A6",
  coral: "#F43F5E",
  aurora: "linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%)",
  heat: "linear-gradient(90deg, #F43F5E, #F59E0B)",
  conic:
    "conic-gradient(from 0deg, #14B8A6, #3B82F6, #8B5CF6, #F43F5E, #F59E0B, #14B8A6)",
};

/* A dark pill with a spinning rainbow rim */
const glowRim = {
  position: "relative",
  overflow: "hidden",
  color: "#fff",
  backgroundColor: "transparent",
  "@keyframes ringSpin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-150%",
    background: ui.conic,
    animation: "ringSpin 4s linear infinite",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "2px",
    borderRadius: "inherit",
    backgroundColor: ui.ink,
    transition: "background-color 0.3s ease",
  },
};

/* Text link with an underline that draws itself on hover */
const inkLink = (gradient) => ({
  position: "relative",
  color: ui.ink,
  fontWeight: 700,
  textTransform: "none",
  borderRadius: "999px",
  px: 2,
  backgroundColor: "transparent",
  "&::after": {
    content: '""',
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 5,
    height: 2.5,
    borderRadius: 2,
    background: gradient,
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.35s cubic-bezier(.65,0,.35,1)",
  },
  "&:hover": { backgroundColor: "transparent" },
  "&:hover::after": { transform: "scaleX(1)" },
});

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
      {/* Fully transparent bar: only the elements themselves are visible */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          backgroundImage: "none",
          boxShadow: "none",
          color: ui.ink,
          pointerEvents: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: { xs: 64, md: 80 },
            px: { xs: 2, md: 5 },
          }}
        >
          {/* Brand */}
          <Box
            component={Link}
            to="/"
            sx={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              "&:hover .brand-tile": {
                transform: "rotate(-12deg) scale(1.1)",
              },
            }}
          >
            <Box
              className="brand-tile"
              sx={{
                width: 42,
                height: 42,
                borderRadius: "14px",
                background: ui.aurora,
                backgroundSize: "200% 200%",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                boxShadow:
                  "0 14px 28px -10px rgba(99,102,241,0.8), inset 0 1px 0 rgba(255,255,255,0.4)",
                transition: "transform 0.4s cubic-bezier(.34,1.56,.64,1)",
                animation: "auroraShift 8s ease infinite",
                "@keyframes auroraShift": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
              }}
            >
              <CallSplitRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: ui.ink,
                letterSpacing: "-0.8px",
                lineHeight: 1,
                fontSize: { xs: "1.2rem", sm: "1.55rem" },
              }}
            >
              Expense{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(90deg, #14B8A6, #3B82F6, #8B5CF6, #F43F5E, #14B8A6)",
                  backgroundSize: "300% 100%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  animation: "wordShine 7s linear infinite",
                  "@keyframes wordShine": {
                    from: { backgroundPosition: "0% 0%" },
                    to: { backgroundPosition: "300% 0%" },
                  },
                }}
              >
                Splitter
              </Box>
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box
            sx={{
              pointerEvents: "auto",
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {user ? (
              <>
                {/* Avatar with a spinning ring */}
                <Box sx={{ position: "relative", width: 44, height: 44, mr: 1 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      overflow: "hidden",
                      "@keyframes ringSpin": {
                        from: { transform: "rotate(0deg)" },
                        to: { transform: "rotate(360deg)" },
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: "-50%",
                        background: ui.conic,
                        animation: "ringSpin 4s linear infinite",
                      },
                    }}
                  />
                  <Avatar
                    sx={{
                      position: "absolute",
                      inset: 3,
                      width: "auto",
                      height: "auto",
                      background: ui.aurora,
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      border: "2px solid #fff",
                    }}
                  >
                    {(user.first_name || user.username || "").charAt(0)}
                  </Avatar>
                </Box>
                <Typography
                  sx={{ color: ui.ink, fontWeight: 700, letterSpacing: "-0.2px", mr: 1 }}
                >
                  Hi, {user.first_name || user.username}
                </Typography>
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutRoundedIcon />}
                  sx={{
                    ...inkLink(ui.heat),
                    "&:hover": { backgroundColor: "transparent", color: ui.coral },
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
                  startIcon={<PersonAddAlt1RoundedIcon />}
                  sx={{
                    ...inkLink(ui.aurora),
                    "&:hover": { backgroundColor: "transparent", color: "#0D9488" },
                  }}
                >
                  Register
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  disableElevation
                  sx={{
                    ...glowRim,
                    borderRadius: "999px",
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "0 16px 30px -14px rgba(99,102,241,0.9)",
                    transition: "transform 0.25s ease",
                    "&:hover": {
                      backgroundColor: "transparent",
                      transform: "translateY(-2px) scale(1.03)",
                    },
                    "&:hover::after": { backgroundColor: "#151B33" },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <LoginRoundedIcon sx={{ fontSize: 20 }} />
                    Login
                  </Box>
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ pointerEvents: "auto", display: { xs: "flex", md: "none" } }}>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: "#fff",
                backgroundColor: ui.ink,
                boxShadow: "0 12px 24px -10px rgba(11,16,32,0.6)",
                transition: "all 0.25s ease",
                "&:hover": { background: ui.aurora, transform: "rotate(90deg)" },
              }}
            >
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
            backgroundColor: ui.ink,
            color: "#fff",
            minWidth: 220,
            mt: 1.5,
            borderRadius: "22px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 30px 70px -20px rgba(11,16,32,0.7)",
            "& .MuiMenuItem-root": {
              borderRadius: "14px",
              mx: 1,
              my: 0.25,
              fontWeight: 600,
            },
          },
        }}
      >
        {user ? (
          <>
            <MenuItem
              disabled
              sx={{ "&.Mui-disabled": { opacity: 1, color: "#fff" } }}
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  background: ui.aurora,
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  mr: 1.25,
                  textTransform: "uppercase",
                }}
              >
                {(user.first_name || user.username || "").charAt(0)}
              </Avatar>
              {user.first_name || user.username}
            </MenuItem>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 0.5 }} />
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "#FB7185",
                "&:hover": { bgcolor: "rgba(244,63,94,0.15)" },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>
                <LogoutRoundedIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              component={Link}
              to="/register"
              onClick={handleMenuClose}
              sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }}
            >
              <ListItemIcon sx={{ color: ui.teal, minWidth: 32 }}>
                <PersonAddAlt1RoundedIcon fontSize="small" />
              </ListItemIcon>
              Register
            </MenuItem>
            <MenuItem
              component={Link}
              to="/login"
              onClick={handleMenuClose}
              sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }}
            >
              <ListItemIcon sx={{ color: "#A78BFA", minWidth: 32 }}>
                <LoginRoundedIcon fontSize="small" />
              </ListItemIcon>
              Login
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Spacer */}
      <Toolbar sx={{ minHeight: { xs: 64, md: 80 } }} />
    </>
  );
}