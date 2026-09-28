import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <h1>KrishiSetu</h1>
          <p>Agricultural Intelligence Platform</p>
        </div>

        <div className="login-heading">
          <h2>Welcome to KrishiSetu</h2>
          <p>
            Access agricultural intelligence and manage your farm insights.
          </p>
        </div>

        <div className="auth-options">
          <button
            type="button"
            className="auth-option primary"
            onClick={() => navigate("/signin")}
          >
            <strong>Log In</strong>
            <span>Already have an account?</span>
          </button>

          <button
            type="button"
            className="auth-option secondary"
            onClick={() => navigate("/signup")}
          >
            <strong>Sign Up</strong>
            <span>New to KrishiSetu?</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default Login;