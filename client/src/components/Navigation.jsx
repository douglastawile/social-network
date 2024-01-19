import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav>
      <Link to={"/"}>Home</Link> {" | "}
      <Link to={"/users"}>Users</Link> {" | "}
      <Link to={"/auth/signup"}>Signup</Link> {" | "}
      <Link to={"/auth/signin"}>Signin</Link> {" | "}
    </nav>
  );
}
