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

		axios.post("/api/1.0/users", body);
	};

	return (
		<div className="col-lg-6 col-md-8">
			<form className="card mt-5" onSubmit={submit}>
				<div className="card-header">
					<h1 className="text-center">Sign Up</h1>
				</div>
				<div className="card-body">
					<div className="mb-3">
						<label className="form-label" htmlFor="username">
							Username
						</label>
						<input
							className="form-control"
							id="username"
							value={form.username}
							onChange={onChange}
						/>
					</div>
					<div className="mb-3">
						<label className="form-label" htmlFor="email">
							E-mail
						</label>
						<input
							className="form-control"
							id="email"
							value={form.email}
							onChange={onChange}
						/>
					</div>
					<div className="mb-3">
						<label className="form-label" htmlFor="password">
							Password
						</label>
						<input
							className="form-control"
							id="password"
							type="password"
							value={form.password}
							onChange={onChange}
						/>
					</div>
					<div className="mb-3">
						<label className="form-label" htmlFor="passwordRepeat">
							Password-Repeat
						</label>
						<input
							className="form-control"
							id="passwordRepeat"
							type="password"
							value={form.passwordRepeat}
							onChange={onChange}
						/>
					</div>
					<div className="text-center">
						<button
							className="btn btn-primary"
							type="submit"
							disabled={disabled}
						>
							Sign Up
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default SignUpPage;
