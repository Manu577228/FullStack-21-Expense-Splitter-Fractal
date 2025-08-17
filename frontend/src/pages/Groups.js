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
  Divider,
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
  Avatar,
  Chip,
  IconButton,
  Stack,
  Fade,
  Slide,
  Zoom,
  CardHeader,
  Tooltip,
  ButtonGroup,
} from "@mui/material";
import {
  Group,
  Login,
  Add,
  People,
  Analytics,
  DeleteOutline,
  AttachMoney,
  TrendingUp,
  Dashboard,
  Settings,
  Share,
  MoreVert,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import { apiFetch } from "../api";

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
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 3,
              textAlign: "center",
              background: "#ffffff",
              maxWidth: 400,
              width: "100%",
              border: "2px solid #000000",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CircularProgress
              size={80}
              thickness={2}
              sx={{
                color: "#000000",
                mb: 4,
              }}
            />
            <Typography
              variant="h5"
              color="#000000"
              fontWeight={700}
              gutterBottom
            >
              Loading Groups
            </Typography>
            <Typography variant="body1" color="#666666">
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
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Zoom in timeout={1000}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 3,
              textAlign: "center",
              background: "#ffffff",
              maxWidth: 500,
              width: "100%",
              border: "3px solid #000000",
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.4)",
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                bgcolor: "#000000",
                mx: "auto",
                mb: 3,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Login sx={{ fontSize: 50, color: "#ffffff" }} />
            </Box>
            <Typography
              variant="h3"
              fontWeight={900}
              color="#000000"
              gutterBottom
            >
              Welcome Back!
            </Typography>
            <Typography
              variant="h6"
              color="#666666"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              Please login to access your expense groups and start tracking
              shared expenses with your friends.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Login />}
              onClick={() => navigate("/login")}
              sx={{
                py: 2,
                px: 6,
                borderRadius: 0,
                fontSize: "1.1rem",
                fontWeight: 700,
                background: "#000000",
                color: "#ffffff",
                border: "2px solid #000000",
                "&:hover": {
                  background: "#ffffff",
                  color: "#000000",
                  border: "2px solid #000000",
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Login to Continue
            </Button>
          </Paper>
        </Zoom>
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
        py: { xs: 3, sm: 4 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Fade in timeout={800}>
          <Paper
            elevation={20}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 0,
              mb: 4,
              background: "#ffffff",
              border: "3px solid #000000",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: "#000000",
                    mb: 1,
                    fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                  }}
                >
                  My Groups
                </Typography>
                <Typography
                  variant="h6"
                  color="#666666"
                  sx={{ fontWeight: 500, lineHeight: 1.6 }}
                >
                  Manage your expense groups and track spending effortlessly
                </Typography>

                {/* Stats Pills */}
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ mt: 3, flexWrap: "wrap" }}
                >
                  <Chip
                    icon={<Group sx={{ color: "#000000 !important" }} />}
                    label={`${groups.length} Active Groups`}
                    sx={{
                      py: 2,
                      px: 1,
                      backgroundColor: "#f5f5f5",
                      color: "#000000",
                      border: "2px solid #000000",
                      borderRadius: 0,
                      "& .MuiChip-label": {
                        fontSize: "0.9rem",
                        fontWeight: 700,
                      },
                    }}
                  />
                  <Chip
                    icon={<TrendingUp sx={{ color: "#000000 !important" }} />}
                    label="Expense Tracking"
                    sx={{
                      py: 2,
                      px: 1,
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      borderRadius: 0,
                      "& .MuiChip-label": {
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
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  py: 2.5,
                  px: 5,
                  borderRadius: 0,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  background: "#000000",
                  color: "#ffffff",
                  border: "2px solid #000000",
                  "&:hover": {
                    background: "#ffffff",
                    color: "#000000",
                    border: "2px solid #000000",
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Create New Group
              </Button>
            </Box>
          </Paper>
        </Fade>

        {/* Alert Messages */}
        {error && (
          <Slide direction="down" in timeout={500}>
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 0,
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "2px solid #000000",
                "& .MuiAlert-icon": { color: "#000000" },
                fontSize: "1rem",
                fontWeight: 600,
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
                mb: 3,
                borderRadius: 0,
                backgroundColor: "#000000",
                color: "#ffffff",
                border: "2px solid #000000",
                "& .MuiAlert-icon": { color: "#ffffff" },
                fontSize: "1rem",
                fontWeight: 600,
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
              elevation={20}
              sx={{
                p: { xs: 6, sm: 8, md: 10 },
                borderRadius: 0,
                textAlign: "center",
                background: "#ffffff",
                border: "3px solid #000000",
                boxShadow: "0 25px 80px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Box
                sx={{
                  width: { xs: 120, sm: 150 },
                  height: { xs: 120, sm: 150 },
                  mx: "auto",
                  mb: 4,
                  backgroundColor: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                }}
              >
                <Group
                  sx={{ fontSize: { xs: 60, sm: 80 }, color: "#ffffff" }}
                />
              </Box>
              <Typography
                variant="h3"
                fontWeight={900}
                color="#000000"
                gutterBottom
              >
                No Groups Yet
              </Typography>
              <Typography
                variant="h6"
                color="#666666"
                sx={{ mb: 6, maxWidth: 500, mx: "auto", lineHeight: 1.6 }}
              >
                Create your first expense group to start splitting bills with
                friends, family, or colleagues. It's quick and easy!
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  py: 3,
                  px: 6,
                  borderRadius: 0,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  background: "#000000",
                  color: "#ffffff",
                  border: "2px solid #000000",
                  "&:hover": {
                    background: "#ffffff",
                    color: "#000000",
                    border: "2px solid #000000",
                    transform: "translateY(-3px)",
                    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Create Your First Group
              </Button>
            </Paper>
          </Zoom>
        ) : (
          <Grid container spacing={4}>
            {groups.map((group, index) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={group.id}>
                <Zoom in timeout={800 + index * 200}>
                  <Card
                    elevation={16}
                    sx={{
                      borderRadius: 0,
                      background: "#ffffff",
                      border: "2px solid #000000",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                      },
                      cursor: "pointer",
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            backgroundColor:
                              index % 2 === 0 ? "#000000" : "#ffffff",
                            border: "2px solid #000000",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                          }}
                        >
                          <Group
                            sx={{
                              fontSize: 30,
                              color: index % 2 === 0 ? "#ffffff" : "#000000",
                            }}
                          />
                        </Box>
                      }
                      title={
                        <Typography
                          variant="h5"
                          fontWeight={800}
                          color="#000000"
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
                              backgroundColor: "#000000",
                              color: "#ffffff",
                              fontWeight: 700,
                              borderRadius: 0,
                            }}
                          />
                          <Chip
                            label="Shared"
                            size="small"
                            sx={{
                              backgroundColor: "#ffffff",
                              color: "#000000",
                              border: "1px solid #000000",
                              fontWeight: 700,
                              borderRadius: 0,
                            }}
                          />
                        </Stack>
                      }
                      action={
                        <IconButton sx={{ color: "#000000" }}>
                          <MoreVert />
                        </IconButton>
                      }
                    />

                    <CardContent sx={{ pt: 0 }}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 2,
                          mb: 2,
                          p: 2,
                          bgcolor: "#f8f8f8",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h4"
                            fontWeight={900}
                            color="#000000"
                          >
                            {group.member_count || 0}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="#666666"
                            fontWeight={700}
                          >
                            Members
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h4"
                            fontWeight={900}
                            color="#000000"
                          >
                            ₹{group.total_expenses || 0}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="#666666"
                            fontWeight={700}
                          >
                            Total Spent
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        color="#666666"
                        sx={{ mb: 2, lineHeight: 1.6, fontWeight: 500 }}
                      >
                        Track and split expenses seamlessly with your group
                        members.
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Stack direction="column" spacing={2} width="100%">
                        <ButtonGroup variant="outlined" fullWidth>
                          <Button
                            startIcon={<People />}
                            onClick={() =>
                              navigate(`/groups/${group.id}/add-members`)
                            }
                            sx={{
                              borderColor: "#000000",
                              color: "#000000",
                              fontWeight: 700,
                              "&:hover": {
                                backgroundColor: "#000000",
                                color: "#ffffff",
                                borderColor: "#000000",
                              },
                            }}
                          >
                            Members
                          </Button>
                          <Button
                            startIcon={<Analytics />}
                            onClick={() => navigate(`/summary/${group.id}`)}
                            sx={{
                              borderColor: "#000000",
                              color: "#000000",
                              fontWeight: 700,
                              "&:hover": {
                                backgroundColor: "#000000",
                                color: "#ffffff",
                                borderColor: "#000000",
                              },
                            }}
                          >
                            Summary
                          </Button>
                        </ButtonGroup>

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
                              color: "#000000",
                              "&:hover": {
                                backgroundColor: "#f5f5f5",
                              },
                            }}
                          >
                            Share Group
                          </Button>
                          <Tooltip title="Delete Group">
                            <IconButton
                              onClick={() => handleDeleteGroup(group.id)}
                              sx={{
                                color: "#000000",
                                border: "1px solid #000000",
                                "&:hover": {
                                  backgroundColor: "#000000",
                                  color: "#ffffff",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease",
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
            ))}
          </Grid>
        )}

        {/* Create Group Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 0,
              background: "#ffffff",
              border: "3px solid #000000",
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          <DialogTitle sx={{ pb: 2, textAlign: "center" }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 2,
                backgroundColor: "#000000",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Add sx={{ fontSize: 40, color: "#ffffff" }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight={900}
              color="#000000"
              gutterBottom
            >
              Create New Group
            </Typography>
            <Typography variant="body1" color="#666666" fontWeight={500}>
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 0,
                  fontSize: "1.1rem",
                  py: 1,
                  "& fieldset": {
                    borderColor: "#000000",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#000000",
                    borderWidth: "2px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#000000",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                },
              }}
              onKeyPress={(e) => e.key === "Enter" && handleCreateGroup()}
            />
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{
                borderRadius: 0,
                px: 3,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1rem",
                color: "#000000",
                border: "2px solid #000000",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateGroup}
              disabled={!newGroupName.trim()}
              sx={{
                borderRadius: 0,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1rem",
                background: "#000000",
                color: "#ffffff",
                border: "2px solid #000000",
                "&:hover": {
                  background: "#ffffff",
                  color: "#000000",
                  border: "2px solid #000000",
                },
                "&:disabled": {
                  background: "#cccccc",
                  color: "#666666",
                  border: "2px solid #cccccc",
                },
              }}
            >
              Create Group
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
