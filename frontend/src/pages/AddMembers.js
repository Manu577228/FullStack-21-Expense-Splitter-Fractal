/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Box,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
  Chip,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Stack,
  Fade,
  Slide,
  Grid,
  Badge,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  PersonAdd,
  Group,
  ArrowForward,
  ArrowBack,
  Person,
  Send,
  Search,
  CheckCircle,
  Error as ErrorIcon,
  People,
  Analytics,
  Star,
  SupervisorAccount,
} from "@mui/icons-material";
import { apiFetch } from "../api";

/* ---------- Design tokens (UI only) ---------- */
const ui = {
  ink: "#0B1020",
  muted: "#64748B",
  line: "rgba(15,23,42,0.09)",
  teal: "#14B8A6",
  blue: "#3B82F6",
  aurora: "linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%)",
};

const display = "'Bricolage Grotesque', 'Inter', system-ui, sans-serif";
const focusRing = { outline: `2px solid ${ui.blue}`, outlineOffset: 3 };

const accents = [
  ["#14B8A6", "#3B82F6"],
  ["#8B5CF6", "#EC4899"],
  ["#F59E0B", "#F43F5E"],
  ["#10B981", "#06B6D4"],
  ["#6366F1", "#8B5CF6"],
];

/* Page: pale paper with a faint dot grid and two soft aurora glows */
const pageSx = {
  position: "relative",
  overflow: "hidden",
  minHeight: "100vh",
  backgroundColor: "#F8FAFC",
  backgroundImage: "radial-gradient(rgba(15,23,42,0.07) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
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
  borderRadius: "28px",
  backgroundColor: "rgba(255,255,255,0.92)",
  border: `1px solid ${ui.line}`,
  boxShadow:
    "0 30px 70px -30px rgba(59,130,246,0.35), 0 2px 8px rgba(15,23,42,0.04)",
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
  },
  "& .MuiInputLabel-root": { fontFamily: display, fontWeight: 600 },
  "& .MuiInputLabel-root.Mui-focused": { color: ui.ink },
};

const iconTile = (size = 48) => ({
  width: size,
  height: size,
  borderRadius: "16px",
  display: "grid",
  placeItems: "center",
  color: "#fff",
  background: ui.aurora,
  boxShadow:
    "0 12px 24px -10px rgba(99,102,241,0.7), inset 0 1px 0 rgba(255,255,255,0.35)",
});

const alertBase = {
  mb: 3,
  borderRadius: "16px",
  fontFamily: display,
  fontWeight: 600,
  alignItems: "center",
};

const ghostBtn = {
  py: 1.6,
  px: 3.5,
  borderRadius: "999px",
  fontFamily: display,
  fontWeight: 700,
  textTransform: "none",
  color: ui.ink,
  border: "1.5px solid rgba(15,23,42,0.15)",
  backgroundColor: "rgba(255,255,255,0.7)",
  transition: "all 0.25s ease",
  "&:hover": {
    background: ui.ink,
    color: "#fff",
    borderColor: ui.ink,
    transform: "translateY(-2px)",
    boxShadow: "0 16px 28px -14px rgba(11,16,32,0.7)",
  },
  "&:focus-visible": focusRing,
};

/* Ticket geometry: member rows have a stub; the stats strip has two tear lines */
const STUB = 76;
const rowMask = `radial-gradient(circle 9px at ${STUB}px 0, #0000 97%, #000), radial-gradient(circle 9px at ${STUB}px 100%, #0000 97%, #000)`;
const notch = (x, y) => `radial-gradient(circle 9px at ${x} ${y}, #0000 97%, #000)`;
const stripMask = [
  notch("33.333%", "0"),
  notch("33.333%", "100%"),
  notch("66.666%", "0"),
  notch("66.666%", "100%"),
].join(", ");

