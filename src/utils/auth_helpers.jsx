export const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

export const getFriendlyError = (msg) => {
  if (!msg) return "";
  if (msg.includes("auth/invalid-credential"))
    return "Invalid credentials. Please check your email and password.";
  if (msg.includes("auth/wrong-password")) return "Incorrect password.";
  if (msg.includes("auth/user-not-found"))
    return "User not found. Please sign up.";
  return msg;
};
