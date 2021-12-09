import SignUpPage from "./SignUpPage";
import { getByRole, render, screen } from "@testing-library/react";
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
		let button: HTMLElement;
		const setup = () => {
			render(<SignUpPage />);
			const usernameInput = screen.getByLabelText("Username");
			const emailInput = screen.getByLabelText("E-mail");
			const passwordInput = screen.getByLabelText("Password");
			const passwordRepeat = screen.getByLabelText("Password-Repeat");
			userEvent.type(usernameInput, "user1");
			userEvent.type(emailInput, "user1@mail.com");
			userEvent.type(passwordInput, "P4ssword");
			userEvent.type(passwordRepeat, "P4ssword");

			button = screen.queryByRole("button", {
				name: "Sign Up",
			}) as HTMLElement;
		};

		it("enable the button, then password and password repeat has same value", () => {
			setup();
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
			setup();
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

		it("disables button when is an ongoing api call", async () => {
			let counter = 0;
			const server = setupServer(
				rest.post("/api/1.0/users", (req, res, ctx) => {
					counter += 1;
					return res(ctx.status(200));
				})
			);
			server.listen();
			setup();

			userEvent.click(button);
			userEvent.click(button);

			await new Promise((resolve) => {
				setTimeout(resolve, 500);
			});

			expect(counter).toBe(1);
		});

		it("displays spinner after clicking the submit", async () => {
			const server = setupServer(
				rest.post("/api/1.0/users", (req, res, ctx) => {
					return res(ctx.status(200));
				})
			);
			server.listen();
			setup();

			expect(screen.queryByRole("status")).not.toBeInTheDocument();
			userEvent.click(button);
			const spinner = screen.getByRole("status");
			expect(spinner).toBeInTheDocument();
		});

		it("displays account activation notification after succesful sign up requests", async () => {
			const server = setupServer(
				rest.post("/api/1.0/users", (req, res, ctx) => {
					return res(ctx.status(200));
				})
			);
			server.listen();
			setup();
			const message = "Please check your email to activate your account";
			expect(screen.queryByText(message)).not.toBeInTheDocument();
			userEvent.click(button);
			const text = await screen.findByText(message);
			expect(text).toBeInTheDocument();
		});
	});
});
