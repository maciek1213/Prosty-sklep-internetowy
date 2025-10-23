import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface Props {
  onLogin: (token: string) => void;
}
function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      const { token } = response.data;
      onLogin(token);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => {
            navigate("/");
          }}
        ></button>
      </div>
      <h2 className="display-5">Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <div className="mt-3">
        Don't have an account yet?{" "}
        <a href="/register" className="link-primary">
          Register here
        </a>
      </div>
    </div>
  );
}

export default LoginPage;
