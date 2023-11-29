import { useState } from "react";
import axios from "axios";
import "../sign-login.css";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
	const navigate = useNavigate();

	// const [formData, setFormData] = useState({
	// 	user_name: "",
	// 	password: "",
	// });
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");

	const [errorMessage, setErrorMessage] = useState("");

	const handleChange = (e) => {
		if (e.target.name === "user_name") {
			setName(e.target.value);
		} else if (e.target.name === "password") {
			setPassword(e.target.value);
		}

		// const { name, value } = e.target;
		// setFormData((prevData) => ({
		// 	...prevData,
		// 	[name]: value,
		// }));
	};

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				"http://localhost:5000/login",
				name,
				password
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
		<>
			<div className="row">
				<div className="col-6">
					<h4 className="m-5">Well Come to Task Manager</h4>
					<h5 className="ms-3">It is a way which will help manage Tasks </h5>
				</div>
				<div className="col-6 ">
					<section className="form-section">
						<div className="flex-items">
							<div>
								<h4 className="my-3 ms-5 pt-1 sign-up-tab">
									Don't Have Account ?
								</h4>
							</div>
							<div>
								<Link to="/signUp">
									<h4 className="my-3 ms-5 pt-1 sign-up-tab">
										<span className="">Sign Up</span>
									</h4>
								</Link>
							</div>
						</div>

						<div className="form-wraper">
							{errorMessage && <p className="error-message">{errorMessage}</p>}
							<form onSubmit={handleLogin}>
								<h2 className="ms-2">Login</h2>

								<div className="ms-5 mb-3">
									<input
										type="text"
										id="user_name"
										name="user_name"
										placeholder="Username"
										value={name}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="ms-5 mb-3">
									<input
										type="password"
										id="password"
										name="password"
										value={password}
										onChange={handleChange}
										placeholder="Password"
										required
									/>
								</div>

								<div className=" ms-5 pb-2 mb">
									<button className="log-in-btn" type="submit">
										Login
									</button>
								</div>

								<div className="my-2 ms-5 pt-5 ">
									<Link to="/signUp">
										<h4>
											<span className="">Forget the Password ?</span>
										</h4>
									</Link>
								</div>
							</form>
						</div>
					</section>
				</div>
			</div>
		</>
	);
};

export default LoginForm;
