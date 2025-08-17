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
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { apiFetch } from "../api";

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
      <Container maxWidth="sm" sx={{ mt: 6, textAlign: "center", pb: 10 }}>
        <Box
          sx={{
            minHeight: "80vh",
            background:
              "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 0,
            p: 4,
          }}
        >
          <Paper
            sx={{
              p: 4,
              background: "#ffffff",
              border: "3px solid #000000",
              borderRadius: 0,
              textAlign: "center",
            }}
          >
            <CircularProgress sx={{ color: "#000000", mb: 2 }} />
            <Typography sx={{ mt: 2, color: "#000000", fontWeight: 700 }}>
              Loading group...
            </Typography>
          </Paper>
        </Box>
      </Container>
    );

  if (!group || members.length < 2)
    return (
      <Container maxWidth="sm" sx={{ mt: 6, pb: 10 }}>
        <Box
          sx={{
            minHeight: "80vh",
            background:
              "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Paper
            sx={{
              p: 4,
              background: "#ffffff",
              border: "3px solid #000000",
              borderRadius: 0,
              textAlign: "center",
            }}
          >
            <Alert
              severity="warning"
              sx={{
                mb: 2,
                backgroundColor: "#fff3cd",
                color: "#000000",
                border: "2px solid #000000",
                borderRadius: 0,
                "& .MuiAlert-icon": { color: "#000000" },
              }}
            >
              Need at least 2 members to add expenses.
            </Alert>
            <Button
              onClick={() => navigate(`/groups/${groupId}/add-members`)}
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
              Back
            </Button>
          </Paper>
        </Box>
      </Container>
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
      <Container maxWidth="sm" sx={{ pb: 10 }}>
        <Paper
          elevation={20}
          sx={{
            p: 3,
            mb: 4,
            background: "#ffffff",
            border: "3px solid #000000",
            borderRadius: 0,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton
              onClick={() => navigate(`/groups/${groupId}/add-members`)}
              sx={{
                mr: 1,
                background: "#000000",
                color: "#ffffff",
                border: "2px solid #000000",
                "&:hover": {
                  background: "#ffffff",
                  color: "#000000",
                  border: "2px solid #000000",
                },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: "#000000",
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                }}
              >
                Add Expense
              </Typography>
              <Typography variant="h6" color="#666666" fontWeight={600}>
                {group?.name}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
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
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "2px solid #000000",
              borderRadius: 0,
              "& .MuiAlert-icon": { color: "#ffffff" },
              fontWeight: 600,
            }}
          >
            {success}
          </Alert>
        )}

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
            variant="h5"
            sx={{
              fontWeight: 900,
              mb: 3,
              color: "#000000",
              textTransform: "uppercase",
              borderBottom: "3px solid #000000",
              paddingBottom: 1,
            }}
          >
            Expense Details
          </Typography>

          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter expense description"
            sx={{ mb: 3 }}
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
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <TextField
            select
            label="Paid By"
            fullWidth
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            sx={{ mb: 3 }}
          >
            {members.map((m) => (
              <MenuItem key={m.id} value={m.username}>
                {m.username}
              </MenuItem>
            ))}
          </TextField>

          <Divider sx={{ my: 3, borderColor: "#000000", borderWidth: "2px" }} />

          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 900,
              color: "#000000",
              textTransform: "uppercase",
            }}
          >
            Split Type
          </Typography>

          <ToggleButtonGroup
            value={splitType}
            exclusive
            onChange={(e, v) => v && setSplitType(v)}
            fullWidth
            sx={{ mb: 3 }}
          >
            <ToggleButton value="equal">Equal Split</ToggleButton>
            <ToggleButton value="custom">Custom Split</ToggleButton>
          </ToggleButtonGroup>

          {splitType === "custom" && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  color: "#000000",
                  textTransform: "uppercase",
                }}
              >
                Custom Amounts
              </Typography>
              {members.map((m) => (
                <TextField
                  key={m.id}
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
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                  fullWidth
                />
              ))}
            </Box>
          )}

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleAddExpense}
              disabled={submitting}
              fullWidth
              sx={{
                py: 2.5,
                borderRadius: 0,
                fontSize: "1.2rem",
                fontWeight: 900,
                background: "#000000",
                color: "#ffffff",
                "&:hover": {
                  background: "#ffffff",
                  color: "#000000",
                  border: "2px solid #000000",
                },
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
