import SignUpPage from "./SignUpPage";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";

describe("Sign Up Page", () => {
	describe("Layout", () => {
		it("has header", () => {
			render(<SignUpPage />);
			const header = screen.queryByRole("heading", { name: "Sign Up" });
			expect(header).toBeInTheDocument();
		});

		it("has username input", () => {
			render(<SignUpPage />);
			const input = screen.getByLabelText("Username");
			expect(input).toBeInTheDocument();
		});

		it("has email input", () => {
			render(<SignUpPage />);
			const input = screen.getByLabelText("E-mail");
			expect(input).toBeInTheDocument();
		});

		it("has password input", () => {
			render(<SignUpPage />);
			const input = screen.getByLabelText("Password");
			expect(input).toBeInTheDocument();
		});

		it("has password type for password input", () => {
			render(<SignUpPage />);
			const input = screen.getByLabelText("Password") as HTMLInputElement;
			expect(input.type).toBe("password");
		});

		it("has sign up button", () => {
			render(<SignUpPage />);
			const button = screen.queryByRole("button");
			expect(button).toBeInTheDocument();
		});

		it("disables the button initially", () => {
			render(<SignUpPage />);
			const button = screen.queryByRole("button");
			expect(button).toBeDisabled();
		});
	});

	describe("Interactions", () => {
		it("enable the button, then password and password repeat has same value", () => {
			render(<SignUpPage />);
			const passwordInput = screen.getByLabelText(
				"Password"
			) as HTMLInputElement;
			const passwordRepeat = screen.getByLabelText(
				"Password-Repeat"
			) as HTMLInputElement;

			userEvent.type(passwordInput, "P4ssword");
			userEvent.type(passwordRepeat, "P4ssword");
			const button = screen.queryByRole("button");
			expect(button).toBeEnabled();
		});

		it("sends username and password to backend after clicking button", async () => {
			let requestBody;
			const server = setupServer(
				rest.post("/api/1.0/users", (req, res, ctx) => {
					requestBody = req.body;
					return res(ctx.status(200));
				})
			);
			server.listen();
			render(<SignUpPage />);
			const usernameInput = screen.getByLabelText("Username");
			const emailInput = screen.getByLabelText("E-mail");
			const passwordInput = screen.getByLabelText("Password");
			const passwordRepeat = screen.getByLabelText("Password-Repeat");
			userEvent.type(usernameInput, "user1");
			userEvent.type(emailInput, "user1@mail.com");
			userEvent.type(passwordInput, "P4ssword");
			userEvent.type(passwordRepeat, "P4ssword");

			const button = screen.queryByRole("button", {
				name: "Sign Up",
			}) as HTMLElement;

			userEvent.click(button);

			await new Promise((resolve) => {
				setTimeout(resolve, 500);
			});

			expect(requestBody).toEqual({
				username: "user1",
				email: "user1@mail.com",
				password: "P4ssword",
			});
		});
	});
});
