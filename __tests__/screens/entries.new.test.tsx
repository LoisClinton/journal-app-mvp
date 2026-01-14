import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";
import { Alert } from "react-native";
import NewEntryScreen from "../../app/(app)/entries/new";
import { createEntry } from "../../src/services/journalService";

jest.mock("../../src/firebase/firebaseConfig", () => ({
  auth: { currentUser: { uid: "uid-123" } },
}));

jest.mock("../../src/services/journalService", () => ({
  createEntry: jest.fn(),
}));

describe("New entry screen", () => {
  beforeEach(() => {
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  test("shows alert if both title and content are empty/whitespace", async () => {
    const { getByText, getByPlaceholderText } = render(<NewEntryScreen />);

    fireEvent.changeText(getByPlaceholderText("Title"), "   ");
    fireEvent.changeText(getByPlaceholderText("Write something…"), "   ");
    fireEvent.press(getByText("Save"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Nothing to save",
        "Add a title or some content."
      );
    });

    expect(createEntry).not.toHaveBeenCalled();
  });

  test("creates entry with trimmed text then navigates home", async () => {
    (createEntry as jest.Mock).mockResolvedValueOnce({ id: "new-id" });

    const { getByText, getByPlaceholderText } = render(<NewEntryScreen />);

    fireEvent.changeText(getByPlaceholderText("Title"), "  My title  ");
    fireEvent.changeText(
      getByPlaceholderText("Write something…"),
      "  My content  "
    );
    fireEvent.press(getByText("Save"));

    await waitFor(() => {
      expect(createEntry).toHaveBeenCalledWith(
        "uid-123",
        "My title",
        "My content"
      );
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });
});
