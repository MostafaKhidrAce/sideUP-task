import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginForm {
  username: string;
  password: string;
}

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      username: "sideup",
      password: "sideup",
    },
  });
  const navigate = useNavigate();

  const onSubmit = (data: LoginForm) => {
    if (data.username === "sideup" && data.password === "sideup") {
      toast.success("Login successful!");
      setTimeout(() => {
        onLogin();
        navigate("/dashboard");
      }, 1000);
    } else {
      toast.error("Invalid credentials. Try again! ❌");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnHover
      />
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8 max-w-sm w-full">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              {...register("username")}
              placeholder="Enter your username"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Default credentials: <strong>Username: sideup</strong> |{" "}
          <strong>Password: sideup</strong>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
