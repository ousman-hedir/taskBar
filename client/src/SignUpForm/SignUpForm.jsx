import  { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../sign-login.css";
import "../main.css"
import "bootstrap/dist/css/bootstrap.min.css";
// import DataSummit from "../DataSummit/DataSummit";

const SignupForm = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		user_name: "",
		email: "",
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

	const handleSignup = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				"http://localhost:5000/signup",
				formData
			);

			console.log("Signup successful", response.data);

			setErrorMessage("");

			navigate("/home");
		} catch (error) {
			console.error("Error signing up", error);

			if (error.response && error.response.status === 400) {
				setErrorMessage("Email already in use");
			} else {
				setErrorMessage("Error signing up. Please try again.");
			}
		}
	};

	return (
		<section className="signUp-form-section">
			<div className="flex-items">
				<div>
					<h4 className="my-3 ms-5 pt-5 sign-up-tab">Do you Have Account</h4>
				</div>
				<div>
					<Link to="/log-in">
						<h4 className="my-3 ms-5 pt-5 sign-up-tab">
							<span className="">Login</span>
						</h4>
					</Link>
				</div>
			</div>

			<div className="form-wraper">
				{errorMessage && <p className="error-message">{errorMessage}</p>}
				<form onSubmit={handleSignup}>
					<h2 className="ms-3">Sign Up</h2>

					<div className="my-3 ms-5">
						<input
							type="text"
							id="user_name"
							name="user_name"
							value={formData.user_name}
							onChange={handleChange}
							placeholder=" Username"
							required
						/>
					</div>

					<div className="my-3 ms-5">
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Email"
							required
						/>
					</div>

					<div className=" ms-5">
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

					<div className="my-3 pb-4 ms-5">
						<button className="log-in-btn" type="submit">
							Sign Up
						</button>
					</div>
				</form>
			</div>
		</section>
	);
};

export default SignupForm;
