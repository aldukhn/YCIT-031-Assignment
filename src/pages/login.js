import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "../components/Navbar";
import "tailwindcss/tailwind.css";
import Head from "next/head";

function LoginPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const authenticateUser = async (data) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("Login successful. Redirecting to home page...");
      window.location.href = "/";
    } else {
      // If login failed, display error message
      console.log("Login failed. Error message: ", await response.text());
      const errorData = await response.json();
      setErrorMessage(errorData.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>Login </title>
      </Head>
      <Navbar />
      <br />
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-700">
        Login
      </h1>
      <form onSubmit={handleSubmit(authenticateUser)}>
        <input
          type="text"
          placeholder="Username"
          {...register("username", { required: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="submit"
          value="Login"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 focus:outline-none"
        />
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default LoginPage;
