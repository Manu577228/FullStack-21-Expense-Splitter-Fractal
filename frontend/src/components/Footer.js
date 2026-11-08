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

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "transparent",
        color: "#64748B",
        py: 1.5,
        px: 2,
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        pointerEvents: "none", // never blocks clicks on the page underneath
      }}
    >
      {/* Edge-fade so the scrolling text glides in and out softly */}
      <Box
        sx={{
          overflow: "hidden",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
          maskImage:
            "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            letterSpacing: "0.2px",
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
            animation: "marquee 45s linear infinite", // slowed down
            "@keyframes marquee": {
              from: { transform: "translateX(-100%)" },
              to: { transform: "translateX(100vw)" },
            },
          }}
        >
          {/* Pulsing live dot */}
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              mr: 1.5,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #14B8A6, #8B5CF6)",
              boxShadow: "0 0 0 0 rgba(20,184,166,0.6)",
              animation: "dotPulse 2s ease-out infinite",
              "@keyframes dotPulse": {
                "0%": { boxShadow: "0 0 0 0 rgba(20,184,166,0.55)" },
                "100%": { boxShadow: "0 0 0 10px rgba(20,184,166,0)" },
              },
            }}
          />
          © Bharadwaj — All Rights Reserved •{" "}
          <Link
            href="https://www.youtube.com/@code-with-Bharadwaj"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{
              pointerEvents: "auto",
              position: "relative",
              overflow: "hidden",
              display: "inline-flex",
              alignItems: "center",
              color: "#fff",
              fontWeight: 700,
              ml: 1.5,
              px: 1.75,
              py: 0.5,
              borderRadius: "999px",
              "@keyframes ringSpin": {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" },
              },
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-150%",
                background:
                  "conic-gradient(from 0deg, #14B8A6, #3B82F6, #8B5CF6, #F43F5E, #F59E0B, #14B8A6)",
                animation: "ringSpin 4s linear infinite",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                inset: "1.5px",
                borderRadius: "inherit",
                backgroundColor: "#0B1020",
                transition: "background-color 0.3s ease",
              },
              "&:hover::after": { backgroundColor: "#151B33" },
            }}
          >
            <Box
              component="span"
              sx={{
                position: "relative",
                zIndex: 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <YouTubeIcon sx={{ fontSize: 18, color: "#FB7185" }} />
              Bharadwaj
            </Box>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}