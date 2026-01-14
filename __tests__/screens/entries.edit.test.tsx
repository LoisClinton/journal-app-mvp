import { render, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import EditEntryScreen from "../../app/(app)/entries/[id]";
import { getEntry } from "../../src/services/journalService";

jest.mock("../../src/firebase/firebaseConfig", () => ({
  auth: { currentUser: { uid: "uid-123" } },
}));

jest.mock("../../src/services/journalService", () => ({
  getEntry: jest.fn(),
  updateEntry: jest.fn(),
  removeEntry: jest.fn(),
}));

describe("Edit entry screen", () => {
  beforeEach(() => {
    (useLocalSearchParams as unknown as jest.Mock).mockReturnValue({
      id: "e1",
    });
  });

  test("loads entry and populates fields", async () => {
    (getEntry as jest.Mock).mockResolvedValueOnce({
      id: "e1",
      title: "Loaded title",
      content: "Loaded content",
    });

    const { getByPlaceholderText, queryByText } = render(<EditEntryScreen />);

    // wait for the loading text to disappear
    await waitFor(() => expect(queryByText("Loading…")).toBeNull()); // note the ellipsis char

    // assert the TextInput values via props
    expect(getByPlaceholderText("Title").props.value).toBe("Loaded title");
    expect(getByPlaceholderText("Write something…").props.value).toBe(
      "Loaded content"
    );

    expect(getEntry).toHaveBeenCalledWith("uid-123", "e1");
  });
});
