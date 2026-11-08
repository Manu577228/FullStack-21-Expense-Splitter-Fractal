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
  Grid,
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
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Stack,
  Fade,
  Slide,
  Zoom,
  CardHeader,
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
  line: "rgba(15,23,42,0.08)",
  teal: "#14B8A6",
  coral: "#F43F5E",
  aurora: "linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%)",
};

const accents = [
  ["#14B8A6", "#3B82F6"],
  ["#8B5CF6", "#EC4899"],
  ["#F59E0B", "#F43F5E"],
  ["#10B981", "#06B6D4"],
  ["#6366F1", "#8B5CF6"],
];

const pageSx = {
  position: "relative",
  overflow: "hidden",
  minHeight: "100vh",
  backgroundColor: "#F8FAFC",
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
  backgroundColor: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(14px)",
  border: `1px solid ${ui.line}`,
  boxShadow: "0 30px 70px -30px rgba(59,130,246,0.35), 0 2px 8px rgba(15,23,42,0.04)",
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
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#0D9488" },
};

const iconTile = (size = 56, radius = "18px") => ({
  width: size,
  height: size,
  borderRadius: radius,
  display: "grid",
  placeItems: "center",
  color: "#fff",
  background: ui.aurora,
  boxShadow:
    "0 14px 28px -10px rgba(99,102,241,0.7), inset 0 1px 0 rgba(255,255,255,0.35)",
});

const gradientBtn = {
  borderRadius: "999px",
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
  "&.Mui-disabled": {
    background: "#E2E8F0",
    color: "#94A3B8",
    boxShadow: "none",
  },
};

