import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';

interface Form {
	username: string;
	email: string;
	password: string;
	passwordRepeat: string;
}

interface Errors {
	username: string;
}

const SignUpPage = () => {
	const [form, setForm] = useState<Form>({
		username: '',
		email: '',
		password: '',
		passwordRepeat: '',
	});
	const [apiProgress, setApiProgress] = useState<boolean>(false);
	const [signUpSuccess, setSignUpSuccess] = useState(false);
	const [errors, setErrors] = useState({ username: '' } as Errors);

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = event.target;
		setForm({ ...form, [id]: value });
	};

	let disabled = form.password !== form.passwordRepeat || !form.passwordRepeat;

	const submit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const body = {
			username: form.username,
			email: form.email,
			password: form.password,
		};

		setApiProgress(true);
		try {
			await axios.post('/api/1.0/users', body);
			setSignUpSuccess(true);
		} catch (error: any) {
			console.log(error.response);

			if (error.response.status === 400) {
				setErrors({ ...errors, ...error.response.data.validationErrors });
			}
		}
	};

	return (
		<div className='col-lg-6 col-md-8 offset-lg-3 offset-md-2'>
			{!signUpSuccess && (
				<form
					className='card mt-5'
					onSubmit={submit}
					data-testid='form-sign-up'
				>
					<div className='card-header'>
						<h1 className='text-center'>Sign Up</h1>
					</div>
					<div className='card-body'>
						<div className='mb-3'>
							<label className='form-label' htmlFor='username'>
								Username
							</label>
							<input
								className='form-control'
								id='username'
								value={form.username}
								onChange={onChange}
							/>
						</div>
						{/* <span>{errors.username}</span> */}
						{errors.username && <span>Username cannot be null</span>}
						<div className='mb-3'>
							<label className='form-label' htmlFor='email'>
								E-mail
							</label>
							<input
								className='form-control'
								id='email'
								value={form.email}
								onChange={onChange}
							/>
						</div>
						<div className='mb-3'>
							<label className='form-label' htmlFor='password'>
								Password
							</label>
							<input
								className='form-control'
								id='password'
								type='password'
								value={form.password}
								onChange={onChange}
							/>
						</div>
						<div className='mb-3'>
							<label className='form-label' htmlFor='passwordRepeat'>
								Password-Repeat
							</label>
							<input
								className='form-control'
								id='passwordRepeat'
								type='password'
								value={form.passwordRepeat}
								onChange={onChange}
							/>
						</div>
						<div className='text-center'>
							<button
								className='btn btn-primary'
								type='submit'
								disabled={disabled || apiProgress}
							>
								{apiProgress && (
									<span
										className='spinner-border spinner-border-sm'
										role='status'
									></span>
								)}
								Sign Up
							</button>
						</div>
					</div>
				</form>
			)}
			{signUpSuccess && (
				<div className='alert alert-success mt-3' role='alert'>
					Please check your email to activate your account
				</div>
			)}
		</div>
	);
};

export default SignUpPage;
