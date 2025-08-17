/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import React, { useContext } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppProvider, AppContext } from "../context/AppContext"; // corrected path

// Test component to consume context
const TestComponent = () => {
  const { user, groups, isAuthenticated, login, logout, loading } =
    useContext(AppContext);

  return (
    <div>
      <span data-testid="user">{user ? user.name : "null"}</span>
      <span data-testid="groups">{groups.length}</span>
      <span data-testid="auth">{isAuthenticated ? "true" : "false"}</span>
      <span data-testid="loading">{loading ? "true" : "false"}</span>
      <button onClick={() => login({ name: "John" }, "token123")}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AppContext in AddMembers page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("default values", () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("groups").textContent).toBe("0");
    expect(screen.getByTestId("auth").textContent).toBe("false");
    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  test("login updates state and localStorage", async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    await userEvent.click(screen.getByText("Login"));

    expect(screen.getByTestId("user").textContent).toBe("John");
    expect(screen.getByTestId("auth").textContent).toBe("true");
    expect(localStorage.getItem("token")).toBe("token123");
    expect(JSON.parse(localStorage.getItem("user")).name).toBe("John");
  });

  test("logout clears state and localStorage", async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    await userEvent.click(screen.getByText("Login"));
    await userEvent.click(screen.getByText("Logout"));

    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("groups").textContent).toBe("0");
    expect(screen.getByTestId("auth").textContent).toBe("false");
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  test("initializes state from localStorage", () => {
    localStorage.setItem("token", "tokenXYZ");
    localStorage.setItem("user", JSON.stringify({ name: "Alice" }));

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId("user").textContent).toBe("Alice");
    expect(screen.getByTestId("auth").textContent).toBe("true");
  });
});
