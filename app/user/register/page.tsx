"use client";
import React from "react";
import { useState } from "react";
import FormEvent from "react";
const RegisterUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      alert("User registered successfully");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-5">Register User</h1>
      <form
        action="POST"
        onSubmit={registerUser}
        className="flex flex-col space-y-6 bg-gray-500 p-8 rounded-lg shadow-md text-center"
      >
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="px-4 py-2 rounded-md text-gray-200 focus-within: outline-none focus-within:bg-gray-900 transition-all delay-50 text-center"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="px-4 py-2 rounded-md text-gray-200 focus-within: outline-none focus-within:bg-gray-900 transition-all delay-50 text-center"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="px-4 py-2 rounded-md text-gray-200 focus-within: outline-none focus-within:bg-gray-900 transition-all delay-50 text-center"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all delay-50"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;
