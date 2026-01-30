import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import LoginScreen from "../../app/(auth)/login";

describe("Login screen", () => {
  test("signs in and redirects to /", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "  test@example.com  ");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");

    fireEvent.press(getByText("Log in"));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      const [_authArg, emailArg, passArg] = (
        signInWithEmailAndPassword as jest.Mock
      ).mock.calls[0];
      expect(emailArg).toBe("test@example.com");
      expect(passArg).toBe("password123");
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });

  test("navigates to register screen", () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("Create an account"));
    expect(router.push).toHaveBeenCalledWith("/(auth)/register");
  });
});
