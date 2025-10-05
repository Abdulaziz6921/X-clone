// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Twitter } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";

// const Auth = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [displayName, setDisplayName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordTouched, setPasswordTouched] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const { signIn, signUp, signInWithGoogle } = useAuth();
//   const navigate = useNavigate();

//   const isStrongPassword = (password) => {
//     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
//   };

//   const getFriendlyError = (msg) => {
//     if (msg.includes("auth/invalid-credential"))
//       return "Account not found or credentials are invalid. Please check your email and password, or sign up.";
//     if (msg.includes("auth/wrong-password")) return "Incorrect password.";
//     if (msg.includes("auth/user-not-found"))
//       return "User not found. Please sign up.";
//     return msg;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       if (isLogin) {
//         await signIn(email, password);
//       } else {
//         if (!isStrongPassword(password)) {
//           setError(
//             "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
//           );
//           setLoading(false);
//           return;
//         }
//         await signUp(email, password, displayName);
//       }
//       navigate("/");
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleShow = () => setShowPassword((prev) => !prev);

//   const handleGoogleSignIn = async () => {
//     setError("");
//     setLoading(true);

//     try {
//       await signInWithGoogle();
//       navigate("/");
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(""), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   return (
//     <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center px-4">
//       <div className="max-w-md w-full">
//         <div className="text-center mb-8">
//           <Twitter className="h-12 w-12 text-twitter-blue mx-auto mb-4" />
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
//             {isLogin ? "Sign in to Twitter" : "Join Twitter today"}
//           </h1>
//           <p className="text-gray-500 dark:text-dark-text-secondary">
//             {isLogin
//               ? "Welcome back! Please sign in to your account."
//               : "Create your account and start tweeting."}
//           </p>
//         </div>

//         {error && (
//           <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
//             <p className="text-red-600 dark:text-red-400 text-sm">
//               {getFriendlyError(error)}
//             </p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4 mb-6">
//           {!isLogin && (
//             <div>
//               <label
//                 htmlFor="displayName"
//                 className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2"
//               >
//                 Display Name
//               </label>
//               <input
//                 id="displayName"
//                 type="text"
//                 value={displayName}
//                 onChange={(e) => setDisplayName(e.target.value)}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-twitter-blue focus:border-transparent bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text"
//                 placeholder="Enter your display name"
//               />
//             </div>
//           )}

//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2"
//             >
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               autoComplete="username"
//               className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-twitter-blue focus:border-transparent bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text"
//               placeholder="Enter your email"
//             />
//           </div>

//           <div className="relative w-full  mx-auto mt-10 ">
//             {/* Label */}
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2"
//             >
//               Password
//             </label>

//             <div className="relative">
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onBlur={() => setPasswordTouched(true)}
//                 required
//                 autoComplete="current-user"
//                 className="w-full px-4 py-3 pr-16 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                 placeholder="Enter your password"
//               />
//               <button
//                 type="button"
//                 onClick={toggleShow}
//                 className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 md:text-2xl text-xl"
//               >
//                 {showPassword ? (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     xmlnsXlink="http://www.w3.org/1999/xlink"
//                     width="27px"
//                     height="27px"
//                     viewBox="0 0 64 64"
//                     aria-hidden="true"
//                     role="img"
//                     className="iconify iconify--emojione"
//                     preserveAspectRatio="xMidYMid meet"
//                   >
//                     <ellipse
//                       cx="53.7"
//                       cy="33"
//                       rx="8.3"
//                       ry="8.2"
//                       fill="#89664c"
//                     />
//                     <circle cx="53.7" cy="33" fill="#ffc5d3" r="5.4" />
//                     <circle cx="10.2" cy="33" fill="#89664c" r="8.2" />
//                     <circle cx="10.2" cy="33" fill="#ffc5d3" r="5.4" />
//                     <g fill="#89664c">
//                       <path d="M43.4 10.8c1.1-.6 1.9-.9 1.9-.9c-3.2-1.1-6-1.8-8.5-2.1c1.3-1 2.1-1.3 2.1-1.3C18.5 3.6 8.8 15.5 8.8 26h46.4c-.7-7.4-4.8-12.4-11.8-15.2" />
//                       <path d="M55.3 27.6C55.3 17.9 44.9 10 32 10S8.7 17.9 8.7 27.6c0 2.3.6 4.4 1.6 6.4c-1 2-1.6 4.2-1.6 6.4C8.7 50.1 19.1 58 32 58s23.3-7.9 23.3-17.6c0-2.3-.6-4.4-1.6-6.4c1-2 1.6-4.2 1.6-6.4" />
//                     </g>
//                     <path
//                       d="M52 28.2c0-16.9-20-6.1-20-6.1s-20-10.8-20 6.1c0 4.7 2.9 9 7.5 11.7c-1.3 1.7-2.1 3.6-2.1 5.7c0 6.1 6.6 11 14.7 11s14.7-4.9 14.7-11c0-2.1-.8-4-2.1-5.7c4.4-2.7 7.3-7 7.3-11.7"
//                       fill="#e0ac7e"
//                     />
//                     <g fill="#3b302a">
//                       <path d="M35.1 38.7c0 1.1-.4 2.1-1 2.1s-1-.9-1-2.1c0-1.1.4-2.1 1-2.1c.6.1 1 1 1 2.1" />
//                       <path d="M30.9 38.7c0 1.1-.4 2.1-1 2.1s-1-.9-1-2.1c0-1.1.4-2.1 1-2.1c.5.1 1 1 1 2.1" />
//                       <ellipse cx="40.7" cy="31.7" rx="3.5" ry="4.5" />
//                       <ellipse cx="23.3" cy="31.7" rx="3.5" ry="4.5" />
//                       <path d="M41.8 44.5c1.4 1.2-2.9 6.9-9.8 7c-6.9 0-11.3-5.8-9.8-7c.4-.3 5.2.9 9.8.9c4.7 0 9.5-1.2 9.8-.9" />
//                     </g>
//                   </svg>
//                 ) : (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     xmlnsXlink="http://www.w3.org/1999/xlink"
//                     width="27px"
//                     height="27px"
//                     viewBox="0 0 64 64"
//                     aria-hidden="true"
//                     role="img"
//                     className="iconify iconify--emojione"
//                     preserveAspectRatio="xMidYMid meet"
//                   >
//                     <circle cx="53.8" cy="33" fill="#89664c" r="8.2" />
//                     <circle cx="53.8" cy="33" fill="#ffc5d3" r="5.4" />
//                     <circle cx="10.2" cy="33" fill="#89664c" r="8.2" />
//                     <circle cx="10.2" cy="33" fill="#ffc5d3" r="5.4" />

//                     <g fill="#89664c">
//                       <path d="M43.4 10.8c1.1-.6 1.9-.9 1.9-.9c-3.2-1.1-6-1.8-8.5-2.1c1.3-1 2.1-1.3 2.1-1.3C18.5 3.6 8.8 15.5 8.8 26h46.4c-.7-7.4-4.8-12.4-11.8-15.2" />
//                       <path d="M55.3 27.6C55.3 17.9 44.9 10 32 10S8.7 17.9 8.7 27.6c0 2.3.6 4.4 1.6 6.4c-1 2-1.6 4.2-1.6 6.4C8.7 50.1 19.1 58 32 58s23.3-7.9 23.3-17.6c0-2.3-.6-4.4-1.6-6.4c1-2 1.6-4.2 1.6-6.4" />
//                     </g>

//                     <path
//                       d="M52 28.2c0-16.9-20-6.1-20-6.1s-20-10.8-20 6.1c0 4.7 2.9 9 7.5 11.7c-1.3 1.7-2.1 3.6-2.1 5.7c0 6.1 6.6 11 14.7 11s14.7-4.9 14.7-11c0-2.1-.8-4-2.1-5.7c4.4-2.7 7.3-7 7.3-11.7"
//                       fill="#e0ac7e"
//                     />

//                     <g fill="#3b302a">
//                       <path d="M35.1 38.7c0 1.1-.4 2.1-1 2.1s-1-.9-1-2.1c0-1.1.4-2.1 1-2.1s1 1 1 2.1" />
//                       <path d="M30.9 38.7c0 1.1-.4 2.1-1 2.1s-1-.9-1-2.1c0-1.1.4-2.1 1-2.1s1 1 1 2.1" />
//                       <ellipse
//                         transform="rotate(-16.096 37 48.044)"
//                         cx="37"
//                         cy="48"
//                         rx="4.5"
//                         ry="2.7"
//                       />
//                     </g>

//                     <path
//                       d="M9.3 32.6L2 62h11.9c-1.6-7.7 4-21 4-21l-8.6-8.4z"
//                       fill="#89664c"
//                     />
//                     <path
//                       d="M15.7 24.9s4.9-4.5 9.5-3.9c2.3.3-7.1 7.6-7.1 7.6s9.7-8.2 11.7-5.6c1.8 2.3-8.9 9.8-8.9 9.8s10-8.1 9.6-4.6C30.2 32 22.6 41 18 42c-6.6 1.3-11.8-2.9-8.3-17.5c1.8-7.4 3.5.8 6 .4"
//                       fill="#ffd6bb"
//                     />

//                     <path
//                       d="M54.7 32.6L62 62H50.1c1.6-7.7-4-21-4-21l8.6-8.4z"
//                       fill="#89664c"
//                     />
//                     <path
//                       d="M48.3 24.9s-4.9-4.5-9.5-3.9c-2.3.3 7.1 7.6 7.1 7.6s-9.7-8.2-11.7-5.6c-1.8 2.3 8.9 9.8 8.9 9.8s-10-8.1-9.7-4.6C33.8 32 41.4 41 46 42c6.6 1.3 11.8-2.9 8.3-17.5c-1.8-7.4-3.5.8-6 .4"
//                       fill="#ffd6bb"
//                     />
//                   </svg>
//                 )}
//               </button>
//             </div>
//             {!isLogin && passwordTouched && (
//               <ul className="text-xs text-gray-600 dark:text-dark-text-secondary mt-2 space-y-1">
//                 <li
//                   className={
//                     /.{8,}/.test(password) ? "text-green-600" : "text-red-500"
//                   }
//                 >
//                   • At least 8 characters
//                 </li>
//                 <li
//                   className={
//                     /[a-z]/.test(password) ? "text-green-600" : "text-red-500"
//                   }
//                 >
//                   • One lowercase letter
//                 </li>
//                 <li
//                   className={
//                     /[A-Z]/.test(password) ? "text-green-600" : "text-red-500"
//                   }
//                 >
//                   • One uppercase letter
//                 </li>
//                 <li
//                   className={
//                     /\d/.test(password) ? "text-green-600" : "text-red-500"
//                   }
//                 >
//                   • One number
//                 </li>
//                 <li
//                   className={
//                     /[\W_]/.test(password) ? "text-green-600" : "text-red-500"
//                   }
//                 >
//                   • One special character
//                 </li>
//               </ul>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-twitter-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-twitter-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
//           </button>
//         </form>

//         {isLogin && (
//           <div className="relative mb-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300 dark:border-dark-border"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white dark:bg-dark-bg text-gray-500 dark:text-dark-text-secondary">
//                 Or continue with
//               </span>
//             </div>
//           </div>
//         )}

//         {isLogin && (
//           <button
//             onClick={handleGoogleSignIn}
//             disabled={loading}
//             className="w-full bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//           >
//             <svg className="w-5 h-5" viewBox="0 0 24 24">
//               <path
//                 fill="#4285F4"
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//               />
//               <path
//                 fill="#34A853"
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//               />
//               <path
//                 fill="#FBBC05"
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//               />
//               <path
//                 fill="#EA4335"
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//               />
//             </svg>

//             <span>Continue with Google</span>
//           </button>
//         )}

//         <div className="text-center mt-6">
//           <p className="text-gray-500 dark:text-dark-text-secondary">
//             {isLogin ? "Don't have an account? " : "Already have an account? "}
//             <button
//               onClick={() => setIsLogin(!isLogin)}
//               className="text-twitter-blue hover:underline font-semibold"
//             >
//               {isLogin ? "Sign up" : "Sign in"}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;
import { useNavigate } from "react-router-dom";
import { Twitter, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAuthForm } from "../hooks/useAuthForm";
import { isStrongPassword, getFriendlyError } from "../utils/auth_helpers";

const Auth = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const {
    form,
    updateField,
    showPassword,
    toggleShowPassword,
    passwordTouched,
    setPasswordTouched,
    loading,
    setLoading,
    error,
    setError,
    toggleMode,
  } = useAuthForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (form.isLogin) {
        await signIn(form.email, form.password);
      } else {
        if (!isStrongPassword(form.password)) {
          setError(
            "Password must include upper, lower, number & special char."
          );
          return;
        }
        await signUp(form.email, form.password, form.displayName);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Twitter className="h-12 w-12 text-twitter-blue mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-dark-text">
            {form.isLogin ? "Sign in to Twitter" : "Join Twitter today"}
          </h1>
          <p className="text-gray-500 dark:text-dark-text-secondary">
            {form.isLogin
              ? "Welcome back! Please sign in to your account."
              : "Create your account and start tweeting."}
          </p>
        </div>

        {error && (
          <p className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm text-center">
            {getFriendlyError(error)}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!form.isLogin && (
            <InputField
              id="displayName"
              label="Display Name"
              value={form.displayName}
              onChange={(e) => updateField("displayName", e.target.value)}
              placeholder="Enter your display name"
              required
            />
          )}

          <InputField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="Enter your email"
            required
          />

          <div className="relative">
            <InputField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute top-9 right-4 text-gray-500"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
            {!form.isLogin && passwordTouched && (
              <PasswordStrength password={form.password} />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-twitter-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-twitter-blue-dark transition disabled:opacity-50"
          >
            {loading ? "Loading..." : form.isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {form.isLogin && (
          <>
            <Divider />
            <GoogleButton onClick={handleGoogleSignIn} disabled={loading} />
          </>
        )}

        <p className="text-center mt-6 text-gray-500 dark:text-dark-text-secondary">
          {form.isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-twitter-blue font-semibold hover:underline"
          >
            {form.isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;

// 🔸 Small Reusable Components
const InputField = ({ label, id, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2"
    >
      {label}
    </label>
    <input
      id={id}
      {...props}
      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg-secondary focus:ring-2 focus:ring-twitter-blue text-gray-900 dark:text-dark-text"
    />
  </div>
);

const Divider = () => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300 dark:border-dark-border"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-white dark:bg-dark-bg text-gray-500 dark:text-dark-text-secondary">
        Or continue with
      </span>
    </div>
  </div>
);

const GoogleButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition flex items-center justify-center space-x-2 disabled:opacity-50"
  >
    <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      className="w-5 h-5"
      alt="Google"
    />
    <span>Continue with Google</span>
  </button>
);

const PasswordStrength = ({ password }) => {
  const rules = [
    { regex: /.{8,}/, label: "At least 8 characters" },
    { regex: /[a-z]/, label: "One lowercase letter" },
    { regex: /[A-Z]/, label: "One uppercase letter" },
    { regex: /\d/, label: "One number" },
    { regex: /[\W_]/, label: "One special character" },
  ];
  return (
    <ul className="text-xs mt-2 space-y-1">
      {rules.map(({ regex, label }) => (
        <li
          key={label}
          className={regex.test(password) ? "text-green-600" : "text-red-500"}
        >
          • {label}
        </li>
      ))}
    </ul>
  );
};
