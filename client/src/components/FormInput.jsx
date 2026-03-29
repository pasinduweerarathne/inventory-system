import React from "react";

const FormInput = ({
  type = "text", // type of input: text, password, email, number, checkbox, textarea, select, file
  label,
  name,
  placeholder = "",
  options = [], // for select or radio/checkbox group
  register,
  errors,
  required = false,
  multiple = false, // for file or select multiple
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-green-700 font-medium mb-1">{label}</label>
      )}

      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
            errors[name]
              ? "border-red-500 focus:ring-red-400"
              : "border-green-300 focus:ring-green-400"
          }`}
          {...register(name, {
            required: required && `${label || name} is required`,
          })}
        />
      ) : type === "select" ? (
        <select
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
            errors[name]
              ? "border-red-500 focus:ring-red-400"
              : "border-green-300 focus:ring-green-400"
          }`}
          {...register(name, {
            required: required && `${label || name} is required`,
          })}
          multiple={multiple}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "checkbox" || type === "radio" ? (
        <div className="flex flex-col gap-2">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type={type}
                value={opt.value}
                {...register(name, {
                  required: required && `${label || name} is required`,
                })}
                className="accent-green-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
            errors[name]
              ? "border-red-500 focus:ring-red-400"
              : "border-green-300 focus:ring-green-400"
          }`}
          {...register(name, {
            required: required && `${label || name} is required`,
          })}
          multiple={multiple}
        />
      )}

      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default FormInput;
