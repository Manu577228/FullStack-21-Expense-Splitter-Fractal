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
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Paper,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  IconButton,
  Divider,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { apiFetch } from "../api";

/* ---------- Design tokens (UI only) ---------- */
const ui = {
  ink: "#0B1020",
  muted: "#64748B",
  line: "rgba(15,23,42,0.08)",
  teal: "#14B8A6",
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
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
};

const rupeeChip = {
  width: 26,
  height: 26,
  borderRadius: "9px",
  display: "grid",
  placeItems: "center",
  color: "#fff",
  fontWeight: 800,
  fontSize: "0.9rem",
  background: ui.aurora,
};

const iconTile = (size = 38) => ({
  width: size,
  height: size,
  borderRadius: "13px",
  display: "grid",
  placeItems: "center",
  color: "#fff",
  background: ui.aurora,
  boxShadow:
    "0 10px 22px -8px rgba(99,102,241,0.7), inset 0 1px 0 rgba(255,255,255,0.35)",
});

const alertBase = {
  mb: 2,
  borderRadius: "16px",
  fontWeight: 600,
  alignItems: "center",
};

function SectionTitle({ icon, children }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
      <Box sx={iconTile()}>{icon}</Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: 800, color: ui.ink, letterSpacing: "-0.5px", fontSize: "1.4rem" }}
      >
        {children}
      </Typography>
    </Box>
  );
}

