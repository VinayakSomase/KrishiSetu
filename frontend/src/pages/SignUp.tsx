import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/signin");
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <h1>KrishiSetu</h1>
          <p>Agricultural Intelligence Platform</p>
        </div>

        <div className="login-heading">
          <h2>Create Account</h2>
          <p>Set up your KrishiSetu account to get started.</p>
        </div>

        <form onSubmit={handleSignUp} className="login-form">
          <label>
            Full Name
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit">
            Create Account
          </button>
        </form>

        <button
          type="button"
          className="login-demo-button"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
      </section>
    </main>
  );
}

export default SignUp;