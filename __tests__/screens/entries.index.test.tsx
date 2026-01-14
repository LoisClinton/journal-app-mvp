import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import JournalListScreen from "../../app/(app)/entries/index";
import { listEntries } from "../../src/services/journalService";

jest.mock("../../src/firebase/firebaseConfig", () => ({
  auth: { currentUser: { uid: "uid-123" } },
}));

jest.mock("../../src/services/journalService", () => ({
  listEntries: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  signOut: jest.fn(),
}));

describe("Entries list screen", () => {
  test("loads entries on focus and renders them", async () => {
    (listEntries as jest.Mock).mockResolvedValueOnce([
      { id: "e1", title: "First entry", content: "Hello" },
    ]);

    const { getByText } = render(<JournalListScreen />);

    await waitFor(() => expect(listEntries).toHaveBeenCalled());
    await waitFor(() => expect(getByText("First entry")).toBeTruthy());
  });

  test("Add button navigates to new entry screen", async () => {
    (listEntries as jest.Mock).mockResolvedValueOnce([]);

    const { getByText } = render(<JournalListScreen />);

    await waitFor(() => expect(listEntries).toHaveBeenCalled());

    fireEvent.press(getByText("Add"));
    expect(router.push).toHaveBeenCalledWith("/(app)/entries/new");
  });

  test("Logout signs out and routes to /", async () => {
    (listEntries as jest.Mock).mockResolvedValueOnce([]);
    (signOut as jest.Mock).mockResolvedValueOnce({});

    const { getByText } = render(<JournalListScreen />);

    await waitFor(() => expect(listEntries).toHaveBeenCalled());

    fireEvent.press(getByText("Logout"));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });
});