export default function AddExpense() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [customSplits, setCustomSplits] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  const loadGroupData = async () => {
    try {
      const gRes = await apiFetch(`/api/groups/${groupId}/`);
      if (!gRes?.ok) throw new Error("Failed to load group");
      setGroup(await gRes.json());

      const mRes = await apiFetch(`/api/groups/${groupId}/members/`);
      if (!mRes?.ok) throw new Error("Failed to load members");
      const mData = await mRes.json();
      setMembers(mData.members);

      if (mData.members.length > 0) {
        setPaidBy(mData.members[0].username);
        const splits = {};
        mData.members.forEach((m) => (splits[m.username] = ""));
        setCustomSplits(splits);
      }
    } catch (err) {
      setError("Error loading group data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!description.trim() || !amount || !paidBy) {
      setError("Please fill all fields");
      return;
    }
    if (parseFloat(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    if (splitType === "custom") {
      for (let key in customSplits) {
        if (parseFloat(customSplits[key] || 0) < 0) {
          setError("Custom split amounts cannot be negative");
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/groups/${groupId}/add-expense/`, {
        method: "POST",
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          paid_by_username: paidBy,
          split_type: splitType,
          custom_splits: splitType === "custom" ? customSplits : {},
        }),
      });
      const data = await res.json();
      if (res?.ok) {
        setSuccess("Expense added!");
        setTimeout(() => navigate(`/summary/${groupId}`), 1200);
      } else {
        setError(data.error || "Failed to add expense");
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <Box sx={pageSx}>
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, mt: 6, textAlign: "center", pb: 10 }}>
          <Box
            sx={{
              minHeight: "70vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paper
              elevation={0}
              sx={{ ...cardSx, p: 5, textAlign: "center", minWidth: 260 }}
            >
              <CircularProgress size={46} thickness={4} sx={{ color: ui.teal, mb: 2 }} />
              <Typography sx={{ mt: 2, color: ui.ink, fontWeight: 700 }}>
                Loading group...
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>
    );

  if (!group || members.length < 2)
    return (
      <Box sx={pageSx}>
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, mt: 6, pb: 10 }}>
          <Box
            sx={{
              minHeight: "70vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paper elevation={0} sx={{ ...cardSx, p: 4, textAlign: "center" }}>
              <Alert
                severity="warning"
                sx={{
                  ...alertBase,
                  backgroundColor: "#FFFBEB",
                  color: "#92400E",
                  border: "1px solid rgba(245,158,11,0.35)",
                  "& .MuiAlert-icon": { color: "#F59E0B" },
                }}
              >
                Need at least 2 members to add expenses.
              </Alert>
              <Button
                onClick={() => navigate(`/groups/${groupId}/add-members`)}
                startIcon={<ArrowBackRoundedIcon />}
                sx={{
                  background: ui.ink,
                  color: "#fff",
                  borderRadius: "999px",
                  px: 3.5,
                  py: 1.1,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "0 14px 26px -12px rgba(11,16,32,0.7)",
                  "&:hover": { background: ui.aurora },
                }}
              >
                Back
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>
    );

  return (
    <Box sx={{ ...pageSx, py: { xs: 3, sm: 4 } }}>
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, pb: 12 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton
            aria-label="Back"
            onClick={() => navigate(`/groups/${groupId}/add-members`)}
            sx={{
              background: ui.ink,
              color: "#fff",
              boxShadow: "0 14px 26px -10px rgba(11,16,32,0.6)",
              transition: "all 0.3s ease",
              "&:hover": { background: ui.aurora, transform: "translateX(-3px)" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: ui.ink,
                letterSpacing: "-1.2px",
                lineHeight: 1.1,
                fontSize: { xs: "1.9rem", sm: "2.4rem" },
              }}
            >
              Add Expense
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                mt: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: "999px",
                backgroundColor: "rgba(20,184,166,0.12)",
                color: "#0F766E",
              }}
            >
              <GroupsRoundedIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" fontWeight={700}>
                {group?.name}
              </Typography>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              ...alertBase,
              backgroundColor: "#FFF1F2",
              color: "#9F1239",
              border: "1px solid rgba(244,63,94,0.3)",
              "& .MuiAlert-icon": { color: "#F43F5E" },
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              ...alertBase,
              backgroundColor: "#ECFDF5",
              color: "#065F46",
              border: "1px solid rgba(16,185,129,0.35)",
              "& .MuiAlert-icon": { color: "#10B981" },
            }}
          >
            {success}
          </Alert>
        )}

        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, sm: 4 } }}>
          <SectionTitle icon={<ReceiptLongRoundedIcon sx={{ fontSize: 20 }} />}>
            Expense Details
          </SectionTitle>

          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter expense description"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NotesRoundedIcon sx={{ color: ui.teal }} />
                </InputAdornment>
              ),
            }}
            sx={{ ...fieldSx, mb: 3 }}
          />

          <TextField
            label="Amount"
            fullWidth
            type="number"
            placeholder="Enter amount in ₹"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={rupeeChip}>₹</Box>
                </InputAdornment>
              ),
            }}
            sx={{ ...fieldSx, mb: 3 }}
          />

          <TextField
            select
            label="Paid By"
            fullWidth
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonRoundedIcon sx={{ color: ui.teal }} />
                </InputAdornment>
              ),
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    mt: 1,
                    borderRadius: "16px",
                    border: `1px solid ${ui.line}`,
                    boxShadow: "0 24px 50px -20px rgba(15,23,42,0.35)",
                    "& .MuiMenuItem-root": { borderRadius: "10px", mx: 0.75, fontWeight: 600 },
                  },
                },
              },
            }}
            sx={{ ...fieldSx, mb: 3 }}
          >
            {members.map((m) => (
              <MenuItem key={m.id} value={m.username}>
                {m.username}
              </MenuItem>
            ))}
          </TextField>

          <Divider
            sx={{
              my: 3.5,
              border: 0,
              height: 2,
              borderRadius: 2,
              background:
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.35), transparent)",
            }}
          />

          <SectionTitle icon={<TuneRoundedIcon sx={{ fontSize: 20 }} />}>
            Split Type
          </SectionTitle>

          <ToggleButtonGroup
            value={splitType}
            exclusive
            onChange={(e, v) => v && setSplitType(v)}
            fullWidth
            sx={{
              mb: 3,
              p: 0.5,
              borderRadius: "999px",
              backgroundColor: "rgba(15,23,42,0.06)",
              "& .MuiToggleButtonGroup-grouped": {
                border: 0,
                m: 0,
                py: 1.2,
                gap: 1,
                color: ui.muted,
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "999px !important",
                transition: "all 0.25s ease",
                "&.Mui-selected": {
                  color: "#fff",
                  background: ui.ink,
                  boxShadow: "0 12px 22px -10px rgba(11,16,32,0.7)",
                },
                "&.Mui-selected:hover": { background: ui.ink },
              },
            }}
          >
            <ToggleButton value="equal">
              <PeopleAltRoundedIcon sx={{ fontSize: 20 }} />
              Equal Split
            </ToggleButton>
            <ToggleButton value="custom">
              <TuneRoundedIcon sx={{ fontSize: 20 }} />
              Custom Split
            </ToggleButton>
          </ToggleButtonGroup>

          {splitType === "custom" && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: 800, color: ui.ink, letterSpacing: "-0.2px" }}
              >
                Custom Amounts
              </Typography>
              {members.map((m, index) => {
                const [from, to] = accents[index % accents.length];
                return (
                  <Box
                    key={m.id}
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2,
                      py: 1.5,
                      pr: 1.5,
                      pl: 2.5,
                      borderRadius: "18px",
                      border: `1px solid ${ui.line}`,
                      backgroundColor: "#fff",
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
                      "&:focus-within": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 18px 34px -18px ${to}`,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 38,
                        height: 38,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        background: `linear-gradient(135deg, ${from}, ${to})`,
                        boxShadow: `0 0 0 2px #fff, 0 0 0 3.5px ${from}`,
                      }}
                    >
                      {(m.username || "").charAt(0)}
                    </Avatar>
                    <TextField
                      label={`Share for ${m.username} (₹)`}
                      type="number"
                      value={customSplits[m.username] || ""}
                      onChange={(e) =>
                        setCustomSplits({
                          ...customSplits,
                          [m.username]: e.target.value,
                        })
                      }
                      placeholder="Enter amount in ₹"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              sx={{
                                ...rupeeChip,
                                background: `linear-gradient(135deg, ${from}, ${to})`,
                              }}
                            >
                              ₹
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                      fullWidth
                    />
                  </Box>
                );
              })}
            </Box>
          )}

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleAddExpense}
              disabled={submitting}
              fullWidth
              disableElevation
              startIcon={
                submitting ? (
                  <CircularProgress size={20} thickness={5} sx={{ color: "#fff" }} />
                ) : (
                  <AddRoundedIcon />
                )
              }
              sx={{
                py: 2,
                borderRadius: "999px",
                fontSize: "1.1rem",
                fontWeight: 800,
                textTransform: "none",
                letterSpacing: "-0.2px",
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
                "&.Mui-disabled": { color: "#fff", opacity: 0.75, background: ui.aurora },
              }}
            >
              {submitting ? "Adding..." : "Add Expense"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}