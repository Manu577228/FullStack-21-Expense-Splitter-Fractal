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

const INK = "#0B1020";
const MUTED = "#64748B";
const LINE = "rgba(15,23,42,0.09)";
const display = "'Bricolage Grotesque', 'Inter', system-ui, sans-serif";

/* Every member gets their own gradient so rows are instantly recognisable */
const accents = [
  ["#14B8A6", "#3B82F6"],
  ["#8B5CF6", "#EC4899"],
  ["#F59E0B", "#F43F5E"],
  ["#10B981", "#06B6D4"],
  ["#6366F1", "#8B5CF6"],
];

/* Ticket geometry: a stub on the left, a perforated tear line, then the body */
const STUB = 76;
const ticketMask = `radial-gradient(circle 9px at ${STUB}px 0, #0000 97%, #000), radial-gradient(circle 9px at ${STUB}px 100%, #0000 97%, #000)`;

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

  /* Read-only numbers used only to draw the split bar and the share labels */
  const amountOf = (id) =>
    Math.max(
      0,
      parseFloat(contributions.find((c) => c.user === id)?.amount) || 0
    );
  const total = members.reduce((sum, m) => sum + amountOf(m.id), 0);
  const shareOf = (id) =>
    total > 0 ? Math.round((amountOf(id) / total) * 100) : 0;
  const totalLabel = total.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });

  return (
    <Box sx={{ mt: 3 }}>
      {/* Section title + running total */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            flexShrink: 0,
            borderRadius: "13px",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            background:
              "linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%)",
            boxShadow:
              "0 10px 22px -8px rgba(99,102,241,0.7), inset 0 1px 0 rgba(255,255,255,0.35)",
          }}
        >
          <TuneRoundedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography
          variant="subtitle1"
          sx={{
            flexGrow: 1,
            fontFamily: display,
            fontWeight: 800,
            fontSize: "1.1rem",
            letterSpacing: "-0.025em",
            color: INK,
          }}
        >
          Custom Split Amounts
        </Typography>
        <Box sx={{ textAlign: "right" }}>
          <Typography
            sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED, lineHeight: 1.2 }}
          >
            Total
          </Typography>
          <Typography
            sx={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: "1.3rem",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
              color: INK,
            }}
          >
            {totalLabel}
          </Typography>
        </Box>
      </Box>

      {/* Split bar: one segment per member, sized by their share */}
      <Box
        role="img"
        aria-label="Share of each member in the split"
        sx={{
          display: "flex",
          gap: "3px",
          height: 12,
          mt: 2,
          borderRadius: "999px",
          overflow: "hidden",
          backgroundColor: "rgba(15,23,42,0.05)",
          backgroundImage:
            total === 0
              ? "repeating-linear-gradient(135deg, rgba(15,23,42,0.07) 0 6px, transparent 6px 12px)"
              : "none",
        }}
      >
        {members.map((m, index) => {
          const amt = amountOf(m.id);
          if (amt <= 0) return null;
          const [from, to] = accents[index % accents.length];
          return (
            <Box
              key={m.id}
              sx={{
                flexGrow: amt,
                flexBasis: 0,
                minWidth: 0,
                borderRadius: "999px",
                background: `linear-gradient(90deg, ${from}, ${to})`,
                transition: "flex-grow 0.55s cubic-bezier(.65,0,.35,1)",
              }}
            />
          );
        })}
      </Box>

      {/* Member tickets */}
      {members.map((m, index) => {
        const [from, to] = accents[index % accents.length];
        const pct = shareOf(m.id);
        return (
          <Box
            key={m.id}
            sx={{
              mt: 1.5,
              filter: "drop-shadow(0 1px 1px rgba(15,23,42,0.07))",
              transition: "transform 0.25s ease, filter 0.25s ease",
              "&:hover, &:focus-within": {
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
                border: `1px solid ${LINE}`,
                backgroundColor: "rgba(255,255,255,0.94)",
                WebkitMask: ticketMask,
                WebkitMaskComposite: "source-in",
                mask: ticketMask,
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
                  background: `linear-gradient(135deg, ${from}1F, ${to}1F)`,
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    fontFamily: display,
                    fontSize: "1rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    background: `linear-gradient(135deg, ${from}, ${to})`,
                    boxShadow: `0 0 0 2px #fff, 0 0 0 3.5px ${from}`,
                  }}
                >
                  {(m.username || "").charAt(0)}
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
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  flexGrow: 1,
                  minWidth: 0,
                  gap: { xs: 1, sm: 1.75 },
                  py: 1.5,
                  pl: 2.5,
                  pr: 1.75,
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    flexGrow: { xs: 1, sm: 0 },
                    minWidth: 0,
                    fontFamily: display,
                    fontWeight: 700,
                    fontSize: "1.02rem",
                    letterSpacing: "-0.015em",
                    color: INK,
                  }}
                >
                  {m.username}
                </Typography>

                {/* Receipt-style dotted leader */}
                <Box
                  aria-hidden
                  sx={{
                    display: { xs: "none", sm: "block" },
                    flexGrow: 1,
                    minWidth: 16,
                    alignSelf: "center",
                    mt: "6px",
                    borderBottom: "2px dotted rgba(15,23,42,0.18)",
                  }}
                />

                <Typography
                  sx={{
                    width: 44,
                    textAlign: "right",
                    fontFamily: display,
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    fontVariantNumeric: "tabular-nums",
                    color: pct > 0 ? INK : "#94A3B8",
                    transition: "color 0.25s ease",
                  }}
                >
                  {pct}%
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
                      backgroundColor: "rgba(15,23,42,0.045)",
                      fontFamily: display,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                      transition:
                        "background-color 0.2s ease, box-shadow 0.2s ease",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: `${from}88` },
                      "&.Mui-focused": {
                        backgroundColor: "#fff",
                        boxShadow: `0 0 0 4px ${from}26`,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: from,
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: display,
                      fontWeight: 600,
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: INK },
                    "& input[type=number]": { MozAppearance: "textfield" },
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      { WebkitAppearance: "none", margin: 0 },
                  }}
                />
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}