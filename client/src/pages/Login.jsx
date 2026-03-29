import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "@/store/slices/authSlice";
import Alert from "@/components/Alerts";
import FormInput from "@/components/FormInput";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data));
      if (result.meta.requestStatus === "fulfilled") {
        Alert.success("Login Successful", "Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        Alert.error("Login Failed", result.payload || "Something went wrong");
      }
    } catch (err) {
      Alert.error("Login Failed", "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleSubmit(onSubmit)} className="w-150 p-8">
        <fieldset className="border-2 border-green-500 rounded-xl p-6 relative shadow-md">
          <legend className="text-green-700 px-3 font-bold text-center text-2xl uppercase">
            Login Form
          </legend>

          <FormInput
            label="Username"
            name="username"
            placeholder="Enter username"
            register={register}
            errors={errors}
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            register={register}
            errors={errors}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg mt-4"
          >
            Submit
          </button>
        </fieldset>
      </form>
    </div>
  );
}
