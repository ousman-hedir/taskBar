import { Link } from "react-router-dom";

function Header(props) {
	return (
		<>
			<div className="header">
				<div className="header-comp">
					<ul>
						<Link to={props.link1}>
							<li>{props.text1}</li>
						</Link>
						<Link to={props.link2}>
							<li>{props.text2}</li>
						</Link>
						<Link to={props.link3}>
							<li>{props.text3}</li>
						</Link>
					</ul>
					{/* <ul>
						<Link to=  "/home">
							<li>Home</li>
						</Link>

				
						<Link to="/" className="ms-5">
							<li>Log out</li>
						</Link>
					</ul> */}
				</div>
			</div>
		</>
	);
}

export default Header;
