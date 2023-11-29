import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../Header/Header";

function DetailTask() {
	const [tasks, setTasks] = useState([]);
	const [notes, setNotes] = useState("");
	const [completed, setCompleted] = useState(false);
	const [loading, setLoading] = useState(true);
	const { id } = useParams();

	async function fetchData() {
		try {
			const res = await fetch(`http://localhost:5000/task/${id}`);
			const data = await res.json();

			setTasks(data);
			setNotes(data.notes);
			setCompleted(data.completed);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		const delayPageRendering = setTimeout(() => {
			fetchData();
			setLoading(false);
		}, 500);

		// Cleanup the timeout to avoid memory leaks
		return () => clearTimeout(delayPageRendering);
	}, [id]);

	return (
		<>
			<Header
				link1="/home"
				text1="Home"
				link2={`/edit/${id}`}
				text2="Edit Task"
				link3="/"
				text3="Log out"
			/>
			<div className="task-form ">
				<h2 className="mt-5 ms-5 my-3 ">
					<u> Detail About Task</u>
				</h2>
				{loading ? (
					<p className="loading "></p>
				) : (
					<div>
						<div>
							<strong className="mt-5 ms-5 my-3 ">Task ID : </strong>
							{tasks.id}
						</div>
						<div>
							<strong className="mt-5 ms-5 my-3 ">Task Name : </strong>
							{tasks.task_name}
						</div>
						<div className="my-3">
							<strong className="mt-5 ms-5 my-3 "> Detail Notes : </strong>
							{notes}
						</div>

						<div className="mb-3">
							<strong className="mt-5 ms-5 my-3">Status : </strong>
							{completed === 0
								? "Task Is Not Complete yet."
								: "Task is Completed"}
						</div>
						<Link to="/home" className="ms-5">
							<i className="fa-solid fa-arrow-left"></i>
						</Link>

						<h5 className="mt-5 pe-4">
							Do You Want To Update Your Task ?
							<Link to={`/edit/${id}`}>
								<button className="edit-btn ms-2">Update</button>
							</Link>
						</h5>
					</div>
				)}
			</div>
		</>
	);
}

export default DetailTask;
