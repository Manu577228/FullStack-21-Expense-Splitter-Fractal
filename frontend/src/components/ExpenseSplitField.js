/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import { Box, TextField, Typography, Avatar, InputAdornment } from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";

/* Every member gets their own gradient so rows are instantly recognisable */
const accents = [
  ["#14B8A6", "#3B82F6"],
  ["#8B5CF6", "#EC4899"],
  ["#F59E0B", "#F43F5E"],
  ["#10B981", "#06B6D4"],
  ["#6366F1", "#8B5CF6"],
];

export default function ExpenseSplitField({
  members,
  contributions,
  setContributions,
}) {
  const handleChange = (userId, value) => {
    setContributions(
      contributions.map((c) =>
        c.user === userId ? { ...c, amount: value } : c
      )
    );
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Section title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "13px",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            background: "linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%)",
            boxShadow:
              "0 10px 22px -8px rgba(99,102,241,0.7), inset 0 1px 0 rgba(255,255,255,0.35)",
          }}
        >
          <TuneRoundedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: "#0B1020", letterSpacing: "-0.2px" }}
        >
          Custom Split Amounts
        </Typography>
      </Box>

      {/* Member rows */}
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
              flexWrap: { xs: "wrap", sm: "nowrap" },
              mt: 1.5,
              py: 1.5,
              pr: 1.75,
              pl: 2.5,
              gap: 1.75,
              borderRadius: "18px",
              border: "1px solid rgba(15,23,42,0.07)",
              backgroundColor: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
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
              "&:hover, &:focus-within": {
                transform: "translateY(-2px)",
                boxShadow: `0 18px 34px -18px ${to}`,
              },
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                background: `linear-gradient(135deg, ${from}, ${to})`,
                boxShadow: `0 0 0 2px #fff, 0 0 0 3.5px ${from}`,
              }}
            >
              {(m.username || "").charAt(0)}
            </Avatar>
            <Typography
              sx={{
                minWidth: { xs: 0, sm: 150 },
                flexGrow: 1,
                fontWeight: 600,
                color: "#0B1020",
              }}
            >
              {m.username}
            </Typography>
            <TextField
              type="number"
              label="Amount"
              size="small"
              value={contributions.find((c) => c.user === m.id)?.amount || ""}
              onChange={(e) => handleChange(m.id, e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "9px",
                        display: "grid",
                        placeItems: "center",
                        color: "#fff",
                        background: `linear-gradient(135deg, ${from}, ${to})`,
                      }}
                    >
                      <PaymentsRoundedIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: "100%", sm: 190 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "rgba(241,245,249,0.8)",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: from },
                  "&.Mui-focused": {
                    backgroundColor: "#fff",
                    boxShadow: `0 0 0 4px ${from}22`,
                  },
                  "&.Mui-focused fieldset": { borderColor: from, borderWidth: 2 },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: from },
                "& input[type=number]": { MozAppearance: "textfield" },
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  { WebkitAppearance: "none", margin: 0 },
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}