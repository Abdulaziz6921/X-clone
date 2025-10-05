import { useState, useEffect } from "react";

export const useAuthForm = (onSubmit) => {
  const [form, setForm] = useState({
    isLogin: true,
    displayName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleMode = () => setForm((f) => ({ ...f, isLogin: !f.isLogin }));
  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    form,
    setForm,
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
  };
};
