import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  onLogin: (token: string) => void;
}
function RegisterPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/register", {
        email,
        password,
      });
      const { token } = response.data;
      onLogin(token);
      navigate("/");
    } catch (err) {
      setError("This email is already used");
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
      <h2 className="display-5">Register</h2>
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
          Create account
        </button>
      </form>
      <div className="mt-3">
        Already have an account?{" "}
        <a href="/login" className="link-primary">
          Login here
        </a>
      </div>
    </div>
  );
}

export default RegisterPage;
