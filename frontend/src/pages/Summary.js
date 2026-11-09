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
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Chip,
  IconButton,
  Avatar,
  Fade,
  Slide,
  Zoom,
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
  Refresh,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { apiFetch } from "../api";

/* ---------- Design tokens (UI only) ---------- */
const ui = {
  ink: "#0B1020",
  muted: "#64748B",
  line: "rgba(15,23,42,0.08)",
  teal: "#14B8A6",
  positive: "#047857",
  negative: "#BE123C",
  aurora: "linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%)",
};

const accents = [
  ["#14B8A6", "#3B82F6"],
  ["#8B5CF6", "#EC4899"],
  ["#F59E0B", "#F43F5E"],
  ["#10B981", "#06B6D4"],
  ["#6366F1", "#8B5CF6"],
];

/* ---------- Display helpers (UI only) ---------- */
// 12345.5 -> "12,345.5" (Indian digit grouping); falls back to the raw value
const money = (v) => {
  const n = Number(v);
  return Number.isFinite(n)
    ? n.toLocaleString("en-IN", { maximumFractionDigits: 2 })
    : String(v ?? 0);
};

// -250 -> "-₹250"
const signedMoney = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return `₹${v ?? 0}`;
  return `${n < 0 ? "-" : ""}₹${money(Math.abs(n))}`;
};

const balanceStatus = (net) => {
  if (net > 0.005) return { label: "Gets back", color: ui.positive, bg: "#ECFDF5" };
  if (net < -0.005) return { label: "Needs to pay", color: ui.negative, bg: "#FFF1F2" };
  return { label: "All settled", color: ui.muted, bg: "rgba(241,245,249,0.9)" };
};

const reduceMotion = {
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&:hover": { transform: "none" },
  },
};

const focusRing = {
  "&:focus-visible": {
    outline: "3px solid rgba(59,130,246,0.45)",
    outlineOffset: 3,
  },
};

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

const iconTile = (size = 48) => ({
  width: size,
  height: size,
  flexShrink: 0,
  borderRadius: "16px",
  display: "grid",
  placeItems: "center",
  color: "#fff",
  background: ui.aurora,
  boxShadow:
    "0 12px 24px -10px rgba(99,102,241,0.7), inset 0 1px 0 rgba(255,255,255,0.35)",
});

const ghostBtn = {
  py: 1.6,
  px: 3.5,
  borderRadius: "999px",
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
  ...focusRing,
  ...reduceMotion,
};

