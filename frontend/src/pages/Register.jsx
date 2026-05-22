import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";

import { User, Eye, EyeOff } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const onUserRegister = async (newUser) => {
    setLoading(true);
    setError(null);

    try {
      const url = "/patient-api/register";

      const userObj = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        phoneNumber: newUser.phoneNumber,
      };

      const res = await axios.post(url, userObj);

      if (res.status === 201 || res.status === 200) {
        toast.success("Registration successful");
        navigate("/login");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed (check backend)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex justify-center items-center px-5 py-16">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <User className="text-blue-600" size={34} />
          </div>

          <h2 className="text-4xl font-extrabold">Register Patient</h2>
          <p className="text-gray-500 mt-3">Create an account to book appointments</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl text-sm mb-5">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit(onUserRegister)} className="space-y-5">

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-4 border rounded-xl bg-gray-50"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 border rounded-xl bg-gray-50"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-4 border rounded-xl bg-gray-50"
              {...register("password", { required: "Password is required" })}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* PHONE */}
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-4 border rounded-xl bg-gray-50"
            {...register("phoneNumber", { required: "Phone is required" })}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center mt-6 text-gray-500">
          Already have account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;