const alertBase = {
  mb: 3,
  borderRadius: "16px",
  fontWeight: 600,
  alignItems: "center",
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
            <CircularProgress
              size={72}
              thickness={4}
              sx={{ color: ui.teal, mb: 3 }}
            />
            <Typography variant="h5" color={ui.ink} fontWeight={800} gutterBottom>
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
        }}
      >
        <Zoom in timeout={1000}>
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
            <Box sx={{ ...iconTile(92, "28px"), mx: "auto", mb: 3 }}>
              <Login sx={{ fontSize: 46 }} />
            </Box>
            <Typography
              variant="h3"
              fontWeight={800}
              color={ui.ink}
              gutterBottom
              sx={{ letterSpacing: "-1.5px" }}
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
        </Zoom>
      </Box>
    );

  return (
    <Box sx={{ ...pageSx, py: { xs: 3, sm: 4 } }}>
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pb: 12 }}>
        {/* Header Section */}
        <Fade in timeout={800}>
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
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: ui.ink,
                  mb: 1,
                  fontSize: { xs: "2.4rem", sm: "3rem", md: "3.6rem" },
                  letterSpacing: "-2px",
                  lineHeight: 1.05,
                }}
              >
                My{" "}
                <Box
                  component="span"
                  sx={{
                    background: ui.aurora,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Groups
                </Box>
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
                    "& .MuiChip-label": { fontSize: "0.9rem", fontWeight: 700 },
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
                    "& .MuiChip-label": { fontSize: "0.9rem", fontWeight: 700 },
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
              sx={{ ...gradientBtn, py: 1.9, px: 4.5, fontSize: "1.05rem" }}
            >
              Create New Group
            </Button>
          </Box>
        </Fade>

        {/* Alert Messages */}
        {error && (
          <Slide direction="down" in timeout={500}>
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
          <Slide direction="down" in timeout={500}>
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
          <Zoom in timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                ...cardSx,
                p: { xs: 6, sm: 8, md: 10 },
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  ...iconTile(130, "40px"),
                  mx: "auto",
                  mb: 4,
                  width: { xs: 110, sm: 130 },
                  height: { xs: 110, sm: 130 },
                }}
              >
                <Group sx={{ fontSize: { xs: 54, sm: 66 } }} />
              </Box>
              <Typography
                variant="h3"
                fontWeight={800}
                color={ui.ink}
                gutterBottom
                sx={{ letterSpacing: "-1.5px" }}
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
                sx={{ ...gradientBtn, py: 2, px: 5, fontSize: "1.1rem" }}
              >
                Create Your First Group
              </Button>
            </Paper>
          </Zoom>
        ) : (
          <Grid container spacing={3.5}>
            {groups.map((group, index) => {
              const [from, to] = accents[index % accents.length];
              return (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={group.id}>
                  <Zoom in timeout={800 + index * 200}>
                    <Card
                      elevation={0}
                      sx={{
                        ...cardSx,
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 5,
                          background: `linear-gradient(90deg, ${from}, ${to})`,
                        },
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: `0 40px 70px -30px ${to}`,
                        },
                      }}
                    >
                      <CardHeader
                        sx={{ pt: 3 }}
                        avatar={
                          <Box
                            sx={{
                              ...iconTile(60, "20px"),
                              background: `linear-gradient(135deg, ${from}, ${to})`,
                              boxShadow: `0 16px 28px -12px ${to}`,
                            }}
                          >
                            <Group sx={{ fontSize: 30 }} />
                          </Box>
                        }
                        title={
                          <Typography
                            variant="h5"
                            fontWeight={800}
                            color={ui.ink}
                            sx={{ letterSpacing: "-0.6px" }}
                          >
                            {group.name}
                          </Typography>
                        }
                        subheader={
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Chip
                              label="Active"
                              size="small"
                              sx={{
                                backgroundColor: "#ECFDF5",
                                color: "#047857",
                                fontWeight: 700,
                              }}
                            />
                            <Chip
                              label="Shared"
                              size="small"
                              sx={{
                                backgroundColor: "#EFF6FF",
                                color: "#1D4ED8",
                                fontWeight: 700,
                              }}
                            />
                          </Stack>
                        }
                        action={
                          <IconButton
                            sx={{
                              color: ui.muted,
                              "&:hover": { backgroundColor: "rgba(15,23,42,0.06)" },
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        }
                      />

                      <CardContent sx={{ pt: 0 }}>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 1.5,
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 2,
                              borderRadius: "18px",
                              backgroundColor: "rgba(241,245,249,0.8)",
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight={800}
                              color={ui.ink}
                              sx={{ letterSpacing: "-1px" }}
                            >
                              {group.member_count || 0}
                            </Typography>
                            <Typography
                              variant="body2"
                              color={ui.muted}
                              fontWeight={700}
                            >
                              Members
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 2,
                              borderRadius: "18px",
                              backgroundColor: "rgba(241,245,249,0.8)",
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight={800}
                              sx={{
                                letterSpacing: "-1px",
                                background: `linear-gradient(135deg, ${from}, ${to})`,
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              ₹{group.total_expenses || 0}
                            </Typography>
                            <Typography
                              variant="body2"
                              color={ui.muted}
                              fontWeight={700}
                            >
                              Total Spent
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          color={ui.muted}
                          sx={{ mb: 1, lineHeight: 1.6, fontWeight: 500 }}
                        >
                          Track and split expenses seamlessly with your group
                          members.
                        </Typography>
                      </CardContent>

                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Stack direction="column" spacing={2} width="100%">
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 1.25,
                            }}
                          >
                            <Button
                              startIcon={<People />}
                              onClick={() =>
                                navigate(`/groups/${group.id}/add-members`)
                              }
                              sx={{
                                py: 1.2,
                                borderRadius: "999px",
                                fontWeight: 700,
                                textTransform: "none",
                                color: ui.ink,
                                border: "1.5px solid rgba(15,23,42,0.15)",
                                transition: "all 0.25s ease",
                                "&:hover": {
                                  background: ui.ink,
                                  color: "#fff",
                                  borderColor: ui.ink,
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              Members
                            </Button>
                            <Button
                              startIcon={<Analytics />}
                              onClick={() => navigate(`/summary/${group.id}`)}
                              sx={{
                                py: 1.2,
                                borderRadius: "999px",
                                fontWeight: 700,
                                textTransform: "none",
                                color: "#fff",
                                background: `linear-gradient(135deg, ${from}, ${to})`,
                                boxShadow: `0 14px 26px -12px ${to}`,
                                transition: "all 0.25s ease",
                                "&:hover": {
                                  filter: "brightness(1.08)",
                                  transform: "translateY(-2px)",
                                },
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
                                fontWeight: 700,
                                textTransform: "none",
                                color: ui.muted,
                                borderRadius: "999px",
                                px: 1.5,
                                "&:hover": {
                                  backgroundColor: "rgba(20,184,166,0.12)",
                                  color: "#0F766E",
                                },
                              }}
                            >
                              Share Group
                            </Button>
                            <Tooltip title="Delete Group">
                              <IconButton
                                onClick={() => handleDeleteGroup(group.id)}
                                sx={{
                                  color: ui.coral,
                                  backgroundColor: "rgba(244,63,94,0.10)",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    backgroundColor: ui.coral,
                                    color: "#fff",
                                    transform: "scale(1.1)",
                                  },
                                }}
                              >
                                <DeleteOutline />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Stack>
                      </CardActions>
                    </Card>
                  </Zoom>
                </Grid>
              );
            })}
          </Grid>
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
          <DialogTitle sx={{ pb: 2, pt: 4, textAlign: "center" }}>
            <Box sx={{ ...iconTile(76, "24px"), mx: "auto", mb: 2 }}>
              <Add sx={{ fontSize: 38 }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight={800}
              color={ui.ink}
              gutterBottom
              sx={{ letterSpacing: "-1px" }}
            >
              Create New Group
            </Typography>
            <Typography variant="body1" color={ui.muted} fontWeight={500}>
              Start tracking expenses with your friends and family
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Group Name"
              placeholder="e.g., Weekend Trip, Office Lunch, Roommate Expenses..."
              fullWidth
              variant="outlined"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              sx={fieldSx}
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
                fontWeight: 700,
                textTransform: "none",
                color: ui.ink,
                border: "1.5px solid rgba(15,23,42,0.15)",
                "&:hover": { backgroundColor: "rgba(15,23,42,0.06)" },
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