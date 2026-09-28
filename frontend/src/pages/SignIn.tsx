import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <h1>KrishiSetu</h1>
          <p>Agricultural Intelligence Platform</p>
        </div>

        <div className="login-heading">
          <h2>Log In</h2>
          <p>Enter your account details to continue.</p>
        </div>

        <form onSubmit={handleSignIn} className="login-form">
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
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit">
            Log In
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

export default SignIn;