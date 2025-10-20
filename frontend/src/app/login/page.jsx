"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { toast } from "sonner";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [code, setCode] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when request starts
    try {
      const result = await login(
        formData.email,
        formData.password,
        show2FA ? code : null
      );

      if (result?.requires2FA) {
        setShow2FA(true);
        toast.info("2FA code sent to email");
        setLoading(false); // Reset loading after 2FA prompt
        return;
      }

      toast.success("Login successful");
      router.push("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false); // Reset loading after request completes
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-4 pb-28 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FaLock className="text-white text-xl" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {show2FA ? "Verify Code" : "Welcome Back"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {show2FA
                ? "Enter the code sent to your email"
                : "Sign in to your account"}
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleLogin}
            className="space-y-6"
          >
            {!show2FA ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  2FA Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full text-center text-2xl tracking-widest px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="000000"
                  required
                  maxLength={6}
                />
              </div>
            )}

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium transition-all duration-200 ease-in-out shadow-md flex items-center justify-center ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-blue-600 hover:to-purple-600 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2 text-white" />
                  Loading...
                </>
              ) : show2FA ? (
                "Verify & Login"
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
