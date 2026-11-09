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
  line: "rgba(15,23,42,0.1)",
  teal: "#14B8A6",
  aurora: "linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%)",
};

const display = "'Bricolage Grotesque', 'Inter', system-ui, sans-serif";

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

const cardSx = {
  borderRadius: "28px",
  backgroundColor: "#fff",
  border: `1px solid ${ui.line}`,
  boxShadow: "0 24px 60px -34px rgba(59,130,246,0.45)",
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
        backgroundColor: "rgba(15,23,42,0.035)",
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
        <Typography
          variant="caption"
          sx={{ color: ui.muted, fontFamily: display, fontWeight: 700 }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            color: ui.ink,
            fontFamily: display,
            fontWeight: 700,
            wordBreak: "break-word",
            lineHeight: 1.3,
          }}
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
      <Box sx={{ ...pageSx, justifyContent: "center", pb: 12 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 5, textAlign: "center" }}>
          <CircularProgress size={56} thickness={4} sx={{ color: ui.teal, mb: 2 }} />
          <Typography sx={{ color: ui.ink, fontFamily: display, fontWeight: 700 }}>
            Loading...
          </Typography>
        </Paper>
      </Box>
    );

  return (
    <Box sx={pageSx}>
      {/* Bottom padding keeps the card clear of the fixed footer */}
      <Container maxWidth="xs" sx={{ py: 6, pb: 14 }}>
        <Paper
          elevation={0}
          sx={{ ...cardSx, overflow: "hidden", textAlign: "center" }}
        >
          {/* Colour band */}
          <Box aria-hidden sx={{ height: 8, background: ui.aurora }} />

          <Box sx={{ p: { xs: 3.5, sm: 5 } }}>
            {/* Avatar with a still gradient ring */}
            <Box
              sx={{
                width: 112,
                height: 112,
                mx: "auto",
                mb: 3,
                p: "4px",
                borderRadius: "50%",
                background: ui.aurora,
              }}
            >
              <Avatar
                sx={{
                  width: "100%",
                  height: "100%",
                  color: "#fff",
                  background: ui.aurora,
                  fontFamily: display,
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
                fontFamily: display,
                fontWeight: 800,
                color: ui.ink,
                letterSpacing: "-0.055em",
                lineHeight: 1.1,
                fontSize: { xs: "2rem", sm: "2.3rem" },
                wordBreak: "break-word",
              }}
            >
              Welcome, {user.first_name}!
            </Typography>

            {/* Tear line */}
            <Box
              aria-hidden
              sx={{
                my: 3.5,
                borderTop: "2px dashed rgba(15,23,42,0.14)",
              }}
            />

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
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;