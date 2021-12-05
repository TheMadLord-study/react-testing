import { ChangeEvent, useState } from "react";
import axios from "axios";

interface Props {}

const SignUpPage = (props: Props) => {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordRepeat, setPasswordRepeat] = useState<string>("");

	const onChangeUsername = (event: ChangeEvent) => {
		const { value } = event.target as HTMLInputElement;
		setUsername(value);
	};

	const onChangeEmail = (event: ChangeEvent) => {
		const { value } = event.target as HTMLInputElement;
		setEmail(value);
	};

	const onChangePassword = (event: ChangeEvent) => {
		const { value } = event.target as HTMLInputElement;
		setPassword(value);
	};

	const onChangePasswordRepeat = (event: ChangeEvent) => {
		const { value } = event.target as HTMLInputElement;
		setPasswordRepeat(value);
	};

	let disabled = password !== passwordRepeat || !password || !passwordRepeat;

	const submit = () => {
		const body = { username, email, password };
		axios.post("/api/1.0/users");
	};

	return (
		<div>
			<h1>Sign Up</h1>
			<label htmlFor="username">Username</label>
			<input id="username" value={username} onChange={onChangeUsername} />
			<label htmlFor="email">E-mail</label>
			<input id="email" value={email} onChange={onChangeEmail} />
			<label htmlFor="password">Password</label>
			<input
				id="password"
				type="password"
				value={password}
				onChange={onChangePassword}
			/>
			<label htmlFor="passwordRepeat">Password-Repeat</label>
			<input
				id="passwordRepeat"
				type="password"
				value={passwordRepeat}
				onChange={onChangePasswordRepeat}
			/>
			<button disabled={disabled} onClick={submit}>
				Sign Up
			</button>
		</div>
	);
};

export default SignUpPage;
