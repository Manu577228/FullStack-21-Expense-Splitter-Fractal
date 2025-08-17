import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ExpenseSplitField from "./ExpenseSplitField";
import '@testing-library/jest-dom';

describe("ExpenseSplitField Component", () => {
  let members, contributions, setContributionsMock;

  beforeEach(() => {
    members = [
      { id: 1, username: "Alice" },
      { id: 2, username: "Bob" },
    ];
    contributions = [
      { user: 1, amount: 100 },
      { user: 2, amount: 50 },
    ];
    setContributionsMock = jest.fn();
  });

  it("renders all member fields with correct values", () => {
    render(
      <ExpenseSplitField
        members={members}
        contributions={contributions}
        setContributions={setContributionsMock}
      />
    );

    // Check usernames rendered
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();

    // Get all inputs with label "Amount"
    const inputs = screen.getAllByLabelText("Amount", { selector: 'input' });

    // Check initial input values
    expect(inputs[0]).toHaveValue(100); // Alice
    expect(inputs[1]).toHaveValue(50);  // Bob
  });

  it("calls setContributions when input changes", () => {
    render(
      <ExpenseSplitField
        members={members}
        contributions={contributions}
        setContributions={setContributionsMock}
      />
    );

    const inputs = screen.getAllByLabelText("Amount", { selector: 'input' });

    // Change Alice's input
    fireEvent.change(inputs[0], { target: { value: "200" } });

    expect(setContributionsMock).toHaveBeenCalledWith([
      { user: 1, amount: "200" },
      { user: 2, amount: 50 },
    ]);
  });
});
