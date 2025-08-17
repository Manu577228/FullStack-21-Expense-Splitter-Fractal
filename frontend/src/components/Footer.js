/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ __ _ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        borderTop: "2px solid #fff",
        py: 1,
        px: 2,
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          whiteSpace: "nowrap",
          display: "inline-block",
          animation: "marquee 45s linear infinite", // slowed down
          "@keyframes marquee": {
            from: { transform: "translateX(-100%)" },
            to: { transform: "translateX(100vw)" },
          },
        }}
      >
        © 2025 — All Rights Reserved •{" "}
        <Link
          href="https://www.youtube.com/@code-with-Bharadwaj"
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{
            color: "#fff",
            fontWeight: 700,
            ml: 1,
            "&:hover": { color: "#ccc" },
          }}
        >
          Bharadwaj
        </Link>
      </Typography>
    </Box>
  );
}
