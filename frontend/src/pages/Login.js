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
  line: "rgba(15,23,42,0.08)",
  teal: "#14B8A6",
  coral: "#F43F5E",
  aurora: "linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%)",
};

const pageSx = {
  position: "relative",
  overflow: "hidden",
  minHeight: "100vh",
  backgroundColor: "#F8FAFC",
  display: "flex",
  alignItems: "center",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -160,
    left: -120,
    width: 520,
    height: 520,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(20,184,166,0.22), transparent 65%)",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -180,
    right: -140,
    width: 560,
    height: 560,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.20), transparent 65%)",
    pointerEvents: "none",
  },
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "rgba(241,245,249,0.75)",
    fontWeight: 600,
    transition: "all 0.2s ease",
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "#5EEAD4" },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 0 0 4px rgba(20,184,166,0.15)",
    },
    "&.Mui-focused fieldset": { borderColor: ui.teal, borderWidth: 2 },
    "&.Mui-error fieldset": { borderColor: ui.coral },
    "&.Mui-error.Mui-focused": { boxShadow: "0 0 0 4px rgba(244,63,94,0.15)" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#0D9488" },
  "& .MuiInputLabel-root.Mui-error": { color: ui.coral },
  "& .MuiFormHelperText-root": { fontWeight: 600, ml: 1 },
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
      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1, py: 6, pb: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: "32px",
            backgroundColor: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(14px)",
            border: `1px solid ${ui.line}`,
            boxShadow:
              "0 40px 80px -32px rgba(59,130,246,0.45), 0 2px 8px rgba(15,23,42,0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 68,
              height: 68,
              mb: 2.5,
              borderRadius: "22px",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              background: ui.aurora,
              boxShadow:
                "0 20px 36px -14px rgba(99,102,241,0.85), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            <LockRoundedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontWeight: 800, color: ui.ink, letterSpacing: "-1.2px" }}
          >
            Login
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: ui.muted, mt: 0.75, fontWeight: 500, textAlign: "center" }}
          >
            Sign in to continue to Expense Splitter
          </Typography>

          {serverError && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                width: "100%",
                borderRadius: "16px",
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
            sx={{ mt: 2, width: "100%" }}
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
                fontSize: "1.05rem",
                fontWeight: 800,
                textTransform: "none",
                color: "#fff",
                background: ui.aurora,
                backgroundSize: "200% 200%",
                boxShadow: "0 22px 40px -16px rgba(99,102,241,0.85)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundPosition: "100% 50%",
                  transform: "translateY(-2px)",
                  boxShadow: "0 28px 46px -16px rgba(99,102,241,0.95)",
                },
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