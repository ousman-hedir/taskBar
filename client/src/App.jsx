import EditTask from "./EditTask/EditTask";
import Home from "./Home/Home";
import LoginForm from "./LogIn/LoginForm";
import SignupForm from "./SignUpForm/SignUpForm";
import DetailTask from "./DetailTask/DetailTask";

import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<LoginForm />} />
				<Route path="/log-in" element={<LoginForm />} />
				<Route path="/home" element={<Home />} />
				<Route path="/edit/:id" element={<EditTask />} />

				<Route path="/signUp" element={<SignupForm />} />
				<Route path="/detail/:id" element={<DetailTask />} />
			</Routes>
		</>
	);
}
export default App;
