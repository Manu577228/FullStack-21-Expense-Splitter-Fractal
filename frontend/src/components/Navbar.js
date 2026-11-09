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
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

/* ------------------------------ Design tokens ------------------------------ */
const ui = {
  ink: "#0B1020",
  muted: "#64748B",
  line: "rgba(15,23,42,0.08)",
  teal: "#14B8A6",
  blue: "#3B82F6",
  coral: "#F43F5E",
  aurora: "linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%)",
  auroraX: "linear-gradient(90deg, #14B8A6, #3B82F6, #8B5CF6)",
  heat: "linear-gradient(90deg, #F43F5E, #F59E0B)",
  conic:
    "conic-gradient(from 0deg, #14B8A6, #3B82F6, #8B5CF6, #F43F5E, #F59E0B, #14B8A6)",
};

const display = "'Bricolage Grotesque', 'Inter', system-ui, sans-serif";
const focusRing = { outline: `2px solid ${ui.blue}`, outlineOffset: 3 };

/* Dark pill with a slowly spinning rainbow rim */
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
    animation: "ringSpin 5s linear infinite",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "1.5px",
    borderRadius: "inherit",
    backgroundColor: ui.ink,
    transition: "background-color 0.3s ease",
  },
  "@media (prefers-reduced-motion: reduce)": {
    "&::before": { animation: "none" },
  },
};

