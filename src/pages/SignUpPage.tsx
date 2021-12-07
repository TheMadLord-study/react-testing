import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";

interface Form {
	username: string;
	email: string;
	password: string;
	passwordRepeat: string;
}

const SignUpPage = () => {
	const [form, setForm] = useState<Form>({
		username: "",
		email: "",
		password: "",
		passwordRepeat: "",
	});

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = event.target;
		setForm({ ...form, [id]: value });
	};

	let disabled = form.password !== form.passwordRepeat || !form.passwordRepeat;

	const submit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const body = {
			username: form.username,
			email: form.email,
			password: form.password,
		};

		axios.post("api/1.0/users", body);
	};

	return (
		<div>
			<form onSubmit={submit}>
				<h1>Sign Up</h1>
				<label htmlFor="username">Username</label>
				<input id="username" value={form.username} onChange={onChange} />
				<label htmlFor="email">E-mail</label>
				<input id="email" value={form.email} onChange={onChange} />
				<label htmlFor="password">Password</label>
				<input
					id="password"
					type="password"
					value={form.password}
					onChange={onChange}
				/>
				<label htmlFor="passwordRepeat">Password-Repeat</label>
				<input
					id="passwordRepeat"
					type="password"
					value={form.passwordRepeat}
					onChange={onChange}
				/>
				<button type="submit" disabled={disabled}>
					Sign Up
				</button>
			</form>
		</div>
	);
};

export default SignUpPage;
