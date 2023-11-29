const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
	user: "task-user",
	host: "localhost",
	database: "task-db",
	password: "123456",
});

connection.connect((err) => {
	if (err) {
		console.log(err.message);
	} else {
		console.log("Connection established");
	}
});

const taskTable = `
  CREATE TABLE IF NOT EXISTS Task (
    id INT NOT NULL AUTO_INCREMENT,
    task_name VARCHAR(255),
    notes VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    PRIMARY KEY (id)
  )
`;

connection.query(taskTable, (err, results) => {
	if (err) {
		console.log("Error creating task Table table:", err.message);
	} else {
		console.log("taskTable table created successfully");
	}
});

// Update task
app.patch("/task/:id", (req, res) => {
	const id = req.params.id;
	const name = req.body.task_name;
	const notes = req.body.notes;
	const completed = req.body.completed ? 1 : 0; // Convert boolean to 1 or 0

	if (completed === undefined) {
		return res.status(400).send("Completed status is required!");
	}

	const updateTask = `UPDATE Task
	
    SET task_name = "${name}",
	
    notes = "${notes}",
    completed = ${completed}
    WHERE id=${id}`;

	connection.query(updateTask, (err, result) => {
		if (err) {
			return res.status(500).send(err.message);
		} else if (result.affectedRows == 0) {
			return res.status(404).send(`No task with id ${id}`);
		} else {
			return res.status(200).send("Task updated");
		}
	});
});

// create tasks
app.post("/task/create", (req, res) => {
	const { task_name, notes } = req.body;

	const createTask = `INSERT INTO Task (task_name, notes) VALUES (?, ?)`;
	connection.query(createTask, [task_name, notes], (err, result) => {
		if (err) {
			return res.status(500).send(err.message);
		} else {
			const createdTask = {
				id: result.insertId,
				task_name: task_name,
				notes: notes,
				completed: false,
			};
			return res.json(createdTask);
		}
	});
});

// read all tasks
app.get("/task", (req, res) => {
	const readAllTasks = `SELECT * FROM Task ORDER BY id ASC`;

	connection.query(readAllTasks, (err, result) => {
		if (err) {
			return res.send(err.message);
		} else {
			return res.json(result);
		}
	});
});

// read single tasks

app.get("/task/:id", (req, res) => {
	const id = req.params.id;

	const readTask = `SELECT * FROM Task WHERE id = '${id}'`;

	connection.query(readTask, (err, result) => {
		if (err) {
			return res.status(500).send(err.message);
		} else if (result.length == 0) {
			return res.send(`No task with id ${id}`);
		} else {
			return res.status(200).json(result[0]);
		}
	});
});

// Delete single task
app.delete("/task/:id", (req, res) => {
	const id = req.params.id;

	const deleteTask = `DELETE FROM Task WHERE id = ${id}`;

	connection.query(deleteTask, (err, result) => {
		if (err) {
			return res.send(err.message);
		}

		if (result.affectedRows === 0) {
			return res.send(`No task with id ${id}`);
		}

		if (result.error) {
			return res.send(result.error.message);
		}

		return res.send("Task deleted");
	});
});

// sign up table
const bcrypt = require("bcrypt");

//create sign up table
let createsignUpTable = `CREATE TABLE IF NOT EXISTS sign_up (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255),
    email VARCHAR(255),
    password_hash VARCHAR(255)
);`;

connection.query(createsignUpTable, (err, results) => {
	if (err) {
		console.log("Error creating sign up table:", err.message);
	} else {
		console.log("sign up table created successfully");
	}
});
// send sign up data

app.post("/signup", async (req, res) => {
	let { user_name, email, password } = req.body;

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	let checkEmail = "SELECT * FROM sign_up WHERE email = ?";
	connection.query(checkEmail, [email], (error, results) => {
		if (error) {
			console.error(error);

			return;
		}

		if (results.length > 0) {
			res.status(400).send("Email already in use");
		} else {
			let insertDatas =
				"INSERT INTO sign_up (user_name, email, password_hash) VALUES (?, ?, ?)";
			connection.query(
				insertDatas,
				[user_name, email, passwordHash],
				(error, result) => {
					if (error) {
						console.error(error.message);
					}
				}
			);
		}
	});
});

// Login form
app.post("/login", async (req, res) => {
	let { user_name, password } = req.body;

	let getUser =
		"SELECT user_id, user_name, email, password_hash FROM sign_up WHERE user_name = ?";

	connection.query(getUser, [user_name], async (error, results) => {
		if (error) {
			console.error(error);
			return res.send("Internal Server Error");
		}

		if (results.length === 0) {
			return res.send("Invalid credentials");
		}

		const user = results[0];

		const passwordMatch = await bcrypt.compare(password, user.password_hash);

		if (passwordMatch) {
			return res.send("Login successful");
		} else {
			return res.send("Invalid credentials");
		}
	});
});

// port
app.listen(5000, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`App listening on port 5000...`);
	}
});
