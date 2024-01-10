// LoginForm.js

import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../sign-login.css"; 
import Footer from "../Footer/Footer";

const LoginForm = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		user_name: "",
		password: "",
	});

	const [errorMessage, setErrorMessage] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				"http://localhost:5000/login",
				formData
			);

			console.log("Login successful", response.data);

			setErrorMessage("");

			navigate("/home");
		} catch (error) {
			console.error("Error logging in", error);

			if (error.response && error.response.status === 401) {
				setErrorMessage("Invalid username or password");
			} else {
				setErrorMessage("Error logging in. Please try again.");
			}
		}
	};

	return (
		<div className="row">
			<div className="col-6 ">
				<div className="welcome-section">
					<div className="welcome-text">
						<h1 className="welcome-heading">Welcome to Task Manager</h1>
						<p className="welcome-description">
							Your all-in-one solution for streamlined task organization and
							enhanced productivity. <br /> <br /> Simplify your daily schedule
							with customizable task lists, deadline reminders, and
							collaborative features. <br /> Take control of your workflow
							effortlessly, whether you're a professional or a student. <br />
							<br /> Achieve your goals with the simplicity of Task Manager.
						</p>
					</div>
				</div>
			</div>
			<div className="col-6">
				<section className="form-section">
					<div className="flex-items">
						<div>
							<h4 className="my-3 ms-5 pt-1 sign-up-tab">
								Don't Have an Account?
							</h4>
						</div>
						<div>
							<Link to="/signUp" className="viewButton">
								<h4 className=" sign-up-tab">Sign Up</h4>
							</Link>
						</div>
					</div>
					{/* from input */}

					<div className="form-wraper">
						{errorMessage && <p className="error-message">{errorMessage}</p>}
						<form onSubmit={handleLogin}>
							<h2 className="ms-2">Login</h2>

							<div className="ms-5 mb-3 edit-input">
								<input
									type="text"
									id="user_name"
									name="user_name"
									placeholder="Username"
									value={formData.user_name}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="ms-5 mb-3">
								<input
									type="password"
									id="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Password"
									required
								/>
							</div>
							

							<div className="ms-5 pb-2 mb">
								<button className="submit-btn" type="submit">
									Login
								</button>
							</div>

							<div className="my-2 ms-5 pt-5 ">
								<Link  className="link">
									<h6 className="sign-log-forget-tab">Forget the Password?</h6>
								</Link>
							</div>
						</form>
					</div>
				</section>
			</div>
			<Footer/>
		</div>
	);
};

export default LoginForm;
