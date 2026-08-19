"use client";
import React from "react";
import { useState } from "react";
import type { FormEvent } from "react";
const RegisterUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    setShowErrorModal(false);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, confirmPassword }),
      });

      if (response.ok) {
        alert("User registered successfully");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        return;
      }

      if (response.status === 400) {
        const data = await response.json();
        if (Array.isArray(data.errors)) {
          setErrors(data.errors);
        } else if (typeof data.errors === "string") {
          setErrors([data.errors]);
        } else {
          setErrors(["Validation failed. Please check your input."]);
        }
      } else {
        setErrors(["Something went wrong. Please try again."]);
      }

      setShowErrorModal(true);
    } catch {
      setErrors(["Network error. Please try again."]);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white relative">
      <h1 className="text-3xl font-bold mb-5">Register User</h1>

      <form
        method="POST"
        onSubmit={registerUser}
        className="flex flex-col space-y-6 bg-gray-500 p-8 rounded-lg shadow-md text-center"
      >
        <input
          type="text"
          name="username"
          value={username}
          placeholder="Username"
          className="px-4 py-2 rounded-md text-gray-200 focus-within: outline-none focus-within:bg-gray-900 transition-all delay-50 text-center"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          className="px-4 py-2 rounded-md text-gray-200 focus-within: outline-none focus-within:bg-gray-900 transition-all delay-50 text-center"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          placeholder="Confirm Password"
          className="px-4 py-2 rounded-md text-gray-200 focus-within: outline-none focus-within:bg-gray-900 transition-all delay-50 text-center"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all delay-50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      {showErrorModal && errors.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-errors-title"
            className="w-full max-w-md rounded-lg bg-white p-6 text-gray-900 shadow-xl flex flex-col items-center align-center"
          >
            <h2
              id="register-errors-title"
              className="text-2xl font-semibold mb-1"
            >
              Registration failed
            </h2>
            <div className="list-disc pl-5 space-y-1 mb-6 ">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowErrorModal(false)}
              className="w-[20%] rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterUser;
