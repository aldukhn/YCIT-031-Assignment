import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Head from "next/head";

function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const createUser = async (data) => {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push("/login");
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-700">
        Register
      </h1>
      <form onSubmit={handleSubmit(createUser)}>
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
          type="text"
          placeholder="Role"
          {...register("role", { required: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="submit"
          value="Register"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 focus:outline-none"
        />
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default RegisterPage;
