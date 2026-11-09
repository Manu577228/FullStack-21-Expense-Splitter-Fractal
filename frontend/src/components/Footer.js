/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import { Box, Typography, Link } from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";

const display = "'Bricolage Grotesque', 'Inter', system-ui, sans-serif";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        px: 2,
        py: 1.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        columnGap: 1.75,
        rowGap: 0.75,
        color: "#475569",
        backgroundColor: "rgba(248,250,252,0.94)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(15,23,42,0.08)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          component="span"
          aria-hidden
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #14B8A6, #8B5CF6)",
          }}
        />
        <Typography
          variant="body2"
          sx={{
            fontFamily: display,
            fontWeight: 600,
            fontSize: "0.85rem",
            textAlign: "center",
          }}
        >
          © Bharadwaj — All Rights Reserved
        </Typography>
      </Box>

      <Link
        href="https://www.youtube.com/@code-with-Bharadwaj"
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.75,
          py: 0.5,
          borderRadius: "999px",
          color: "#fff",
          backgroundColor: "#0B1020",
          fontFamily: display,
          fontWeight: 700,
          fontSize: "0.85rem",
          transition: "background-color 0.2s ease",
          "&:hover": { backgroundColor: "#1E2A4A" },
          "&:focus-visible": { outline: "2px solid #3B82F6", outlineOffset: 3 },
        }}
      >
        <YouTubeIcon sx={{ fontSize: 18, color: "#FB7185" }} />
        Bharadwaj
      </Link>
    </Box>
  );
}