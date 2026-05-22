import { useForm } from "react-hook-form";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../store/authStore";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const error = useAuth((state) => state.error);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // login submit
  const onUserLogin = async (data) => {
    await login(data);
  };

  // PATIENT ROUTING
  const handlePatientRouting = useCallback(async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        "http://localhost:4000/patient-api/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.payload) {
        navigate("/patient-dashboard", { replace: true });
      } else {
        navigate("/patient-profile", { replace: true });
      }
    } catch {
      navigate("/patient-profile", { replace: true });
    }
  }, [navigate]);

  // DOCTOR ROUTING (FIXED)
  const handleDoctorRouting = useCallback(async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      navigate("/doctor-form", { replace: true });
      return;
    }
  
    try {
      const res = await axios.get(
        "http://localhost:4000/doctor-api/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const doctor = res.data?.payload;
  
      // 👇 KEY LOGIC
      if (doctor && doctor._id) {
        navigate("/doctor-dashboard", { replace: true });
      } else {
        navigate("/doctor-form", { replace: true });
      }
  
    } catch {
      // ANY ERROR = treat as new doctor
      navigate("/doctor-form", { replace: true });
    }
  }, [navigate]);

  // MAIN REDIRECT LOGIC
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    toast.success("Login successful");

    if (currentUser.role === "DOCTOR") {
      handleDoctorRouting(); 
    } 
    else if (currentUser.role === "PATIENT") {
      handlePatientRouting();
    } 
    else if (currentUser.role === "ADMIN") {
      navigate("/admin-dashboard", { replace: true });
    }

  }, [isAuthenticated, currentUser, handleDoctorRouting, handlePatientRouting, navigate]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex justify-center items-center px-5 py-16">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Lock className="text-blue-600" size={34} />
          </div>

          <h2 className="text-4xl font-bold">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Login to continue</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl text-sm mb-5">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit(onUserLogin)} className="space-y-6">

          {/* EMAIL */}
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-gray-50"
                {...register("email", { required: "Email required" })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-12 pr-14 py-4 rounded-2xl border bg-gray-50"
                {...register("password", { required: "Password required" })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* BUTTON */}
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold">
            Login
          </button>
        </form>

        {/* FOOTER */}
        <div className="text-center mt-6">
          <p className="text-gray-500">
            New user?{" "}
            <Link to="/register" className="text-blue-600 font-semibold">
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;