/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Alert,
  Paper,
  InputAdornment,
} from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { login } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

/* ---------- Design tokens (UI only) ---------- */
const ui = {
  ink: "#0B1020",
  muted: "#64748B",
  line: "rgba(15,23,42,0.1)",
  teal: "#14B8A6",
  blue: "#3B82F6",
  coral: "#F43F5E",
  aurora: "linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%)",
};

const display = "'Bricolage Grotesque', 'Inter', system-ui, sans-serif";
const focusRing = { outline: `2px solid ${ui.blue}`, outlineOffset: 3 };

/* Page: plain pale background with a faint dot grid, nothing moving */
const pageSx = {
  position: "relative",
  minHeight: "100vh",
  backgroundColor: "#F8FAFC",
  backgroundImage: "radial-gradient(rgba(15,23,42,0.06) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
  display: "flex",
  alignItems: "center",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "rgba(15,23,42,0.045)",
    fontFamily: display,
    fontWeight: 700,
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "#5EEAD4" },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 0 0 4px rgba(20,184,166,0.16)",
    },
    "&.Mui-focused fieldset": { borderColor: ui.teal, borderWidth: 2 },
    "&.Mui-error fieldset": { borderColor: ui.coral },
    "&.Mui-error.Mui-focused": { boxShadow: "0 0 0 4px rgba(244,63,94,0.15)" },
  },
  "& .MuiOutlinedInput-input": { py: 1.9 },
  "& .MuiInputLabel-root": { fontFamily: display, fontWeight: 600 },
  "& .MuiInputLabel-root.Mui-focused": { color: ui.ink },
  "& .MuiInputLabel-root.Mui-error": { color: ui.coral },
  "& .MuiFormHelperText-root": { fontFamily: display, fontWeight: 600, ml: 1 },
};

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    let temp = {};
    if (!form.username.trim()) temp.username = "Username or Email is required";
    if (!form.password.trim()) temp.password = "Password is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await login(form);
      if (res.access) {
        localStorage.setItem("token", res.access);
        if (res.refresh) localStorage.setItem("refresh", res.refresh);
        navigate("/groups");
      } else {
        setServerError("Invalid username or password.");
      }
    } catch (err) {
      setServerError(err.response?.data?.error || err.message);
    }
  };

  return (
    <Box sx={pageSx}>
      {/* Bottom padding keeps the card clear of the fixed footer */}
      <Container maxWidth="xs" sx={{ py: 6, pb: 14 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: "28px",
            backgroundColor: "#fff",
            border: `1px solid ${ui.line}`,
            boxShadow: "0 24px 60px -34px rgba(59,130,246,0.45)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Brand mark: the split coin from the navbar */}
          <Box
            aria-hidden
            sx={{ position: "relative", width: 60, height: 60, mb: 2.5 }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #14B8A6, #3B82F6)",
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
                transform: "translate(-2px,-2px)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8B5CF6, #F43F5E)",
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                transform: "translate(2px,2px)",
              }}
            />
          </Box>

          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontFamily: display,
              fontWeight: 800,
              color: ui.ink,
              letterSpacing: "-0.055em",
              fontSize: "2.4rem",
              lineHeight: 1.05,
            }}
          >
            Login
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: ui.muted,
              mt: 1,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Sign in to continue to Expense Splitter
          </Typography>

          {/* Tear line */}
          <Box
            aria-hidden
            sx={{
              width: "100%",
              mt: 3,
              borderTop: "2px dashed rgba(15,23,42,0.14)",
            }}
          />

          {serverError && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                width: "100%",
                borderRadius: "16px",
                fontFamily: display,
                fontWeight: 600,
                alignItems: "center",
                backgroundColor: "#FFF1F2",
                color: "#9F1239",
                border: "1px solid rgba(244,63,94,0.3)",
                "& .MuiAlert-icon": { color: ui.coral },
              }}
            >
              {serverError}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1.5, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username or Email"
              name="username"
              value={form.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon sx={{ color: ui.teal }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldSx}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon sx={{ color: ui.teal }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldSx}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              startIcon={<LoginRoundedIcon />}
              sx={{
                mt: 3,
                mb: 1,
                py: 1.8,
                borderRadius: "999px",
                fontFamily: display,
                fontSize: "1.05rem",
                fontWeight: 800,
                textTransform: "none",
                letterSpacing: "-0.02em",
                color: "#fff",
                background: ui.aurora,
                "&:hover": { filter: "brightness(1.07)" },
                "&:focus-visible": focusRing,
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}