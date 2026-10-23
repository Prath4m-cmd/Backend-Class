import { useState } from "react";

// ---- Change this to wherever your backend runs ----
const API_URL = "http://localhost:5000/api/auth";

const css = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  .auth-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
    background: #f3f4f6;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #111827;
  }
  .auth-card {
    width: 100%;
    max-width: 380px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 32px 28px;
  }
  .auth-card h1 { margin: 0 0 4px; font-size: 24px; }
  .auth-card .sub { margin: 0 0 24px; color: #6b7280; font-size: 14px; }
  .field { margin-bottom: 16px; }
  .field label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; }
  .field input {
    width: 100%;
    padding: 10px 12px;
    font-size: 15px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    outline: none;
  }
  .field input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); }
  .field input.invalid { border-color: #dc2626; }
  .error-text { margin: 6px 0 0; font-size: 13px; color: #dc2626; }
  .banner { padding: 10px 12px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; }
  .banner.error { background: #fef2f2; color: #b91c1c; }
  .banner.success { background: #f0fdf4; color: #15803d; }
  .submit {
    width: 100%;
    padding: 11px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    background: #2563eb;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
  }
  .submit:hover:not(:disabled) { background: #1d4ed8; }
  .submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .switch { margin: 20px 0 0; text-align: center; font-size: 14px; color: #6b7280; }
  .switch button {
    background: none; border: 0; padding: 0;
    color: #2563eb; font-size: 14px; font-weight: 600; cursor: pointer;
  }
  .switch button:hover { text-decoration: underline; }
`;

const emptyForm = { name: "", email: "", password: "", confirmPassword: "" };

export default function AuthPage() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // { type: "error" | "success", text }
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function switchMode() {
    setMode(isSignup ? "signin" : "signup");
    setForm(emptyForm);
    setErrors({});
    setMessage(null);
  }

  function validate() {
    const e = {};
    if (isSignup && !form.name.trim()) e.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (isSignup && form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // Shape of the request body your backend will receive
    const payload = isSignup
      ? { name: form.name, email: form.email, password: form.password }
      : { email: form.email, password: form.password };

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${isSignup ? "signup" : "signin"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.message || "Something went wrong." });
        return;
      }

      // TODO: handle what your backend returns, e.g. save a JWT:
      // localStorage.setItem("token", data.token);
      setMessage({
        type: "success",
        text: isSignup ? "Account created. You can sign in now." : "Signed in successfully.",
      });
      if (isSignup) {
        setMode("signin");
        setForm({ ...emptyForm, email: form.email });
      }
    } catch {
      setMessage({ type: "error", text: "Cannot reach the server. Is your backend running?" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="auth-page">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h1>{isSignup ? "Create account" : "Sign in"}</h1>
          <p className="sub">
            {isSignup ? "Fill in your details to get started." : "Enter your email and password."}
          </p>

          {message && <div className={`banner ${message.type}`}>{message.text}</div>}

          {isSignup && (
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "invalid" : ""}
                autoComplete="name"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "invalid" : ""}
              autoComplete="email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? "invalid" : ""}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {isSignup && (
            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "invalid" : ""}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>
          )}

          <button className="submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
          </button>

          <p className="switch">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button type="button" onClick={switchMode}>
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </form>
      </div>
    </>
  );
}