export default function AddMembers() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    loadGroupData();
    // eslint-disable-next-line
  }, [id]);

  const loadGroupData = async () => {
    try {
      const groupRes = await apiFetch(`/api/groups/${id}/`);
      if (!groupRes?.ok) throw new Error("Failed to load group");
      setGroup(await groupRes.json());

      const membersRes = await apiFetch(`/api/groups/${id}/members/`);
      if (!membersRes?.ok) throw new Error("Failed to load members");
      const membersData = await membersRes.json();
      setMembers(membersData.members);
    } catch (err) {
      setError("Error loading group data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }
    setAddingMember(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiFetch(`/api/groups/${id}/add-member/`, {
        method: "POST",
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (res?.ok) {
        setSuccess(data.message || "Member added successfully!");
        setUsername("");
        await loadGroupData();
      } else setError(data.error || "Failed to add member");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setAddingMember(false);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          ...pageSx,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              ...cardSx,
              position: "relative",
              zIndex: 1,
              p: { xs: 4, sm: 6 },
              textAlign: "center",
              maxWidth: 400,
              width: "100%",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <CircularProgress size={72} thickness={4} sx={{ color: ui.teal }} />
            </Box>
            <Typography
              variant="h5"
              color={ui.ink}
              gutterBottom
              sx={{ fontFamily: display, fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              Loading Group Data
            </Typography>
            <Typography variant="body1" sx={{ color: ui.muted }}>
              Please wait while we fetch the group information...
            </Typography>
          </Paper>
        </Fade>
      </Box>
    );

  if (!group)
    return (
      <Box
        sx={{
          ...pageSx,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              ...cardSx,
              position: "relative",
              zIndex: 1,
              p: { xs: 4, sm: 6 },
              textAlign: "center",
              maxWidth: 500,
              width: "100%",
            }}
          >
            <Avatar
              sx={{
                width: 96,
                height: 96,
                mx: "auto",
                mb: 3,
                color: "#fff",
                background: "linear-gradient(135deg, #F43F5E, #F59E0B)",
                boxShadow: "0 20px 40px -16px rgba(244,63,94,0.7)",
              }}
            >
              <ErrorIcon sx={{ fontSize: 48 }} />
            </Avatar>
            <Typography
              variant="h4"
              color={ui.ink}
              gutterBottom
              sx={{ fontFamily: display, fontWeight: 800, letterSpacing: "-0.05em" }}
            >
              Group Not Found
            </Typography>
            <Typography variant="body1" sx={{ color: ui.muted, mb: 4 }}>
              The group you're looking for doesn't exist or you don't have
              access to it.
            </Typography>
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate("/groups")}
              sx={{
                py: 1.6,
                px: 4,
                borderRadius: "999px",
                fontFamily: display,
                fontWeight: 700,
                textTransform: "none",
                background: ui.ink,
                color: "#fff",
                boxShadow: "0 16px 30px -14px rgba(11,16,32,0.7)",
                "&:hover": { background: ui.aurora, transform: "translateY(-2px)" },
                "&:focus-visible": focusRing,
              }}
            >
              Back to Groups
            </Button>
          </Paper>
        </Fade>
      </Box>
    );

  /* Stat cells share one look; only the first is dark */
  const statNumber = {
    fontFamily: display,
    fontWeight: 800,
    fontSize: { xs: "2.4rem", sm: "2.8rem" },
    letterSpacing: "-0.05em",
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
  };
  const statLabel = { fontFamily: display, fontWeight: 600, mt: 1, fontSize: "0.95rem" };

  return (
    <Box sx={{ ...pageSx, py: { xs: 3, sm: 4 } }}>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, pb: 12 }}>
        {/* Header */}
        <Fade in timeout={700}>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <IconButton
                aria-label="Back to groups"
                onClick={() => navigate("/groups")}
                sx={{
                  width: 46,
                  height: 46,
                  mr: 1,
                  background: ui.ink,
                  color: "#fff",
                  boxShadow: "0 14px 26px -10px rgba(11,16,32,0.6)",
                  transition: "all 0.3s ease",
                  "&:hover": { background: ui.aurora, transform: "translateX(-3px)" },
                  "&:focus-visible": focusRing,
                }}
              >
                <ArrowBack />
              </IconButton>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: display,
                    fontWeight: 800,
                    color: ui.ink,
                    letterSpacing: "-0.055em",
                    lineHeight: 1.05,
                    fontSize: { xs: "2.1rem", sm: "2.8rem", md: "3.4rem" },
                  }}
                >
                  Manage Members
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: ui.muted,
                    fontFamily: display,
                    fontWeight: 600,
                    mt: 0.75,
                    fontSize: "1.05rem",
                  }}
                >
                  {group.name} • Add and manage group participants
                </Typography>
              </Box>
            </Box>

            {/* Stats: one ticket strip with two tear lines */}
            <Box
              sx={{
                mb: 4,
                filter:
                  "drop-shadow(0 20px 26px rgba(59,130,246,0.2)) drop-shadow(0 1px 2px rgba(15,23,42,0.06))",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                  overflow: "hidden",
                  borderRadius: "26px",
                  border: `1px solid ${ui.line}`,
                  backgroundColor: "#fff",
                  WebkitMask: { xs: "none", sm: stripMask },
                  WebkitMaskComposite: "source-in",
                  mask: { xs: "none", sm: stripMask },
                  maskComposite: "intersect",
                  "& > * + *": {
                    borderTop: { xs: "2px dashed rgba(15,23,42,0.14)", sm: "0" },
                    borderLeft: { xs: "0", sm: "2px dashed rgba(15,23,42,0.14)" },
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    p: 3,
                    color: "#fff",
                    background: ui.ink,
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      right: -50,
                      top: -50,
                      width: 170,
                      height: 170,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(59,130,246,0.55), transparent 65%)",
                      pointerEvents: "none",
                    },
                  }}
                >
                  <People sx={{ color: "#5EEAD4", mb: 1.5 }} />
                  <Typography sx={statNumber}>{members.length}</Typography>
                  <Typography sx={{ ...statLabel, opacity: 0.75 }}>
                    Total Members
                  </Typography>
                </Box>
                <Box sx={{ p: 3, color: ui.ink }}>
                  <SupervisorAccount sx={{ color: "#F59E0B", mb: 1.5 }} />
                  <Typography sx={statNumber}>
                    {members.filter((m) => m.is_admin).length}
                  </Typography>
                  <Typography sx={{ ...statLabel, color: ui.muted }}>Admins</Typography>
                </Box>
                <Box
                  sx={{
                    p: 3,
                    color: "#065F46",
                    background: "linear-gradient(135deg, #ECFDF5 0%, #CCFBF1 100%)",
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      mb: 2,
                      mt: 0.75,
                      borderRadius: "50%",
                      backgroundColor: "#10B981",
                      animation: "statusPulse 2s ease-out infinite",
                      "@keyframes statusPulse": {
                        "0%": { boxShadow: "0 0 0 0 rgba(16,185,129,0.6)" },
                        "100%": { boxShadow: "0 0 0 12px rgba(16,185,129,0)" },
                      },
                      "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                    }}
                  />
                  <Typography sx={statNumber}>Active</Typography>
                  <Typography sx={{ ...statLabel, opacity: 0.8 }}>Group Status</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>

        {error && (
          <Slide direction="down" in timeout={500}>
            <Alert
              variant="outlined"
              severity="error"
              sx={{
                ...alertBase,
                color: "#9F1239",
                backgroundColor: "#FFF1F2",
                borderColor: "rgba(244,63,94,0.3)",
                "& .MuiAlert-icon": { color: "#F43F5E" },
              }}
              icon={<ErrorIcon />}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          </Slide>
        )}

        {success && (
          <Slide direction="down" in timeout={500}>
            <Alert
              variant="outlined"
              severity="success"
              sx={{
                ...alertBase,
                color: "#065F46",
                backgroundColor: "#ECFDF5",
                borderColor: "rgba(16,185,129,0.35)",
                "& .MuiAlert-icon": { color: "#10B981" },
              }}
              icon={<CheckCircle />}
              onClose={() => setSuccess("")}
            >
              {success}
            </Alert>
          </Slide>
        )}

        <Grid container spacing={4}>
          {/* Add member */}
          <Grid item xs={12} lg={5}>
            <Card elevation={0} sx={{ ...cardSx, height: "fit-content" }}>
              <CardHeader
                sx={{ p: 3, pb: 1 }}
                avatar={
                  <Box sx={iconTile(52)}>
                    <PersonAdd sx={{ fontSize: 26 }} />
                  </Box>
                }
                title={
                  <Typography
                    variant="h5"
                    color={ui.ink}
                    sx={{ fontFamily: display, fontWeight: 800, letterSpacing: "-0.03em" }}
                  >
                    Add New Member
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" sx={{ color: ui.muted }}>
                    Invite someone to join this expense group
                  </Typography>
                }
              />

              <CardContent sx={{ px: 3 }}>
                <TextField
                  fullWidth
                  label="Username or Email"
                  placeholder="Enter username or email address..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={addingMember}
                  variant="outlined"
                  sx={{
                    ...fieldSx,
                    "& .MuiOutlinedInput-input": { py: 1.9, fontSize: "1.05rem" },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: ui.teal }} />
                      </InputAdornment>
                    ),
                  }}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !addingMember && handleAddMember()
                  }
                />
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disableElevation
                  onClick={handleAddMember}
                  disabled={!username.trim() || addingMember}
                  startIcon={
                    addingMember ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      <Send />
                    )
                  }
                  sx={{
                    py: 1.8,
                    borderRadius: "999px",
                    fontFamily: display,
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    textTransform: "none",
                    letterSpacing: "-0.02em",
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
                    "&:focus-visible": focusRing,
                    "&.Mui-disabled": {
                      background: "#E2E8F0",
                      color: "#94A3B8",
                      boxShadow: "none",
                    },
                  }}
                >
                  {addingMember ? "Adding Member..." : "Add Member"}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Members list */}
          <Grid item xs={12} lg={7}>
            <Card elevation={0} sx={cardSx}>
              <CardHeader
                sx={{ p: 3, pb: 2 }}
                avatar={
                  <Badge
                    badgeContent={members.length}
                    max={999}
                    sx={{
                      "& .MuiBadge-badge": {
                        background: ui.ink,
                        color: "#fff",
                        border: "2px solid #fff",
                        fontFamily: display,
                        fontWeight: 800,
                      },
                    }}
                  >
                    <Box sx={iconTile(52)}>
                      <Group sx={{ fontSize: 26 }} />
                    </Box>
                  </Badge>
                }
                title={
                  <Typography
                    variant="h5"
                    color={ui.ink}
                    sx={{ fontFamily: display, fontWeight: 800, letterSpacing: "-0.03em" }}
                  >
                    Group Members ({members.length})
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" sx={{ color: ui.muted }}>
                    Everyone who can view and add expenses to this group
                  </Typography>
                }
              />

              <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
                {members.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: "auto",
                        mb: 2,
                        color: ui.teal,
                        backgroundColor: "rgba(20,184,166,0.12)",
                      }}
                    >
                      <People sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: ui.ink, fontFamily: display, fontWeight: 700 }}
                    >
                      No members yet
                    </Typography>
                    <Typography variant="body2" sx={{ color: ui.muted }}>
                      Add the first member to get started
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ py: 0 }}>
                    {members.map((member, index) => {
                      const [from, to] = accents[index % accents.length];
                      return (
                        <ListItem
                          key={member.id}
                          disablePadding
                          sx={{
                            display: "block",
                            mb: 1.5,
                            filter: "drop-shadow(0 1px 1px rgba(15,23,42,0.07))",
                            transition: "transform 0.25s ease, filter 0.25s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              filter: `drop-shadow(0 14px 14px ${to}45)`,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              display: "flex",
                              alignItems: "stretch",
                              borderRadius: "18px",
                              border: `1px solid ${ui.line}`,
                              backgroundColor: "#fff",
                              WebkitMask: rowMask,
                              WebkitMaskComposite: "source-in",
                              mask: rowMask,
                              maskComposite: "intersect",
                            }}
                          >
                            {/* Stub */}
                            <Box
                              sx={{
                                width: STUB,
                                flexShrink: 0,
                                display: "grid",
                                placeItems: "center",
                                py: 1.75,
                                background: `linear-gradient(135deg, ${from}1F, ${to}1F)`,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 46,
                                  height: 46,
                                  fontFamily: display,
                                  fontWeight: 800,
                                  color: "#fff",
                                  background: `linear-gradient(135deg, ${from}, ${to})`,
                                  boxShadow: `0 0 0 2px #fff, 0 0 0 3.5px ${from}`,
                                }}
                              >
                                {member.username.charAt(0).toUpperCase()}
                              </Avatar>
                            </Box>

                            {/* Tear line */}
                            <Box
                              aria-hidden
                              sx={{
                                position: "absolute",
                                top: 14,
                                bottom: 14,
                                left: STUB - 2,
                                borderLeft: "2px dashed rgba(15,23,42,0.16)",
                              }}
                            />

                            {/* Body */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                flexGrow: 1,
                                minWidth: 0,
                                gap: 1.5,
                                py: 1.5,
                                pl: 2.5,
                                pr: 1.75,
                              }}
                            >
                              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    color={ui.ink}
                                    sx={{
                                      fontFamily: display,
                                      fontWeight: 700,
                                      fontSize: "1.1rem",
                                      letterSpacing: "-0.02em",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {member.username}
                                  </Typography>
                                  {member.is_admin && (
                                    <Tooltip title="Group Administrator">
                                      <Chip
                                        icon={<Star sx={{ color: "#F59E0B !important" }} />}
                                        label="Admin"
                                        size="small"
                                        sx={{
                                          backgroundColor: "#FEF3C7",
                                          color: "#92400E",
                                          fontFamily: display,
                                          fontWeight: 800,
                                          height: 24,
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: ui.muted, fontWeight: 500 }}
                                >
                                  {member.is_admin
                                    ? "Group Administrator • Can manage members"
                                    : "Member • Can add and view expenses"}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  width: 38,
                                  height: 38,
                                  flexShrink: 0,
                                  borderRadius: "12px",
                                  display: "grid",
                                  placeItems: "center",
                                  color: member.is_admin ? "#B45309" : "#0F766E",
                                  backgroundColor: member.is_admin
                                    ? "#FEF3C7"
                                    : "rgba(20,184,166,0.12)",
                                }}
                              >
                                {member.is_admin ? <SupervisorAccount /> : <Person />}
                              </Box>
                            </Box>
                          </Box>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick actions */}
        <Paper elevation={0} sx={{ ...cardSx, mt: 4, p: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              mb: 3,
              color: ui.ink,
              fontFamily: display,
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Quick Actions
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2.5}
            justifyContent="center"
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(`/groups/${id}`)}
              sx={ghostBtn}
            >
              Back to Group
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<Analytics />}
              onClick={() => navigate(`/summary/${id}`)}
              sx={ghostBtn}
            >
              View Summary
            </Button>

            <Button
              variant="contained"
              size="large"
              disableElevation
              endIcon={<ArrowForward />}
              disabled={members.length < 2}
              onClick={() => navigate(`/groups/${id}/add-expense`)}
              sx={{
                py: 1.6,
                px: 4,
                borderRadius: "999px",
                fontFamily: display,
                fontWeight: 800,
                textTransform: "none",
                color: "#fff",
                background: members.length >= 2 ? ui.aurora : "#E2E8F0",
                boxShadow:
                  members.length >= 2
                    ? "0 22px 40px -16px rgba(99,102,241,0.85)"
                    : "none",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: members.length >= 2 ? "translateY(-2px)" : "none",
                  filter: members.length >= 2 ? "brightness(1.07)" : "none",
                },
                "&:focus-visible": focusRing,
                "&.Mui-disabled": { background: "#E2E8F0", color: "#94A3B8" },
              }}
            >
              {members.length < 2 ? "Need 2+ Members" : "Add Expense"}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}