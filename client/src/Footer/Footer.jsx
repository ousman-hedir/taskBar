// Footer.js

import React from "react";
import "./Footer.css"; 

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer-content">
				<div className="footer-section about">
					<h2>About Us</h2>
					<p>
						Your Website Name is a platform dedicated to providing valuable
						content and services to our users.
					</p>
				</div>

				<div className="footer-section contact">
					<h2>Contact Us</h2>
					<p>Email: moreinfor203@gmail.com</p>
					<p>Phone: (251) 9 42 86 88 01</p>
				</div>

				<div className="footer-section social">
					<h2>Connect with Us</h2>
					<div className="social-icons">
						<a href="#" target="_blank" rel="noopener noreferrer">
							<i className="fab fa-facebook"></i>
						</a>
						<a href="#" target="_blank" rel="noopener noreferrer">
							<i className="fab fa-twitter"></i>
						</a>
						<a href="#" target="_blank" rel="noopener noreferrer">
							<i className="fab fa-instagram"></i>
						</a>
					</div>
				</div>
			</div>

			<div className="footer-bottom">
				<p>
					2024 Dev By{" "}
					<a
						href="https://ousmanhedir.com.et/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Ousman Hedir
					</a>
					. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
