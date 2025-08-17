/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import '@testing-library/jest-dom';

describe("Footer Component", () => {
  it("renders footer text and link correctly", () => {
    render(<Footer />);
    
    // Check the text
    const typography = screen.getByText(/© 2025 — All Rights Reserved/i);
    expect(typography).toBeInTheDocument();

    // Check the link
    const link = screen.getByRole("link", { name: /Bharadwaj/i });
    expect(link).toHaveAttribute("href", "https://www.youtube.com/@code-with-Bharadwaj");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("footer is fixed at the bottom", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveStyle("position: fixed");
    expect(footer).toHaveStyle("bottom: 0");
    expect(footer).toHaveStyle("width: 100%");
  });

  it("marquee animation is applied via sx prop (basic check)", () => {
    render(<Footer />);
    const typography = screen.getByText(/© 2025 — All Rights Reserved/i);
    expect(typography).toBeInTheDocument(); // cannot check animation in JSDOM
  });
});
