import { render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import Index from "../../app/index";

describe("AuthGate (app/index.tsx)", () => {
  test("redirects to /(app)/entries when user exists", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb({ uid: "123" });
      return () => {};
    });

    render(<Index />);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/(app)/entries");
    });
  });

  test("redirects to /(auth)/login when user is null", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb(null);
      return () => {};
    });

    render(<Index />);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/(auth)/login");
    });
  });
});
