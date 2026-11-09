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
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Stack,
  Fade,
  Slide,
  Tooltip,
} from "@mui/material";
import {
  Group,
  Login,
  Add,
  People,
  Analytics,
  DeleteOutline,
  TrendingUp,
  Share,
  MoreVert,
} from "@mui/icons-material";
import { apiFetch } from "../api";

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

const accents = [
  ["#14B8A6", "#3B82F6"],
  ["#8B5CF6", "#EC4899"],
  ["#F59E0B", "#F43F5E"],
  ["#10B981", "#06B6D4"],
  ["#6366F1", "#8B5CF6"],
];

/* Page: plain pale background, nothing moving */
const pageSx = {
  position: "relative",
  minHeight: "100vh",
  backgroundColor: "#F8FAFC",
  backgroundImage: "radial-gradient(rgba(15,23,42,0.06) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const cardSx = {
  borderRadius: "24px",
  backgroundColor: "#fff",
  border: `1px solid ${ui.line}`,
  boxShadow: "0 12px 32px -20px rgba(15,23,42,0.25)",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "rgba(15,23,42,0.045)",
    fontFamily: display,
    fontWeight: 700,
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

const iconTile = (size = 56, radius = "18px") => ({
  width: size,
  height: size,
  flexShrink: 0,
  borderRadius: radius,
  display: "grid",
  placeItems: "center",
  color: "#fff",
  background: ui.aurora,
});

const gradientBtn = {
  borderRadius: "999px",
  fontFamily: display,
  fontWeight: 800,
  textTransform: "none",
  letterSpacing: "-0.02em",
  color: "#fff",
  background: ui.aurora,
  "&:hover": { filter: "brightness(1.07)" },
  "&:focus-visible": focusRing,
  "&.Mui-disabled": { background: "#E2E8F0", color: "#94A3B8" },
};

const alertBase = {
  mb: 3,
  borderRadius: "16px",
  fontFamily: display,
  fontWeight: 600,
  alignItems: "center",
};

const statLabel = {
  mt: 0.5,
  color: ui.muted,
  fontFamily: display,
  fontWeight: 700,
  fontSize: "0.85rem",
};

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) loadGroups();
    else setLoading(false);
  }, []);

  const loadGroups = async () => {
    try {
      const response = await apiFetch("/api/groups/");
      if (response?.ok) setGroups(await response.json());
      else setError("Failed to load groups");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      setError("Please enter a group name");
      return;
    }
    try {
      const response = await apiFetch("/api/groups/", {
        method: "POST",
        body: JSON.stringify({ name: newGroupName.trim() }),
      });
      if (response?.ok) {
        const newGroup = await response.json();
        setGroups((prev) => [newGroup, ...prev]);
        setSuccess(`Group "${newGroupName}" created successfully!`);
        setOpenDialog(false);
        setNewGroupName("");
        setTimeout(() => setSuccess(""), 4000);
      } else setError("Failed to create group");
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this group? This action cannot be undone."
      )
    )
      return;
    try {
      const response = await apiFetch(`/api/groups/${groupId}/delete/`, {
        method: "DELETE",
      });
      if (response?.ok) {
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
        setSuccess("Group deleted successfully!");
        setTimeout(() => setSuccess(""), 4000);
      } else setError("Failed to delete group");
    } catch {
      setError("Network error. Please try again.");
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
          pb: 12,
        }}
      >
        <Fade in timeout={400}>
          <Paper
            elevation={0}
            sx={{
              ...cardSx,
              p: { xs: 4, sm: 6 },
              textAlign: "center",
              maxWidth: 400,
              width: "100%",
            }}
          >
            <CircularProgress
              size={64}
              thickness={4}
              sx={{ color: ui.teal, mb: 3 }}
            />
            <Typography
              variant="h5"
              color={ui.ink}
              gutterBottom
              sx={{ fontFamily: display, fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              Loading Groups
            </Typography>
            <Typography variant="body1" color={ui.muted}>
              Please wait while we fetch your expense groups...
            </Typography>
          </Paper>
        </Fade>
      </Box>
    );

  if (!isAuthenticated)
    return (
      <Box
        sx={{
          ...pageSx,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3 },
          pb: 12,
        }}
      >
        <Fade in timeout={400}>
          <Paper
            elevation={0}
            sx={{
              ...cardSx,
              p: { xs: 4, sm: 6 },
              textAlign: "center",
              maxWidth: 500,
              width: "100%",
            }}
          >
            <Box sx={{ ...iconTile(84, "26px"), mx: "auto", mb: 3 }}>
              <Login sx={{ fontSize: 42 }} />
            </Box>
            <Typography
              variant="h3"
              color={ui.ink}
              gutterBottom
              sx={{
                fontFamily: display,
                fontWeight: 800,
                letterSpacing: "-0.055em",
                fontSize: { xs: "2.2rem", sm: "2.8rem" },
              }}
            >
              Welcome Back!
            </Typography>
            <Typography
              variant="h6"
              color={ui.muted}
              sx={{ mb: 4, lineHeight: 1.6, fontWeight: 500, fontSize: "1.05rem" }}
            >
              Please login to access your expense groups and start tracking
              shared expenses with your friends.
            </Typography>
            <Button
              variant="contained"
              size="large"
              disableElevation
              startIcon={<Login />}
              onClick={() => navigate("/login")}
              sx={{ ...gradientBtn, py: 1.8, px: 5, fontSize: "1.05rem" }}
            >
              Login to Continue
            </Button>
          </Paper>
        </Fade>
      </Box>
    );

  return (
    <Box sx={{ ...pageSx, py: { xs: 3, sm: 4 } }}>
      {/* Bottom padding keeps the last row clear of the fixed footer */}
      <Container maxWidth="xl" sx={{ pb: 14 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 3,
            mb: 5,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 260 }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: display,
                fontWeight: 800,
                color: ui.ink,
                mb: 1,
                fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4.2rem" },
                letterSpacing: "-0.06em",
                lineHeight: 1,
              }}
            >
              My Groups
            </Typography>
            <Typography
              variant="h6"
              color={ui.muted}
              sx={{ fontWeight: 500, lineHeight: 1.6, fontSize: "1.05rem" }}
            >
              Manage your expense groups and track spending effortlessly
            </Typography>

            {/* Stats Pills */}
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ mt: 3, flexWrap: "wrap", rowGap: 1.5 }}
            >
              <Chip
                icon={<Group sx={{ color: "#0F766E !important" }} />}
                label={`${groups.length} Active Groups`}
                sx={{
                  height: 38,
                  px: 0.5,
                  backgroundColor: "rgba(20,184,166,0.12)",
                  color: "#0F766E",
                  borderRadius: "999px",
                  "& .MuiChip-label": {
                    fontFamily: display,
                    fontSize: "0.9rem",
                    fontWeight: 700,
                  },
                }}
              />
              <Chip
                icon={<TrendingUp sx={{ color: "#fff !important" }} />}
                label="Expense Tracking"
                sx={{
                  height: 38,
                  px: 0.5,
                  backgroundColor: ui.ink,
                  color: "#fff",
                  borderRadius: "999px",
                  "& .MuiChip-label": {
                    fontFamily: display,
                    fontSize: "0.9rem",
                    fontWeight: 700,
                  },
                }}
              />
            </Stack>
          </Box>

          <Button
            variant="contained"
            size="large"
            disableElevation
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{ ...gradientBtn, py: 1.8, px: 4.5, fontSize: "1.05rem" }}
          >
            Create New Group
          </Button>
        </Box>

        {/* Alert Messages */}
        {error && (
          <Slide direction="down" in timeout={300}>
            <Alert
              severity="error"
              sx={{
                ...alertBase,
                backgroundColor: "#FFF1F2",
                color: "#9F1239",
                border: "1px solid rgba(244,63,94,0.3)",
                "& .MuiAlert-icon": { color: ui.coral },
              }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          </Slide>
        )}

        {success && (
          <Slide direction="down" in timeout={300}>
            <Alert
              severity="success"
              sx={{
                ...alertBase,
                backgroundColor: "#ECFDF5",
                color: "#065F46",
                border: "1px solid rgba(16,185,129,0.35)",
                "& .MuiAlert-icon": { color: "#10B981" },
              }}
              onClose={() => setSuccess("")}
            >
              {success}
            </Alert>
          </Slide>
        )}

        {/* Groups Grid or Empty State */}
        {groups.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              ...cardSx,
              p: { xs: 5, sm: 8 },
              textAlign: "center",
              border: "2px dashed rgba(15,23,42,0.18)",
              boxShadow: "none",
              backgroundColor: "rgba(255,255,255,0.7)",
            }}
          >
            <Box
              sx={{
                ...iconTile(110, "34px"),
                mx: "auto",
                mb: 4,
              }}
            >
              <Group sx={{ fontSize: 56 }} />
            </Box>
            <Typography
              variant="h3"
              color={ui.ink}
              gutterBottom
              sx={{
                fontFamily: display,
                fontWeight: 800,
                letterSpacing: "-0.055em",
                fontSize: { xs: "2.2rem", sm: "2.8rem" },
              }}
            >
              No Groups Yet
            </Typography>
            <Typography
              variant="h6"
              color={ui.muted}
              sx={{
                mb: 5,
                maxWidth: 500,
                mx: "auto",
                lineHeight: 1.6,
                fontWeight: 500,
                fontSize: "1.05rem",
              }}
            >
              Create your first expense group to start splitting bills with
              friends, family, or colleagues. It's quick and easy!
            </Typography>
            <Button
              variant="contained"
              size="large"
              disableElevation
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
              sx={{ ...gradientBtn, py: 1.9, px: 5, fontSize: "1.1rem" }}
            >
              Create Your First Group
            </Button>
          </Paper>
        ) : (
          /* CSS grid: every card gets its own cell, so nothing can overlap */
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
                xl: "repeat(4, minmax(0, 1fr))",
              },
              gap: 3,
              alignItems: "stretch",
            }}
          >
            {groups.map((group, index) => {
              const [from, to] = accents[index % accents.length];
              return (
                <Box
                  key={group.id}
                  sx={{
                    ...cardSx,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    overflow: "hidden",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      borderColor: `${to}88`,
                      boxShadow: `0 16px 36px -22px ${to}`,
                    },
                  }}
                >
                  {/* Colour band */}
                  <Box
                    aria-hidden
                    sx={{
                      height: 6,
                      background: `linear-gradient(90deg, ${from}, ${to})`,
                    }}
                  />

                  <Box
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      gap: 2.5,
                    }}
                  >
                    {/* Identity */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <Box
                        sx={{
                          ...iconTile(52, "16px"),
                          background: `linear-gradient(135deg, ${from}, ${to})`,
                        }}
                      >
                        <Group sx={{ fontSize: 26 }} />
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="h5"
                          color={ui.ink}
                          sx={{
                            fontFamily: display,
                            fontWeight: 800,
                            fontSize: "1.35rem",
                            letterSpacing: "-0.04em",
                            lineHeight: 1.2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            wordBreak: "break-word",
                          }}
                        >
                          {group.name}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Chip
                            label="Active"
                            size="small"
                            sx={{
                              backgroundColor: "#ECFDF5",
                              color: "#047857",
                              fontFamily: display,
                              fontWeight: 700,
                            }}
                          />
                          <Chip
                            label="Shared"
                            size="small"
                            sx={{
                              backgroundColor: "#EFF6FF",
                              color: "#1D4ED8",
                              fontFamily: display,
                              fontWeight: 700,
                            }}
                          />
                        </Stack>
                      </Box>
                      <IconButton
                        aria-label="More options"
                        sx={{
                          mt: -0.5,
                          mr: -1,
                          color: ui.muted,
                          "&:hover": { backgroundColor: "rgba(15,23,42,0.06)" },
                          "&:focus-visible": focusRing,
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    {/* Numbers */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                        borderRadius: "16px",
                        backgroundColor: "rgba(15,23,42,0.035)",
                      }}
                    >
                      <Box sx={{ p: 2, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: display,
                            fontWeight: 800,
                            fontSize: "1.8rem",
                            lineHeight: 1.1,
                            letterSpacing: "-0.05em",
                            fontVariantNumeric: "tabular-nums",
                            color: ui.ink,
                          }}
                        >
                          {group.member_count || 0}
                        </Typography>
                        <Typography sx={statLabel}>Members</Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          minWidth: 0,
                          borderLeft: "1px dashed rgba(15,23,42,0.2)",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: display,
                            fontWeight: 800,
                            fontSize: "1.8rem",
                            lineHeight: 1.1,
                            letterSpacing: "-0.05em",
                            fontVariantNumeric: "tabular-nums",
                            color: ui.ink,
                            overflowWrap: "anywhere",
                          }}
                        >
                          ₹{group.total_expenses || 0}
                        </Typography>
                        <Typography sx={statLabel}>Total Spent</Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color={ui.muted}
                      sx={{ lineHeight: 1.6, fontWeight: 500 }}
                    >
                      Track and split expenses seamlessly with your group
                      members.
                    </Typography>

                    {/* Actions pinned to the bottom of every card */}
                    <Box sx={{ mt: "auto", display: "grid", gap: 1.25 }}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                          gap: 1.25,
                        }}
                      >
                        <Button
                          startIcon={<People />}
                          onClick={() =>
                            navigate(`/groups/${group.id}/add-members`)
                          }
                          sx={{
                            py: 1.1,
                            borderRadius: "999px",
                            fontFamily: display,
                            fontWeight: 700,
                            textTransform: "none",
                            color: ui.ink,
                            border: "1.5px solid rgba(15,23,42,0.18)",
                            "&:hover": {
                              background: ui.ink,
                              color: "#fff",
                              borderColor: ui.ink,
                            },
                            "&:focus-visible": focusRing,
                          }}
                        >
                          Members
                        </Button>
                        <Button
                          startIcon={<Analytics />}
                          onClick={() => navigate(`/summary/${group.id}`)}
                          sx={{
                            py: 1.1,
                            borderRadius: "999px",
                            fontFamily: display,
                            fontWeight: 700,
                            textTransform: "none",
                            color: "#fff",
                            background: `linear-gradient(135deg, ${from}, ${to})`,
                            "&:hover": { filter: "brightness(1.08)" },
                            "&:focus-visible": focusRing,
                          }}
                        >
                          Summary
                        </Button>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="text"
                          startIcon={<Share />}
                          size="small"
                          sx={{
                            fontFamily: display,
                            fontWeight: 700,
                            textTransform: "none",
                            color: ui.muted,
                            borderRadius: "999px",
                            px: 1.5,
                            "&:hover": {
                              backgroundColor: "rgba(20,184,166,0.12)",
                              color: "#0F766E",
                            },
                            "&:focus-visible": focusRing,
                          }}
                        >
                          Share Group
                        </Button>
                        <Tooltip title="Delete Group">
                          <IconButton
                            aria-label="Delete group"
                            onClick={() => handleDeleteGroup(group.id)}
                            sx={{
                              color: ui.coral,
                              backgroundColor: "rgba(244,63,94,0.1)",
                              "&:hover": {
                                backgroundColor: ui.coral,
                                color: "#fff",
                              },
                              "&:focus-visible": focusRing,
                            }}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Create Group Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="sm"
          BackdropProps={{
            sx: {
              backgroundColor: "rgba(11,16,32,0.35)",
              backdropFilter: "blur(6px)",
            },
          }}
          PaperProps={{
            sx: {
              borderRadius: "28px",
              background: "#fff",
              border: `1px solid ${ui.line}`,
              boxShadow: "0 40px 90px -30px rgba(59,130,246,0.55)",
            },
          }}
        >
          <DialogTitle
            sx={{
              pb: 3,
              pt: 4,
              mx: 3,
              textAlign: "center",
              borderBottom: "2px dashed rgba(15,23,42,0.14)",
            }}
          >
            <Box sx={{ ...iconTile(72, "22px"), mx: "auto", mb: 2 }}>
              <Add sx={{ fontSize: 36 }} />
            </Box>
            <Typography
              variant="h4"
              color={ui.ink}
              gutterBottom
              sx={{ fontFamily: display, fontWeight: 800, letterSpacing: "-0.05em" }}
            >
              Create New Group
            </Typography>
            <Typography variant="body1" color={ui.muted} fontWeight={500}>
              Start tracking expenses with your friends and family
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Group Name"
              placeholder="e.g., Weekend Trip, Office Lunch, Roommate Expenses..."
              fullWidth
              variant="outlined"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              sx={{
                ...fieldSx,
                "& .MuiOutlinedInput-input": { py: 1.9, fontSize: "1.05rem" },
              }}
              onKeyPress={(e) => e.key === "Enter" && handleCreateGroup()}
            />
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 1.5 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{
                borderRadius: "999px",
                px: 3.5,
                py: 1.4,
                fontFamily: display,
                fontWeight: 700,
                textTransform: "none",
                color: ui.ink,
                border: "1.5px solid rgba(15,23,42,0.15)",
                "&:hover": { backgroundColor: "rgba(15,23,42,0.06)" },
                "&:focus-visible": focusRing,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleCreateGroup}
              disabled={!newGroupName.trim()}
              sx={{ ...gradientBtn, px: 4, py: 1.4, fontSize: "1rem" }}
            >
              Create Group
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}