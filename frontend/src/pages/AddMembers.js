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
  ListItemText,
  Box,
  Paper,
  Alert,
  Divider,
  CircularProgress,
  IconButton,
  Avatar,
  ListItemAvatar,
  Chip,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Stack,
  Fade,
  Slide,
  Zoom,
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
          minHeight: "100vh",
          background: "linear-gradient(135deg, #000 0%, #111 100%)",
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
              borderRadius: 6,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              maxWidth: 400,
              width: "100%",
              border: "1px solid #000",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            }}
          >
            <Box sx={{ mb: 3, color: "#000" }}>
              <CircularProgress
                size={80}
                thickness={4}
                sx={{ color: "#000" }}
              />
            </Box>
            <Typography variant="h5" color="#000" fontWeight={800} gutterBottom>
              Loading Group Data
            </Typography>
            <Typography variant="body1" sx={{ color: "#444" }}>
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
          minHeight: "100vh",
          background: "linear-gradient(135deg, #000 0%, #111 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Zoom in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 6,
              textAlign: "center",
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(20px)",
              maxWidth: 500,
              width: "100%",
              border: "1px solid #000",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "#000",
                mx: "auto",
                mb: 3,
                color: "#fff",
                border: "2px solid #000",
              }}
            >
              <ErrorIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={900} color="#000" gutterBottom>
              Group Not Found
            </Typography>
            <Typography variant="body1" sx={{ color: "#444", mb: 4 }}>
              The group you're looking for doesn't exist or you don't have
              access to it.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/groups")}
              sx={{
                py: 2,
                px: 4,
                borderRadius: 4,
                fontWeight: 800,
                background: "#000",
                color: "#fff",
                "&:hover": {
                  background: "#111",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Back to Groups
            </Button>
          </Paper>
        </Zoom>
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000 0%, #111 100%)",
        py: { xs: 3, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Paper
            elevation={20}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 6,
              mb: 4,
              background: "#fff",
              border: "2px solid #000",
              boxShadow: "0 12px 50px rgba(0,0,0,0.6)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <IconButton
                onClick={() => navigate("/groups")}
                sx={{
                  mr: 2,
                  background: "#000",
                  color: "#fff",
                  border: "2px solid #000",
                  "&:hover": {
                    transform: "scale(1.06)",
                    background: "#111",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                <ArrowBack />
              </IconButton>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    background: "linear-gradient(45deg, #000, #444)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  }}
                >
                  Manage Members
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#555", fontWeight: 600 }}
                >
                  {group.name} • Add and manage group participants
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    borderRadius: 3,
                    background: "#000",
                    color: "#fff",
                    border: "2px solid #000",
                  }}
                >
                  <Typography variant="h4" fontWeight={900}>
                    {members.length}
                  </Typography>
                  <Typography variant="body2" fontWeight={800}>
                    Total Members
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    borderRadius: 3,
                    background: "#fff",
                    color: "#000",
                    border: "2px solid #000",
                  }}
                >
                  <Typography variant="h4" fontWeight={900}>
                    {members.filter((m) => m.is_admin).length}
                  </Typography>
                  <Typography variant="body2" fontWeight={800}>
                    Admins
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    borderRadius: 3,
                    background: "linear-gradient(180deg, #fff 0%, #eee 100%)",
                    color: "#000",
                    border: "2px solid #000",
                  }}
                >
                  <Typography variant="h4" fontWeight={900}>
                    Active
                  </Typography>
                  <Typography variant="body2" fontWeight={800}>
                    Group Status
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {error && (
          <Slide direction="down" in timeout={500}>
            <Alert
              variant="outlined"
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 4,
                borderColor: "#000",
                color: "#000",
                backgroundColor: "#fff",
                "& .MuiAlert-icon": { color: "#000" },
                fontSize: "1rem",
                fontWeight: 600,
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
                mb: 3,
                borderRadius: 4,
                borderColor: "#000",
                color: "#000",
                backgroundColor: "#fff",
                "& .MuiAlert-icon": { color: "#000" },
                fontSize: "1rem",
                fontWeight: 600,
              }}
              icon={<CheckCircle />}
              onClose={() => setSuccess("")}
            >
              {success}
            </Alert>
          </Slide>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} lg={5}>
            <Zoom in timeout={1000}>
              <Card
                elevation={20}
                sx={{
                  borderRadius: 6,
                  background: "#fff",
                  border: "2px solid #000",
                  boxShadow: "0 12px 50px rgba(0,0,0,0.6)",
                  height: "fit-content",
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        background: "#000",
                        color: "#fff",
                        width: 56,
                        height: 56,
                        border: "2px solid #000",
                      }}
                    >
                      <PersonAdd sx={{ fontSize: 28 }} />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h5" fontWeight={900} color="#000">
                      Add New Member
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      Invite someone to join this expense group
                    </Typography>
                  }
                />

                <CardContent>
                  <TextField
                    fullWidth
                    label="Username or Email"
                    placeholder="Enter username or email address..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={addingMember}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 4,
                        fontSize: "1.05rem",
                      },
                      "& .MuiInputLabel-root": {
                        fontWeight: 700,
                        color: "#000",
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: "#000" }} />
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
                      py: 2,
                      borderRadius: 4,
                      fontWeight: 900,
                      fontSize: "1.05rem",
                      background: "#000",
                      color: "#fff",
                      border: "2px solid #000",
                      "&:hover": {
                        background: "#111",
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                      },
                      "&:disabled": {
                        background: "#e0e0e0",
                        color: "#888",
                        borderColor: "#e0e0e0",
                        transform: "none",
                      },
                      transition: "all 0.25s ease",
                    }}
                  >
                    {addingMember ? "Adding Member..." : "Add Member"}
                  </Button>
                </CardActions>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} lg={7}>
            <Fade in timeout={1200}>
              <Card
                elevation={20}
                sx={{
                  borderRadius: 6,
                  background: "#fff",
                  border: "2px solid #000",
                  boxShadow: "0 12px 50px rgba(0,0,0,0.6)",
                }}
              >
                <CardHeader
                  avatar={
                    <Badge
                      badgeContent={members.length}
                      max={999}
                      sx={{
                        "& .MuiBadge-badge": {
                          background: "#000",
                          color: "#fff",
                          border: "1px solid #000",
                          fontWeight: 800,
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          background: "#000",
                          color: "#fff",
                          width: 56,
                          height: 56,
                          border: "2px solid #000",
                        }}
                      >
                        <Group sx={{ fontSize: 28 }} />
                      </Avatar>
                    </Badge>
                  }
                  title={
                    <Typography variant="h5" fontWeight={900} color="#000">
                      Group Members ({members.length})
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      Everyone who can view and add expenses to this group
                    </Typography>
                  }
                />

                <CardContent sx={{ pt: 0 }}>
                  {members.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: "#eee",
                          mx: "auto",
                          mb: 2,
                          color: "#000",
                          border: "2px solid #000",
                        }}
                      >
                        <People sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{ color: "#555" }}
                        gutterBottom
                      >
                        No members yet
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#888" }}>
                        Add the first member to get started
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ py: 0 }}>
                      {members.map((member, index) => (
                        <Slide
                          key={member.id}
                          direction="right"
                          in
                          timeout={1000 + index * 200}
                        >
                          <Box>
                            <ListItem
                              sx={{
                                borderRadius: 3,
                                mb: 1,
                                border: "1px solid #000",
                                background:
                                  "linear-gradient(180deg,#fff,#f8f8f8)",
                                "&:hover": {
                                  background: "#fff",
                                  transform: "translateX(8px)",
                                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                                },
                                transition: "all 0.25s ease",
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    background:
                                      index % 2 === 0
                                        ? "linear-gradient(45deg,#000,#333)"
                                        : "linear-gradient(45deg,#222,#000)",
                                    width: 48,
                                    height: 48,
                                    fontWeight: 900,
                                    color: "#fff",
                                    border: "2px solid #000",
                                  }}
                                >
                                  {member.username.charAt(0).toUpperCase()}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      fontWeight={800}
                                      color="#000"
                                    >
                                      {member.username}
                                    </Typography>
                                    {member.is_admin && (
                                      <Tooltip title="Group Administrator">
                                        <Chip
                                          icon={<Star sx={{ color: "#000" }} />}
                                          label="Admin"
                                          size="small"
                                          variant="outlined"
                                          sx={{
                                            borderColor: "#000",
                                            color: "#000",
                                            fontWeight: 800,
                                            height: 24,
                                          }}
                                        />
                                      </Tooltip>
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "#555", fontWeight: 600 }}
                                  >
                                    {member.is_admin
                                      ? "Group Administrator • Can manage members"
                                      : "Member • Can add and view expenses"}
                                  </Typography>
                                }
                              />
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  color: "#000",
                                }}
                              >
                                {member.is_admin ? (
                                  <SupervisorAccount />
                                ) : (
                                  <Person />
                                )}
                              </Box>
                            </ListItem>
                            {index < members.length - 1 && (
                              <Divider
                                variant="inset"
                                component="li"
                                sx={{ ml: 9, borderColor: "#000" }}
                              />
                            )}
                          </Box>
                        </Slide>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        <Fade in timeout={1500}>
          <Paper
            elevation={16}
            sx={{
              mt: 4,
              p: 4,
              borderRadius: 6,
              background: "#fff",
              border: "2px solid #000",
              boxShadow: "0 12px 50px rgba(0,0,0,0.6)",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={900}
              gutterBottom
              sx={{ mb: 3, color: "#000" }}
            >
              Quick Actions
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
            >
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(`/groups/${id}`)}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 4,
                  fontWeight: 800,
                  borderWidth: 2,
                  borderColor: "#000",
                  color: "#000",
                  "&:hover": {
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                    background: "#000",
                    color: "#fff",
                  },
                }}
              >
                Back to Group
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Analytics />}
                onClick={() => navigate(`/summary/${id}`)}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 4,
                  fontWeight: 800,
                  borderWidth: 2,
                  borderColor: "#000",
                  color: "#000",
                  "&:hover": {
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                    background: "#000",
                    color: "#fff",
                  },
                }}
              >
                View Summary
              </Button>

              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                disabled={members.length < 2}
                onClick={() => navigate(`/groups/${id}/add-expense`)}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 4,
                  fontWeight: 900,
                  background: members.length >= 2 ? "#000" : "#e0e0e0",
                  color: members.length >= 2 ? "#fff" : "#888",
                  border: "2px solid",
                  borderColor: members.length >= 2 ? "#000" : "#e0e0e0",
                  "&:hover": {
                    background: members.length >= 2 ? "#111" : "#e0e0e0",
                    transform:
                      members.length >= 2 ? "translateY(-2px)" : "none",
                    boxShadow:
                      members.length >= 2
                        ? "0 10px 30px rgba(0,0,0,0.6)"
                        : "none",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                {members.length < 2 ? "Need 2+ Members" : "Add Expense"}
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
