// import React, { useState, useEffect } from "react";
// import Navbar from "react-bootstrap/Navbar";
// import Nav from "react-bootstrap/Nav";
// import Container from "react-bootstrap/Container";
// import { Link, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Navbar.css";
// import { AiOutlineHome, AiOutlineContacts } from "react-icons/ai";
// import { GiSkills } from "react-icons/gi";
// import { CgFileDocument } from "react-icons/cg";

// function NavBar() {
//   const [expand, updateExpanded] = useState(false);
//   const [navColour, updateNavbar] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if the user is logged in (you can implement this based on your authentication logic)
//     const isAuthenticated = localStorage.getItem("authtoken") !== null;

//     setIsLoggedIn(isAuthenticated);
//   }, []);

//   const handleLogout = () => {
//     // Clear the auth-token from localStorage
//     localStorage.removeItem("authtoken");
//     setIsLoggedIn(false);
//     // Redirect to the home page after logout
//     navigate("/");
//   };

//   function scrollHandler() {
//     if (window.scrollY >= 20) {
//       updateNavbar(true);
//     } else {
//       updateNavbar(false);
//     }
//   }

//   window.addEventListener("scroll", scrollHandler);

//   return (
//     <Navbar
//       expanded={expand}
//       fixed="top"
//       expand="md"
//       className={navColour ? "sticky" : "navbar"}
//     >
//       <Container>
//         <Navbar.Brand href="/" className="d-flex">
//           <div
//             style={{
//               color: "#7500fa",
//               fontFamily: "monsterrat",
//               fontSize: "24px",
//               marginRight: "22px",
//             }}
//           >
//             Resume
//           </div>
//         </Navbar.Brand>
//         <Navbar.Toggle
//           aria-controls="responsive-navbar-nav"
//           onClick={() => {
//             updateExpanded(expand ? false : "expanded");
//           }}
//         >
//           <span></span>
//           <span></span>
//           <span></span>
//         </Navbar.Toggle>
//         <Navbar.Collapse id="responsive-navbar-nav">
//           <Nav className="ms-auto" defaultActiveKey="#home">
//             <Nav.Item>
//               <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
//                 <AiOutlineHome style={{ marginBottom: "2px" }} /> Home
//               </Nav.Link>
//             </Nav.Item>

//             <Nav.Item>
//               <Nav.Link
//                 as={Link}
//                 to={isLoggedIn ? "" : "/login"}
//                 onClick={
//                   isLoggedIn ? handleLogout : () => updateExpanded(false)
//                 }
//               >
//                 <GiSkills style={{ marginBottom: "2px" }} />{" "}
//                 {isLoggedIn ? "Logout" : "Login"}
//               </Nav.Link>
//             </Nav.Item>

//             <Nav.Item>
//               <Nav.Link
//                 as={Link}
//                 to="/download"
//                 onClick={() => updateExpanded(false)}
//               >
//                 <CgFileDocument style={{ marginBottom: "2px" }} /> Download
//               </Nav.Link>
//             </Nav.Item>

//             <Nav.Item>
//               <Nav.Link
//                 as={Link}
//                 to="/contact"
//                 onClick={() => updateExpanded(false)}
//               >
//                 <AiOutlineContacts style={{ marginBottom: "2px" }} /> Contact Us
//               </Nav.Link>
//             </Nav.Item>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default NavBar;
