import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../sign-login.css";
import Header from "../Header/Header";
import axios from "axios";
import Footer from "../Footer/Footer";

function Home() {
	const [tasks, setTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [newTask, setNewTask] = useState("");
	const [newNotes, setNewNotes] = useState("");
	const [idToDelete, setIdToDelete] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [completed, setCompleted] = useState(false);

	// data fetching

	async function fetchData() {
		try {
			setIsLoading(true);
			const res = await fetch("http://localhost:5000/task");
			const data = await res.json();
			console.log(data);
			console.log(data[0].completed);

			if (res.ok) {
				if (data.length > 0) {
					setNewTask(data[0].task_name);
					setNewNotes(data[0].notes);
					setCompleted(data[0].completed);
					// setNewNotes("");
					// setNewTask("");
				}
				setTasks(data);
			} else {
				const errorText = await res.text();
				console.error(`Error: ${errorText}`);
			}

			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	}

	// deleting task
	async function deleteTask(id) {
		try {
			const confirmed = window.confirm(
				`Are you sure you want to delete task ${id} ?`
			);
			if (!confirmed) {
				return;
			}

			const res = await fetch(`http://localhost:5000/task/${id}`, {
				method: "DELETE",
			});
			console.log(res);

			if (res) {
				// window.location.reload();
				setTasks(tasks.filter((task) => task.id !== id));
				// alert(`Task ${id} deleted successfully`);
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		if (idToDelete !== null) {
			deleteTask(idToDelete);
			setIdToDelete(null);
		}
	}, [idToDelete]);
	// check box

	const completeTask = async (id, completed, task_name, notes) => {
		try {
			const res = await fetch(`http://localhost:5000/task/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ completed, task_name, notes }),
			});

			if (res.ok) {
				setTasks((prevTasks) =>
					prevTasks.map((task) =>
						task.id === id ? { ...task, completed, task_name, notes } : task
					)
				);
			} else {
				console.error("Error updating task:", res.statusText);
			}
		} catch (error) {
			console.error("Error updating task:", error);
		}
	};

	const handleCheckboxChange = (taskId) => {
		const taskToUpdate = tasks.find((task) => task.id === taskId);
		if (taskToUpdate) {
			const { completed, task_name, notes } = taskToUpdate;
			completeTask(taskId, !completed, task_name, notes);
		}
		// completeTask(taskId, !completed);
	};

	// task creating
	const createTask = async (e) => {
		e.preventDefault();

		try {
			const existingTask = tasks.find((task) => task.task_name === newTask);

			if (existingTask) {
				setErrorMessage("Task Name Is Already Created!");
				setTimeout(() => {
					setErrorMessage("");
				}, 3000);
			} else {
				const res = await fetch("http://localhost:5000/task/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ task_name: newTask, notes: newNotes }),
				});

				const data = await res.json();
				setErrorMessage("Task Created.");
				setTimeout(() => {
					setErrorMessage("");
				}, 3000);

				setTasks([...tasks, data]);
			}
		} catch (error) {
			console.log(error);
			setErrorMessage("! Task Name is Required.");
			setTimeout(() => {
				setErrorMessage("");
			}, 3000);
		}

		setNewTask("");
		setNewNotes("");
	};

	useEffect(() => {
		fetchData();
	}, []);

	function handleInputChange(e) {
		if (e.target.name === "name") {
			setNewTask(e.target.value);
		} else if (e.target.name === "notes") {
			setNewNotes(e.target.value);
		}
	}

	return (
		<div className="home">
			<div>
				<Header link1="/" text1="Log out" />
			</div>
			<br />

			<form className="task-form ">
				<h4>Task Manager</h4>
				<div className="form-control">
					<input
						type="text"
						name="name"
						className="task-input"
						placeholder="Write Your task"
						value={newTask}
						onChange={handleInputChange}
						required
					/>

					<input
						type="text"
						name="notes"
						className="task-input my-3"
						placeholder="Detail Note"
						value={newNotes}
						onChange={handleInputChange}
					/>
					<button type="submit" className=" submit-btn" onClick={createTask}>
						Add
					</button>
				</div>

				{errorMessage && (
					<h1 className="form-alert alert-success py-3 ps-5  ">
						{errorMessage}
					</h1>
				)}
			</form>

			<section className="tasks-container">
				{isLoading ? (
					<p className="loading "></p>
				) : (
					<div className="tasks ">
						<h5 className="total-tasks">
							You Have a total of {tasks.length} Tasks.
						</h5>
						<hr />
						{tasks.map((task) => (
							<div
								key={task.id}
								className={`single-task row ${
									task.completed && "task-completed "
								}`}
							>
								<h4 className="task-cmplete ms-5 mb-3">
									<u>{task.completed ? "✔ Task Completed" : ""}</u>
								</h4>

								<div className="task-container">
									{/* <i className="far fa-check-circle "></i> */}
									{task.id}
									<sup>th</sup> :
									<span>
										<h5 className="ms-5 task-box">{task.task_name}</h5>
									</span>
								</div>
								<hr className="my-3" />
								<div className="tasks ">
									{/* checkbox */}
									<div className="" key={task.id}>
										<label className="pt-3 me-2 bolder">
											<h6>Completed?</h6>
										</label>
										<input
											className="check-box-input me-5"
											type="checkbox"
											checked={task.completed === 1 ? true : false}
											onChange={() => handleCheckboxChange(task.id)}
										/>
									</div>

									{/* detail view */}
									<div>
										<Link
											className="edit-link mt-3 mx-5 "
											to={`/detail/${task.id}`}
										>
											<i className="fa-solid fa-check-to-slot"></i>
										</Link>
									</div>

									{/* <!-- edit link --> */}
									<div>
										<Link
											to={`/edit/${task.id}`}
											className="edit-link mt-3 mx-5 "
										>
											<i className="fas fa-edit"></i>
										</Link>
									</div>

									{/* <!-- delete btn --> */}
									<div>
										<button
											onClick={() => {
												deleteTask(task.id);
											}}
											type="button"
											className="delete-btn mt-2"
										>
											<i className="fas fa-trash"></i>
										</button>
									</div>

									<div className="task-links"></div>
								</div>
							</div>
						))}
					</div>
				)}
			</section>
			<Footer/>
		</div>
	);
}

export default Home;
