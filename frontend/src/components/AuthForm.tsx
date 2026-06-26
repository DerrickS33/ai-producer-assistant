import { useState } from "react";
import type { SyntheticEvent } from "react";

type AuthMode = "login" | "register";

type AuthFormProps = {
  onAuthSuccess: (token: string) => void;
};

function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    const { loginUser, registerUser } = await import("../services/auth");

    const response =
      mode === "login"
        ? await loginUser({ email, password })
        : await registerUser({ email, password });

    localStorage.setItem("token", response.access_token);
    onAuthSuccess(response.access_token);
  }

  return (
    <main className="min-h-screen bg-[#080b14] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center">
        <h1 className="mb-3 text-4xl font-bold">AI Producer Assistant</h1>

        <p className="mb-8 text-slate-400">
          {mode === "login"
            ? "Log in to access your saved projects."
            : "Create an account to start saving beat projects."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6"
        >
          <h2 className="mb-6 text-2xl font-semibold">
            {mode === "login" ? "Login" : "Create Account"}
          </h2>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-4 font-semibold transition hover:bg-blue-500"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="mt-4 text-sm text-blue-300 hover:text-blue-200"
          >
            {mode === "login"
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AuthForm;