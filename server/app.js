const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create a connection pool
const pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});

pool.getConnection((err, connection) => {
	if (err) {
		console.error("Error connecting to MySQL:", err.message);
	} else {
		console.log("Connection established");

		// Create Task table
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
				console.log("Error creating Task table:", err.message);
			} else {
				console.log("Task table created successfully");
			}

		
		});
	}
});


// Update task
app.patch("/task/:id", (req, res) => {
	const id = req.params.id;
	const name = req.body.task_name;
	const notes = req.body.notes;
	const completed = req.body.completed ? 1 : 0;

	if (completed === undefined) {
		return res.status(400).send("Completed status is required!");
	}

	const updateTask = `UPDATE Task SET task_name = ?, notes = ?, completed = ? WHERE id = ?`;

	pool.query(updateTask, [name, notes, completed, id], (err, result) => {
		if (err) {
			console.error("Error updating task:", err.message);
			return res.status(500).send(err.message);
		} else if (result.affectedRows === 0) {
			return res.status(404).send(`No task with id ${id}`);
		} else {
			return res.status(200).send("Task updated");
		}
	});
});

// Create tasks
app.post("/task/create", (req, res) => {
	const { task_name, notes } = req.body;

	const createTask = `INSERT INTO Task (task_name, notes) VALUES (?, ?)`;

	pool.query(createTask, [task_name, notes], (err, result) => {
		if (err) {
			console.error("Error creating task:", err.message);
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

// Read all tasks
app.get("/task", (req, res) => {
	const readAllTasks = `SELECT * FROM Task ORDER BY id ASC`;

	pool.query(readAllTasks, (err, result) => {
		if (err) {
			console.error("Error reading all tasks:", err.message);
			return res.status(500).send(err.message);
		} else {
			return res.json(result);
		}
	});
});

// Read single task
app.get("/task/:id", (req, res) => {
	const id = req.params.id;

	const readTask = `SELECT * FROM Task WHERE id = ?`;

	pool.query(readTask, [id], (err, result) => {
		if (err) {
			console.error("Error reading task:", err.message);
			return res.status(500).send(err.message);
		} else if (result.length === 0) {
			return res.status(404).send(`No task with id ${id}`);
		} else {
			return res.status(200).json(result[0]);
		}
	});
});

// Delete single task
app.delete("/task/:id", (req, res) => {
	const id = req.params.id;

	const deleteTask = `DELETE FROM Task WHERE id = ?`;

	pool.query(deleteTask, [id], (err, result) => {
		if (err) {
			console.error("Error deleting task:", err.message);
			return res.status(500).send(err.message);
		}

		if (result.affectedRows === 0) {
			return res.status(404).send(`No task with id ${id}`);
		}

		return res.send("Task deleted");
	});
});

// Create sign up table
const createsignUpTable = `
  CREATE TABLE IF NOT EXISTS sign_up (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255),
    email VARCHAR(255),
    password_hash VARCHAR(255)
  )
`;

pool.query(createsignUpTable, (err, results) => {
	if (err) {
		console.error("Error creating sign up table:", err.message);
	} else {
		console.log("Sign up table created successfully");
	}
});

// Signup route
app.post("/signup", async (req, res) => {
	let { user_name, email, password } = req.body;

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	let checkEmail = "SELECT * FROM sign_up WHERE email = ?";
	pool.query(checkEmail, [email], (error, results) => {
		if (error) {
			console.error("Error checking email:", error.message);
			return res.status(500).send(error.message);
		}

		if (results.length > 0) {
			res.status(400).send("Email already in use");
		} else {
			let insertDatas =
				"INSERT INTO sign_up (user_name, email, password_hash) VALUES (?, ?, ?)";
			pool.query(
				insertDatas,
				[user_name, email, passwordHash],
				(error, result) => {
					if (error) {
						console.error("Error inserting signup data:", error.message);
						return res.status(500).send(error.message);
					} else {
						return res.send("Signup successful");
					}
				}
			);
		}
	});
});

// Login route
app.post("/login", async (req, res) => {
	let { user_name, password } = req.body;

	let getUser =
		"SELECT user_id, user_name, email, password_hash FROM sign_up WHERE user_name = ?";

	pool.query(getUser, [user_name], async (error, results) => {
		if (error) {
			console.error("Error getting user data:", error.message);
			return res.status(500).send("Internal Server Error");
		}

		if (results.length === 0) {
			return res.status(401).send("Invalid credentials");
		}

		const user = results[0];

		const passwordMatch = await bcrypt.compare(password, user.password_hash);

		if (passwordMatch) {
			return res.send("Login successful");
		} else {
			return res.status(401).send("Invalid credentials");
		}
	});
});

// Listen on port 5000
app.listen(5000, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`App listening on port 5000...`);
	}
});
