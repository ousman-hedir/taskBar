import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
// import axios from "axios";

function EditTask() {
	const { id } = useParams();
	const [eachTask, setEachTask] = useState({});
	const [eachNotes, setEachNotes] = useState("");
	const [newTask, setNewTask] = useState("");
	const [newNotes, setNewNotes] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [completed, setCompleted] = useState(0);

	// fetch inputs
	async function fetchData() {
		try {
			setLoading(true);
			const res = await fetch(`http://localhost:5000/task/${id}`);
			const data = await res.json();

			if (res.ok) {
				if (data) {
					setEachTask(data);
					setEachNotes(data.notes);
					setCompleted(data.completed);
					console.log(completed);
				}
			} else {
				console.error(Error);
			}

			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	}

	useEffect(() => {
		fetchData();
		const loading = setTimeout(() => {
			setLoading(false);
		}, 500);

		return () => clearTimeout(loading);
	}, [id]);

	// updating
	async function handleSubmit(e) {
		e.preventDefault();

		try {
			const res = await fetch(`http://localhost:5000/task/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					task_name: newTask || eachTask.task_name,
					notes: newNotes || eachNotes,
				}),
			});

			if (res.ok) {
				setErrorMessage("Task updated successfully");
			} else {
				setErrorMessage("Failed to update task");
			}
		} catch (error) {
			console.error(error);
		}
	}

	const handleInputChange = (e) => {
		setNewTask(e.target.value);
	};

	const handleNotesChange = (e) => {
		setNewNotes(e.target.value);
	};

	// check box
	const handleCheckboxChange = () => {
		setCompleted((preVal) => (preVal === 0 ? 1 : 0));
		console.log(completed);
	};

	return (
		<>
			<Header
				link1="/home"
				text1="Home"
				text2="View Detail"
				link2={`/detail/${id}`}
				text3="Log out"
				link3="/"
			/>

			<form className="task-form">
				<Link to="/home" className="ms-5">
					<i className="fa-solid fa-arrow-left"></i>
				</Link>
				{loading ? (
					<p className="loading "></p>
				) : (
					<div>
						<div className=" ms-5">
							<h4>Edit "{eachTask.task_name}" Task? </h4>
						</div>

						<h6>
							{completed
								? "Is your task Not Completed yet ?"
								: "Is Your Task Completed ?"}
							{/* Is Your Task Completed */}
							<input
								className="check-box-input me-5"
								type="checkbox"
								checked={completed}
								onChange={handleCheckboxChange}
							/>
						</h6>

						<div className="edit-input mt-3">
							<h6 className="pt-4 me-4"> Task ID : {eachTask.id}</h6>
						</div>
						<div className="edit-input mt-3">
							<label>
								<h6 className="pt-4 me-4">Task </h6>
							</label>
							<input
								type="text"
								name="name"
								className="my-3 task-input"
								placeholder={eachTask.task_name}
								value={newTask}
								onChange={handleInputChange}
							/>
						</div>
						<div className="edit-input ">
							<label>
								<h6 className="pt-4 me-2">Details</h6>
							</label>
							<input
								placeholder={
									eachNotes ? eachNotes : "you haven't Wrote detail Note"
								}
								type="text"
								name="notes"
								className="my-3 task-input"
								value={newNotes}
								onChange={handleNotesChange}
							/>
						</div>

						<button
							type="submit"
							className="mt-2  submit-btn"
							onClick={handleSubmit}
						>
							Update
						</button>

						<div className="form-alert alert-success py-3 ps-5 bolder ">
							{errorMessage}
						</div>
					</div>
				)}
			</form>
			<Footer/>
		</>
	);
}

export default EditTask;
