"use client";

import { useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider"; // Import hook
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInMock } = useAuth(); // Get the mock function

  async function handleLogin() {
    setLoading(true);
    
    // Simulate a short delay so it feels like an app
    setTimeout(() => {
        signInMock(email || "demo@user.com"); // Log in immediately!
        setLoading(false);
    }, 800); 
  }

  return (
    <div className="max-w-sm mx-auto p-8 border rounded-xl shadow-lg bg-white mt-20">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-sm text-gray-500">Dev Mode: Enter any email to enter.</p>
      </div>

      <div className="space-y-4">
        <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
                className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In (No Password)"}
        </Button>
      </div>
    </div>
  );
}