/* Text button whose colour floods in from the left on hover */
const sweepButton = (gradient) => ({
  position: "relative",
  height: 42,
  px: 2,
  color: ui.ink,
  fontFamily: display,
  fontWeight: 700,
  textTransform: "none",
  borderRadius: "999px",
  backgroundColor: "transparent",
  backgroundImage: gradient,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "left center",
  backgroundSize: "0% 100%",
  transition:
    "background-size 0.45s cubic-bezier(.65,0,.35,1), color 0.25s ease",
  "&:hover": {
    backgroundColor: "transparent",
    backgroundSize: "100% 100%",
    color: "#fff",
  },
  "&:focus-visible": focusRing,
});

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false); // visual only: tightens the capsule
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchProfile();
    else setUser(null);
  }, [location]);

  /* Load the display typeface once */
  useEffect(() => {
    if (document.getElementById("es-fonts")) return;
    const link = document.createElement("link");
    link.id = "es-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const onRegister = location.pathname === "/register";
  const onLogin = location.pathname === "/login";

  /* Gradient icon tile used inside the mobile menu */
  const tile = (from, to) => ({
    width: 32,
    height: 32,
    mr: 1.5,
    borderRadius: "11px",
    display: "grid",
    placeItems: "center",
    color: "#fff",
    background: `linear-gradient(135deg, ${from}, ${to})`,
  });

  return (
    <>
      {/* Transparent bar: only the floating capsule is visible */}
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
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 80 },
            alignItems: "flex-start",
            px: { xs: 1.5, md: 3 },
          }}
        >
          {/* Floating glass capsule */}
          <Box
            sx={{
              pointerEvents: "auto",
              width: "100%",
              maxWidth: scrolled ? 960 : 1180,
              mx: "auto",
              mt: { xs: 1, md: 1.5 },
              height: { xs: 52, md: 58 },
              pl: { xs: 1.75, md: 2.5 },
              pr: { xs: 0.75, md: 1 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(18px) saturate(170%)",
              WebkitBackdropFilter: "blur(18px) saturate(170%)",
              border: `1px solid ${ui.line}`,
              boxShadow: scrolled
                ? "inset 0 1px 0 rgba(255,255,255,0.9), 0 22px 44px -20px rgba(11,16,32,0.38)"
                : "inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 26px -18px rgba(11,16,32,0.22)",
              transition:
                "max-width 0.55s cubic-bezier(.65,0,.35,1), box-shadow 0.4s ease",
            }}
          >
            {/* Brand: a coin that splits in two */}
            <Box
              component={Link}
              to="/"
              aria-label="Expense Splitter home"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                textDecoration: "none",
                borderRadius: "999px",
                "&:focus-visible": focusRing,
                "&:hover .coin": { transform: "rotate(-10deg)" },
                "&:hover .coin-a": { transform: "translate(-4px,-4px)" },
                "&:hover .coin-b": { transform: "translate(4px,4px)" },
                "&:hover .wordmark": {
                  WebkitTextFillColor: "transparent",
                  backgroundPosition: "100% 0",
                },
              }}
            >
              <Box
                className="coin"
                sx={{
                  position: "relative",
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  transition: "transform 0.5s cubic-bezier(.34,1.56,.64,1)",
                }}
              >
                <Box
                  className="coin-a"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #14B8A6, #3B82F6)",
                    clipPath: "polygon(0 0, 100% 0, 0 100%)",
                    transform: "translate(-1.5px,-1.5px)",
                    transition: "transform 0.5s cubic-bezier(.34,1.56,.64,1)",
                  }}
                />
                <Box
                  className="coin-b"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8B5CF6, #F43F5E)",
                    clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                    transform: "translate(1.5px,1.5px)",
                    transition: "transform 0.5s cubic-bezier(.34,1.56,.64,1)",
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                component="span"
                className="wordmark"
                sx={{
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: { xs: "1.1rem", sm: "1.3rem" },
                  letterSpacing: "-0.045em",
                  lineHeight: 1,
                  color: ui.ink,
                  WebkitTextFillColor: ui.ink,
                  backgroundImage:
                    "linear-gradient(90deg, #14B8A6, #3B82F6, #8B5CF6, #F43F5E)",
                  backgroundSize: "200% 100%",
                  backgroundPosition: "0% 0",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  transition:
                    "background-position 0.7s ease, -webkit-text-fill-color 0.3s ease",
                }}
              >
                Expense Splitter
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.75,
              }}
            >
              {user ? (
                <>
                  {/* Account chip */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      height: 42,
                      pl: 0.5,
                      pr: 2,
                      borderRadius: "999px",
                      backgroundColor: "rgba(15,23,42,0.04)",
                      border: `1px solid ${ui.line}`,
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: 34,
                        height: 34,
                        flexShrink: 0,
                      }}
                    >
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
                            animation: "ringSpin 6s linear infinite",
                          },
                          "@media (prefers-reduced-motion: reduce)": {
                            "&::before": { animation: "none" },
                          },
                        }}
                      />
                      <Avatar
                        sx={{
                          position: "absolute",
                          inset: "3px",
                          width: "auto",
                          height: "auto",
                          background: ui.aurora,
                          color: "#fff",
                          fontFamily: display,
                          fontWeight: 800,
                          fontSize: "0.9rem",
                          textTransform: "uppercase",
                          border: "2px solid #fff",
                        }}
                      >
                        {(user.first_name || user.username || "").charAt(0)}
                      </Avatar>
                    </Box>
                    <Typography
                      noWrap
                      sx={{
                        maxWidth: 170,
                        color: ui.ink,
                        fontFamily: display,
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Hi, {user.first_name || user.username}
                    </Typography>
                  </Box>
                  <Button
                    onClick={handleLogout}
                    startIcon={<LogoutRoundedIcon />}
                    sx={sweepButton(ui.heat)}
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
                    aria-current={onRegister ? "page" : undefined}
                    sx={{
                      ...sweepButton(ui.auroraX),
                      ...(onRegister && {
                        backgroundColor: "rgba(20,184,166,0.12)",
                      }),
                    }}
                  >
                    Register
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    disableElevation
                    aria-current={onLogin ? "page" : undefined}
                    sx={{
                      ...glowRim,
                      height: 42,
                      px: 2.75,
                      borderRadius: "999px",
                      fontFamily: display,
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 14px 28px -14px rgba(99,102,241,0.85)",
                      transition: "transform 0.25s ease",
                      "&:hover": {
                        backgroundColor: "transparent",
                        transform: "translateY(-1px) scale(1.03)",
                      },
                      "&:hover::after": { backgroundColor: "#151B33" },
                      "&:focus-visible": focusRing,
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
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                onClick={handleMenuOpen}
                aria-label="Open menu"
                aria-haspopup="true"
                sx={{
                  width: 40,
                  height: 40,
                  color: "#fff",
                  backgroundColor: ui.ink,
                  boxShadow: "0 10px 20px -10px rgba(11,16,32,0.6)",
                  transition:
                    "transform 0.35s cubic-bezier(.34,1.56,.64,1), background 0.25s ease",
                  "&:hover": { background: ui.aurora, transform: "rotate(90deg)" },
                  "&:focus-visible": focusRing,
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
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
            minWidth: 236,
            mt: 1.5,
            p: 0.75,
            color: ui.ink,
            borderRadius: "26px",
            backgroundColor: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(22px) saturate(170%)",
            WebkitBackdropFilter: "blur(22px) saturate(170%)",
            border: `1px solid ${ui.line}`,
            boxShadow: "0 30px 70px -24px rgba(11,16,32,0.42)",
            "& .MuiMenuItem-root": {
              borderRadius: "18px",
              my: 0.25,
              py: 1,
              fontFamily: display,
              fontWeight: 700,
            },
          },
        }}
      >
        {user ? (
          <>
            <MenuItem
              disabled
              sx={{ "&.Mui-disabled": { opacity: 1, color: ui.ink } }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: ui.aurora,
                  color: "#fff",
                  fontFamily: display,
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  mr: 1.5,
                  textTransform: "uppercase",
                }}
              >
                {(user.first_name || user.username || "").charAt(0)}
              </Avatar>
              {user.first_name || user.username}
            </MenuItem>
            <Divider sx={{ borderColor: ui.line, my: 0.5 }} />
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "#E11D48",
                "&:hover": { bgcolor: "rgba(244,63,94,0.1)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0 }}>
                <Box sx={tile("#F43F5E", "#F59E0B")}>
                  <LogoutRoundedIcon sx={{ fontSize: 18 }} />
                </Box>
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
              sx={{ "&:hover": { bgcolor: "rgba(20,184,166,0.1)" } }}
            >
              <ListItemIcon sx={{ minWidth: 0 }}>
                <Box sx={tile("#14B8A6", "#3B82F6")}>
                  <PersonAddAlt1RoundedIcon sx={{ fontSize: 18 }} />
                </Box>
              </ListItemIcon>
              Register
            </MenuItem>
            <MenuItem
              component={Link}
              to="/login"
              onClick={handleMenuClose}
              sx={{ "&:hover": { bgcolor: "rgba(139,92,246,0.1)" } }}
            >
              <ListItemIcon sx={{ minWidth: 0 }}>
                <Box sx={tile("#3B82F6", "#8B5CF6")}>
                  <LoginRoundedIcon sx={{ fontSize: 18 }} />
                </Box>
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