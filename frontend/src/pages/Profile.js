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
import { Avatar, Box, CircularProgress, Container, Paper, Typography } from "@mui/material";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import { getProfile } from "../services/AuthService";

/* ---------- Design tokens (UI only) ---------- */
const ui = {
  ink: "#0B1020",
  muted: "#64748B",
  line: "rgba(15,23,42,0.08)",
  teal: "#14B8A6",
  aurora: "linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%)",
  conic:
    "conic-gradient(from 0deg, #14B8A6, #3B82F6, #8B5CF6, #F43F5E, #F59E0B, #14B8A6)",
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

const cardSx = {
  borderRadius: "32px",
  backgroundColor: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(14px)",
  border: `1px solid ${ui.line}`,
  boxShadow:
    "0 40px 80px -32px rgba(59,130,246,0.45), 0 2px 8px rgba(15,23,42,0.04)",
};

function InfoRow({ icon, label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderRadius: "18px",
        backgroundColor: "rgba(241,245,249,0.8)",
        textAlign: "left",
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          flexShrink: 0,
          borderRadius: "14px",
          display: "grid",
          placeItems: "center",
          color: "#0F766E",
          backgroundColor: "rgba(20,184,166,0.14)",
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: ui.muted, fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography
          sx={{ color: ui.ink, fontWeight: 700, wordBreak: "break-word", lineHeight: 1.3 }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile().then((data) => setUser(data));
  }, []);

  if (!user)
    return (
      <Box sx={{ ...pageSx, justifyContent: "center" }}>
        <Paper
          elevation={0}
          sx={{ ...cardSx, position: "relative", zIndex: 1, p: 5, textAlign: "center" }}
        >
          <CircularProgress size={56} thickness={4} sx={{ color: ui.teal, mb: 2 }} />
          <Typography sx={{ color: ui.ink, fontWeight: 700 }}>Loading...</Typography>
        </Paper>
      </Box>
    );

  return (
    <Box sx={pageSx}>
      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1, py: 6, pb: 12 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3.5, sm: 5 }, textAlign: "center" }}>
          {/* Avatar with a spinning rainbow ring */}
          <Box sx={{ position: "relative", width: 112, height: 112, mx: "auto", mb: 3 }}>
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
                  animation: "ringSpin 5s linear infinite",
                  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                },
              }}
            />
            <Avatar
              sx={{
                position: "absolute",
                inset: 5,
                width: "auto",
                height: "auto",
                background: ui.aurora,
                color: "#fff",
                fontWeight: 800,
                fontSize: "2.6rem",
                textTransform: "uppercase",
                border: "4px solid #fff",
              }}
            >
              {(user.first_name || user.username || "").charAt(0)}
            </Avatar>
          </Box>

          <Typography
            component="h2"
            variant="h4"
            sx={{
              fontWeight: 800,
              color: ui.ink,
              letterSpacing: "-1.2px",
              mb: 3.5,
              wordBreak: "break-word",
            }}
          >
            Welcome, {user.first_name}!
          </Typography>

          <Box sx={{ display: "grid", gap: 1.5 }}>
            <InfoRow
              icon={<AlternateEmailRoundedIcon />}
              label="Username"
              value={user.username}
            />
            <InfoRow
              icon={<EmailRoundedIcon />}
              label="Email"
              value={user.email}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;