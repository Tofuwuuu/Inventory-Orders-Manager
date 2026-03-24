"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@inventory.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  return (
    <div className="grid min-h-screen place-items-center">
      <form
        className="w-full max-w-sm space-y-3 rounded-lg border bg-white p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/dashboard" });
          if (!res?.ok) setError("Invalid credentials");
          else window.location.href = "/dashboard";
        }}
      >
        <h1 className="text-xl font-semibold">Login</h1>
        <input className="w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded border px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </div>
  );
}
