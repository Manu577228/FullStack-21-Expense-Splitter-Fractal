/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import { register as registerUser } from "../services/AuthService";
import { useNavigate, Link as RouterLink } from "react-router-dom";

/* ---------- Design tokens (UI only) ---------- */
const ui = {
  ink: "#0B1020",
  muted: "#64748B",
  line: "rgba(15,23,42,0.08)",
  teal: "#14B8A6",
  tealDark: "#0D9488",
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
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
    "& fieldset": { borderColor: "transparent", transition: "border-color 0.2s ease" },
    "&:hover fieldset": { borderColor: "#5EEAD4" },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 0 0 4px rgba(20,184,166,0.15)",
    },
    "&.Mui-focused fieldset": { borderColor: ui.teal, borderWidth: 2 },
    "&.Mui-error fieldset": { borderColor: ui.coral },
    "&.Mui-error.Mui-focused": { boxShadow: "0 0 0 4px rgba(244,63,94,0.15)" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: ui.tealDark },
  "& .MuiInputLabel-root.Mui-error": { color: ui.coral },
  "& .MuiFormHelperText-root": { fontWeight: 600, marginLeft: "6px" },
};

const adorn = (icon) => ({
  startAdornment: (
    <InputAdornment position="start">
      {React.cloneElement(icon, { sx: { color: ui.teal } })}
    </InputAdornment>
  ),
});

/* Password rules — display only, mirrors the regex used in validate() */
const passwordRules = [
  { label: "8–16 characters", test: (p) => p.length >= 8 && p.length <= 16 },
  { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Number", test: (p) => /\d/.test(p) },
  { label: "Special (@$!%*?&)", test: (p) => /[@$!%*?&]/.test(p) },
];

function PasswordRules({ password }) {
  const passed = passwordRules.filter((r) => r.test(password)).length;
  const pct = (passed / passwordRules.length) * 100;

  return (
    <Box sx={{ mt: 1, mb: 0.5 }} aria-live="polite">
      {/* strength bar */}
      <Box
        sx={{
          height: 6,
          borderRadius: 999,
          backgroundColor: "rgba(148,163,184,0.25)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 999,
            background: pct === 100 ? ui.aurora : "linear-gradient(90deg,#F43F5E,#F59E0B)",
            transition: "width 0.3s ease",
          }}
        />
      </Box>

      {/* rule chips */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1.25 }}>
        {passwordRules.map((rule) => {
          const ok = rule.test(password);
          return (
            <Box
              key={rule.label}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                px: 1.1,
                py: 0.4,
                borderRadius: 999,
                fontSize: "0.72rem",
                fontWeight: 700,
                color: ok ? "#0F766E" : ui.muted,
                backgroundColor: ok ? "rgba(20,184,166,0.12)" : "rgba(148,163,184,0.14)",
                transition: "all 0.2s ease",
              }}
            >
              {ok ? (
                <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />
              ) : (
                <RadioButtonUncheckedRoundedIcon sx={{ fontSize: 14 }} />
              )}
              {rule.label}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!/^[A-Za-z][A-Za-z0-9]{2,15}$/.test(formData.username))
      tempErrors.username =
        "Username must start with a letter & contain only letters/numbers (3-16 chars)";

    if (!/^[A-Za-z ]+$/.test(formData.first_name))
      tempErrors.first_name = "Full name must contain only letters and spaces";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      tempErrors.email = "Enter a valid email address";

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(
        formData.password
      )
    )
      tempErrors.password =
        "Password must be 8–16 chars with upper, lower, number & special char";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // UI nicety: clear a field's error as soon as the user edits it
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await registerUser(formData);
      if (res.access && res.refresh) {
        // Don't store tokens here — go to login page instead
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert("Registration succeeded. Please login.");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const showRules = passwordFocused || formData.password.length > 0;

  return (
    <Box component="main" sx={pageSx}>
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
            <PersonAddAlt1RoundedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontWeight: 800, color: ui.ink, letterSpacing: "-1.2px" }}
          >
            Create account
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: ui.muted, mt: 0.75, fontWeight: 500, textAlign: "center" }}
          >
            Start splitting expenses with friends in under a minute
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 2, width: "100%" }}
          >
            <TextField
              margin="normal"
              fullWidth
              autoFocus
              autoComplete="username"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              InputProps={adorn(<PersonRoundedIcon />)}
              sx={fieldSx}
            />
            <TextField
              margin="normal"
              fullWidth
              autoComplete="name"
              label="Full Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
              InputProps={adorn(<BadgeRoundedIcon />)}
              sx={fieldSx}
            />
            <TextField
              margin="normal"
              fullWidth
              type="email"
              autoComplete="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={adorn(<EmailRoundedIcon />)}
              sx={fieldSx}
            />
            <TextField
              margin="normal"
              fullWidth
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                ...adorn(<LockRoundedIcon />),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((s) => !s)}
                      onMouseDown={(e) => e.preventDefault()}
                      sx={{ color: ui.muted, "&:hover": { color: ui.tealDark } }}
                    >
                      {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={fieldSx}
            />

            {showRules && <PasswordRules password={formData.password} />}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={18} thickness={5} sx={{ color: "#fff" }} />
                ) : (
                  <PersonAddAlt1RoundedIcon />
                )
              }
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
                "&:focus-visible": {
                  outline: "3px solid rgba(59,130,246,0.45)",
                  outlineOffset: 3,
                },
                "&.Mui-disabled": {
                  color: "#fff",
                  opacity: 0.75,
                  background: ui.aurora,
                },
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                  "&:hover": { transform: "none" },
                },
              }}
            >
              {submitting ? "Creating account…" : "Create account"}
            </Button>

            <Typography
              variant="body2"
              sx={{ mt: 2, textAlign: "center", color: ui.muted, fontWeight: 500 }}
            >
              Already have an account?{" "}
              <MuiLink
                component={RouterLink}
                to="/login"
                underline="hover"
                sx={{ color: ui.tealDark, fontWeight: 800 }}
              >
                Sign in
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}