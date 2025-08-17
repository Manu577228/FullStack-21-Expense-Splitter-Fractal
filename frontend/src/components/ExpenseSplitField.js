/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import { Box, TextField, Typography } from "@mui/material";

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
      <Typography variant="subtitle1">Custom Split Amounts</Typography>
      {members.map((m) => (
        <Box key={m.id} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Typography sx={{ minWidth: 150 }}>{m.username}</Typography>
          <TextField
            type="number"
            label="Amount"
            value={contributions.find((c) => c.user === m.id)?.amount || ""}
            onChange={(e) => handleChange(m.id, e.target.value)}
          />
        </Box>
      ))}
    </Box>
  );
}