export default function Summary() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line
  }, [groupId]);

  const loadSummary = async () => {
    setError("");
    setLoading(true);
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

  /* ---------- Loading ---------- */
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
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            role="status"
            aria-live="polite"
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
            <Typography variant="h5" color={ui.ink} fontWeight={800} gutterBottom>
              Loading summary
            </Typography>
            <Typography variant="body1" sx={{ color: ui.muted }}>
              Calculating who paid what…
            </Typography>
          </Paper>
        </Fade>
      </Box>
    );

  /* ---------- Error ---------- */
  if (error)
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
        <Zoom in timeout={500}>
          <Paper
            elevation={0}
            sx={{
              ...cardSx,
              position: "relative",
              zIndex: 1,
              p: { xs: 4, sm: 5 },
              textAlign: "center",
              maxWidth: 500,
              width: "100%",
            }}
          >
            <Avatar
              sx={{
                width: 88,
                height: 88,
                mx: "auto",
                mb: 3,
                color: "#fff",
                background: "linear-gradient(135deg, #F43F5E, #F59E0B)",
                boxShadow: "0 20px 40px -16px rgba(244,63,94,0.7)",
              }}
            >
              <ErrorIcon sx={{ fontSize: 44 }} />
            </Avatar>
            <Alert
              variant="outlined"
              severity="error"
              icon={<ErrorIcon />}
              sx={{
                mb: 3,
                borderRadius: "16px",
                fontWeight: 600,
                alignItems: "center",
                textAlign: "left",
                color: "#9F1239",
                backgroundColor: "#FFF1F2",
                borderColor: "rgba(244,63,94,0.3)",
                "& .MuiAlert-icon": { color: "#F43F5E" },
              }}
            >
              {error}
            </Alert>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
              <Button
                variant="contained"
                disableElevation
                startIcon={<Refresh />}
                onClick={loadSummary}
                sx={{
                  py: 1.6,
                  px: 4,
                  borderRadius: "999px",
                  fontWeight: 800,
                  textTransform: "none",
                  color: "#fff",
                  background: ui.aurora,
                  boxShadow: "0 18px 34px -16px rgba(99,102,241,0.85)",
                  transition: "all 0.25s ease",
                  "&:hover": { transform: "translateY(-2px)", filter: "brightness(1.07)" },
                  ...focusRing,
                  ...reduceMotion,
                }}
              >
                Try again
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/groups")}
                sx={ghostBtn}
              >
                Back to groups
              </Button>
            </Stack>
          </Paper>
        </Zoom>
      </Box>
    );

  const balances = summaryData?.member_balances || [];
  const totalNum = Number(summaryData?.total_amount) || 0;
  const avgShare = balances.length ? totalNum / balances.length : 0;

  /* ---------- Main ---------- */
  return (
    <Box sx={{ ...pageSx, py: { xs: 3, sm: 4 } }}>
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, pb: 12 }}>
        {/* Header */}
        <Fade in timeout={600}>
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
              aria-label="Back to members"
              onClick={() => navigate(`/groups/${groupId}/add-members`)}
              sx={{
                mr: 1,
                background: ui.ink,
                color: "#fff",
                boxShadow: "0 14px 26px -10px rgba(11,16,32,0.6)",
                transition: "all 0.3s ease",
                "&:hover": { background: ui.aurora, transform: "translateX(-3px)" },
                ...focusRing,
                ...reduceMotion,
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                component="h1"
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: ui.ink,
                  letterSpacing: "-1.5px",
                  lineHeight: 1.1,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                }}
              >
                Expense summary
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: ui.muted,
                  fontWeight: 600,
                  mt: 0.5,
                  fontSize: "1.05rem",
                  wordBreak: "break-word",
                }}
              >
                {group?.name} • Financial overview
              </Typography>
            </Box>
            <Box sx={iconTile(52)}>
              <Analytics sx={{ fontSize: 26 }} />
            </Box>
          </Box>
        </Fade>

        {/* Total amount */}
        <Slide direction="up" in timeout={600}>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              p: { xs: 3, sm: 4 },
              mb: 4,
              borderRadius: "28px",
              color: "#fff",
              background: ui.ink,
              boxShadow: "0 24px 44px -22px rgba(11,16,32,0.8)",
              "&::after": {
                content: '""',
                position: "absolute",
                right: -60,
                top: -60,
                width: 260,
                height: 260,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.55), transparent 65%)",
                pointerEvents: "none",
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Box sx={iconTile(64)}>
                <AccountBalance sx={{ fontSize: 32 }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body1" fontWeight={600} sx={{ opacity: 0.75 }}>
                  Total group expenses
                </Typography>
                <Typography
                  variant="h2"
                  component="p"
                  fontWeight={800}
                  sx={{
                    letterSpacing: "-2px",
                    fontSize: { xs: "2.6rem", sm: "3.5rem" },
                    lineHeight: 1.1,
                    wordBreak: "break-word",
                  }}
                >
                  ₹{money(summaryData?.total_amount || 0)}
                </Typography>
              </Box>
            </Box>

            {balances.length > 0 && (
              <Stack
                direction="row"
                spacing={1.25}
                useFlexGap
                flexWrap="wrap"
                sx={{ position: "relative", zIndex: 1, mt: 3 }}
              >
                <Chip
                  label={`${balances.length} ${balances.length === 1 ? "member" : "members"}`}
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    backgroundColor: "rgba(255,255,255,0.12)",
                  }}
                />
                <Chip
                  label={`₹${money(avgShare)} average share`}
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    backgroundColor: "rgba(255,255,255,0.12)",
                  }}
                />
              </Stack>
            )}
          </Box>
        </Slide>

        {/* Member balances */}
        <Fade in timeout={700}>
          <Card elevation={0} sx={{ ...cardSx, mb: 4 }}>
            <CardHeader
              sx={{ p: 3, pb: 2 }}
              avatar={
                <Box sx={iconTile(52)}>
                  <Group sx={{ fontSize: 26 }} />
                </Box>
              }
              title={
                <Typography
                  component="h2"
                  variant="h5"
                  fontWeight={800}
                  color={ui.ink}
                  sx={{ letterSpacing: "-0.5px" }}
                >
                  Member balances
                </Typography>
              }
              subheader={
                <Typography variant="body2" sx={{ color: ui.muted }}>
                  What each person paid, owes and is left with
                </Typography>
              }
            />

            <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
              {balances.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 5 }}>
                  <Typography variant="h6" sx={{ color: ui.ink, fontWeight: 700 }} gutterBottom>
                    No balances yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: ui.muted, mb: 2.5 }}>
                    Add an expense to see who owes what
                  </Typography>
                  <Button
                    variant="contained"
                    disableElevation
                    startIcon={<AddCircle />}
                    onClick={() => navigate(`/groups/${groupId}/add-expense`)}
                    sx={{
                      py: 1.3,
                      px: 3.5,
                      borderRadius: "999px",
                      fontWeight: 800,
                      textTransform: "none",
                      color: "#fff",
                      background: ui.aurora,
                      boxShadow: "0 18px 34px -16px rgba(99,102,241,0.85)",
                      ...focusRing,
                    }}
                  >
                    Add expense
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2.5}>
                  {balances.map((member, index) => {
                    const [from, to] = accents[index % accents.length];
                    const net = parseFloat(member.net_balance);
                    const status = balanceStatus(net);

                    return (
                      <Grid item xs={12} sm={6} key={member.id}>
                        <Fade
                          in
                          timeout={500}
                          style={{ transitionDelay: `${Math.min(index, 8) * 70}ms` }}
                        >
                          <Card
                            elevation={0}
                            sx={{
                              position: "relative",
                              overflow: "hidden",
                              height: "100%",
                              borderRadius: "22px",
                              backgroundColor: "#fff",
                              border: `1px solid ${ui.line}`,
                              transition: "transform 0.25s ease, box-shadow 0.25s ease",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: 5,
                                background: `linear-gradient(180deg, ${from}, ${to})`,
                              },
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: `0 18px 34px -20px ${to}`,
                              },
                              ...reduceMotion,
                            }}
                          >
                            <CardContent sx={{ p: 3, pl: 3.5 }}>
                              <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
                                <Avatar
                                  sx={{
                                    background: `linear-gradient(135deg, ${from}, ${to})`,
                                    width: 48,
                                    height: 48,
                                    mr: 2,
                                    fontWeight: 800,
                                    color: "#fff",
                                    boxShadow: `0 0 0 2px #fff, 0 0 0 3.5px ${from}`,
                                  }}
                                >
                                  {member.username.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography
                                  variant="h6"
                                  fontWeight={700}
                                  color={ui.ink}
                                  sx={{ fontSize: "1.1rem", wordBreak: "break-word" }}
                                >
                                  {member.username}
                                </Typography>
                              </Box>

                              <Stack spacing={1.5}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography variant="body2" fontWeight={600} sx={{ color: ui.muted }}>
                                    Paid
                                  </Typography>
                                  <Chip
                                    icon={<TrendingUp sx={{ color: "#047857 !important" }} />}
                                    label={`₹${money(member.paid)}`}
                                    size="small"
                                    sx={{
                                      backgroundColor: "#ECFDF5",
                                      color: "#065F46",
                                      fontWeight: 800,
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
                                  <Typography variant="body2" fontWeight={600} sx={{ color: ui.muted }}>
                                    Owes
                                  </Typography>
                                  <Chip
                                    icon={<TrendingDown sx={{ color: "#BE123C !important" }} />}
                                    label={`₹${money(member.owes)}`}
                                    size="small"
                                    sx={{
                                      backgroundColor: "#FFF1F2",
                                      color: "#9F1239",
                                      fontWeight: 800,
                                    }}
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    mt: 0.5,
                                    p: 1.75,
                                    borderRadius: "16px",
                                    backgroundColor: "rgba(241,245,249,0.8)",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography variant="body1" fontWeight={700} color={ui.ink}>
                                      Net balance
                                    </Typography>
                                    <Typography
                                      variant="h6"
                                      fontWeight={800}
                                      sx={{
                                        letterSpacing: "-0.5px",
                                        color: status.color,
                                      }}
                                    >
                                      {signedMoney(member.net_balance)}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={status.label}
                                    size="small"
                                    sx={{
                                      mt: 1,
                                      fontWeight: 800,
                                      color: status.color,
                                      backgroundColor: status.bg,
                                    }}
                                  />
                                </Box>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Fade>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Fade>

        {/* Quick actions */}
        <Fade in timeout={800}>
          <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, sm: 4 } }}>
            <Typography
              component="h2"
              variant="h6"
              fontWeight={800}
              gutterBottom
              sx={{ mb: 3, color: ui.ink, letterSpacing: "-0.3px" }}
            >
              Quick actions
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2.5}
              justifyContent="center"
            >
              <Button
                variant="outlined"
                size="large"
                startIcon={<AddCircle />}
                onClick={() => navigate(`/groups/${groupId}/add-expense`)}
                sx={ghostBtn}
              >
                Add expense
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Group />}
                onClick={() => navigate(`/groups/${groupId}/add-members`)}
                sx={ghostBtn}
              >
                Manage members
              </Button>

              <Button
                variant="contained"
                size="large"
                disableElevation
                startIcon={<Receipt />}
                onClick={() => navigate("/groups")}
                sx={{
                  py: 1.6,
                  px: 4,
                  borderRadius: "999px",
                  fontWeight: 800,
                  textTransform: "none",
                  color: "#fff",
                  background: ui.aurora,
                  boxShadow: "0 22px 40px -16px rgba(99,102,241,0.85)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    filter: "brightness(1.07)",
                  },
                  ...focusRing,
                  ...reduceMotion,
                }}
              >
                All groups
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}

