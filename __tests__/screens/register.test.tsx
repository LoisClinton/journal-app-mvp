import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React from "react";
import RegisterScreen from "../../app/(auth)/register";

describe("Register screen", () => {
  test("creates account", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});

    const { getByPlaceholderText, getByRole } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "  new@example.com ");
    fireEvent.changeText(getByPlaceholderText("Password"), "pass123");

    fireEvent.press(getByRole("button", { name: /Create account/i }));

    await waitFor(() => {
      const [_authArg, emailArg, passArg] = (
        createUserWithEmailAndPassword as jest.Mock
      ).mock.calls[0];
      expect(emailArg).toBe("new@example.com");
      expect(passArg).toBe("pass123");
    });
  });

  test("back to login calls router.back()", () => {
    const { getByText } = render(<RegisterScreen />);
    fireEvent.press(getByText("Back to login"));
    expect(router.back).toHaveBeenCalled();
  });
});
