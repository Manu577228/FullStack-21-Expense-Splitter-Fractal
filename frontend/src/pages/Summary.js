/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  IconButton,
  Fade,
  Slide,
} from "@mui/material";
import {
  ArrowBack,
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Analytics,
  AddCircle,
  Group,
  Receipt,
} from "@mui/icons-material";
import { apiFetch } from "../api";

export default function Summary() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSummary();
  }, [groupId]);

  const loadSummary = async () => {
    try {
      const gRes = await apiFetch(`/api/groups/${groupId}/`);
      if (!gRes?.ok) throw new Error("Failed to load group");
      setGroup(await gRes.json());

      const sRes = await apiFetch(`/api/groups/${groupId}/summary/`);
      if (!sRes?.ok) throw new Error("Failed to load summary");
      setSummaryData(await sRes.json());
    } catch (err) {
      setError("Error loading summary: " + err.message);
    } finally {
      setLoading(false);
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
              borderRadius: 0,
              textAlign: "center",
              background: "#ffffff",
              maxWidth: 400,
              width: "100%",
              border: "3px solid #000000",
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.4)",
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
              Loading Summary
            </Typography>
            <Typography variant="body1" color="#666666">
              Please wait while we calculate the expenses...
            </Typography>
          </Paper>
        </Fade>
      </Box>
    );

  if (error)
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
        <Paper
          sx={{
            p: 4,
            background: "#ffffff",
            border: "3px solid #000000",
            borderRadius: 0,
            maxWidth: 500,
            width: "100%",
          }}
        >
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: "#ffffff",
              color: "#000000",
              border: "2px solid #000000",
              borderRadius: 0,
              "& .MuiAlert-icon": { color: "#000000" },
              fontWeight: 600,
            }}
          >
            {error}
          </Alert>
          <Button
            onClick={() => navigate("/groups")}
            sx={{
              background: "#000000",
              color: "#ffffff",
              border: "2px solid #000000",
              borderRadius: 0,
              fontWeight: 700,
              "&:hover": {
                background: "#ffffff",
                color: "#000000",
                border: "2px solid #000000",
              },
            }}
          >
            Back to Groups
          </Button>
        </Paper>
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
      <Container maxWidth="md" sx={{ pb: 10 }}>
        {/* Header Section */}
        <Fade in timeout={800}>
          <Paper
            elevation={20}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 0,
              mb: 4,
              background: "#ffffff",
              border: "3px solid #000000",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <IconButton
                onClick={() => navigate(`/groups/${groupId}/add-members`)}
                sx={{
                  mr: 2,
                  background: "#000000",
                  color: "#ffffff",
                  border: "2px solid #000000",
                  "&:hover": {
                    background: "#ffffff",
                    color: "#000000",
                    border: "2px solid #000000",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ArrowBack />
              </IconButton>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: "#000000",
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    fontSize: { xs: "2rem", sm: "2.5rem" },
                  }}
                >
                  Expense Summary
                </Typography>
                <Typography variant="h6" color="#666666" fontWeight={600}>
                  {group?.name} • Financial Overview
                </Typography>
              </Box>
              <Box
                sx={{
                  background: "#000000",
                  color: "#ffffff",
                  p: 2,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Analytics sx={{ fontSize: 32 }} />
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Total Amount Card */}
        <Slide direction="up" in timeout={1000}>
          <Paper
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 0,
              background: "#000000",
              color: "#ffffff",
              border: "3px solid #000000",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <AccountBalance sx={{ fontSize: 48, mr: 2 }} />
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ mb: 1, textTransform: "uppercase" }}
                >
                  Total Group Expenses
                </Typography>
                <Typography
                  variant="h2"
                  fontWeight={900}
                  sx={{ letterSpacing: "-0.02em" }}
                >
                  ₹{summaryData?.total_amount || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Slide>

        {/* Member Balances */}
        <Fade in timeout={1200}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 0,
              background: "#ffffff",
              border: "3px solid #000000",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  background: "#000000",
                  color: "#ffffff",
                  p: 1.5,
                  borderRadius: "50%",
                  mr: 2,
                }}
              >
                <Group sx={{ fontSize: 24 }} />
              </Box>
              <Typography
                variant="h5"
                fontWeight={900}
                color="#000000"
                sx={{ textTransform: "uppercase" }}
              >
                Member Balances
              </Typography>
            </Box>

            <Divider
              sx={{ mb: 3, borderColor: "#000000", borderWidth: "2px" }}
            />

            <Grid container spacing={3}>
              {summaryData?.member_balances?.map((member, index) => (
                <Grid item xs={12} sm={6} key={member.id}>
                  <Slide direction="right" in timeout={1400 + index * 200}>
                    <Card
                      sx={{
                        border: "2px solid #000000",
                        borderRadius: 0,
                        background: index % 2 === 0 ? "#000000" : "#ffffff",
                        color: index % 2 === 0 ? "#ffffff" : "#000000",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              backgroundColor:
                                index % 2 === 0 ? "#ffffff" : "#000000",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mr: 2,
                              fontWeight: 900,
                              fontSize: "1.2rem",
                              color: index % 2 === 0 ? "#000000" : "#ffffff",
                            }}
                          >
                            {member.username.charAt(0).toUpperCase()}
                          </Box>
                          <Typography variant="h6" fontWeight={800}>
                            {member.username}
                          </Typography>
                        </Box>

                        <Stack spacing={2}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" fontWeight={600}>
                              Paid Amount:
                            </Typography>
                            <Chip
                              icon={
                                <TrendingUp
                                  sx={{ color: "inherit !important" }}
                                />
                              }
                              label={`₹${member.paid}`}
                              sx={{
                                backgroundColor:
                                  index % 2 === 0 ? "#ffffff" : "#000000",
                                color: index % 2 === 0 ? "#000000" : "#ffffff",
                                fontWeight: 700,
                                borderRadius: 0,
                              }}
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" fontWeight={600}>
                              Owes Amount:
                            </Typography>
                            <Chip
                              icon={
                                <TrendingDown
                                  sx={{ color: "inherit !important" }}
                                />
                              }
                              label={`₹${member.owes}`}
                              sx={{
                                backgroundColor:
                                  index % 2 === 0 ? "#ffffff" : "#000000",
                                color: index % 2 === 0 ? "#000000" : "#ffffff",
                                fontWeight: 700,
                                borderRadius: 0,
                              }}
                            />
                          </Box>

                          <Divider
                            sx={{
                              my: 1,
                              borderColor:
                                index % 2 === 0 ? "#ffffff" : "#000000",
                              opacity: 0.5,
                            }}
                          />

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="h6" fontWeight={800}>
                              Net Balance:
                            </Typography>
                            <Typography
                              variant="h5"
                              fontWeight={900}
                              sx={{
                                color:
                                  parseFloat(member.net_balance) >= 0
                                    ? index % 2 === 0
                                      ? "#ffffff"
                                      : "#000000"
                                    : index % 2 === 0
                                    ? "#ffffff"
                                    : "#000000",
                              }}
                            >
                              ₹{member.net_balance}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Fade>

        {/* Action Buttons */}
        <Fade in timeout={1600}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 0,
              background: "#ffffff",
              border: "3px solid #000000",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={900}
              gutterBottom
              sx={{
                mb: 3,
                color: "#000000",
                textTransform: "uppercase",
                borderBottom: "2px solid #000000",
                paddingBottom: 1,
              }}
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
                startIcon={<AddCircle />}
                onClick={() => navigate(`/groups/${groupId}/add-expense`)}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 0,
                  fontWeight: 700,
                  borderColor: "#000000",
                  color: "#000000",
                  borderWidth: 2,
                  fontSize: "1.1rem",
                  "&:hover": {
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    borderColor: "#000000",
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Add New Expense
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Group />}
                onClick={() => navigate(`/groups/${groupId}/add-members`)}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 0,
                  fontWeight: 700,
                  borderColor: "#000000",
                  color: "#000000",
                  borderWidth: 2,
                  fontSize: "1.1rem",
                  "&:hover": {
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    borderColor: "#000000",
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Manage Members
              </Button>

              <Button
                variant="contained"
                size="large"
                startIcon={<Receipt />}
                onClick={() => navigate("/groups")}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 0,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background: "#000000",
                  color: "#ffffff",
                  border: "2px solid #000000",
                  "&:hover": {
                    background: "#ffffff",
                    color: "#000000",
                    border: "2px solid #000000",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                All Groups
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
