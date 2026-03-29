import Swal from "sweetalert2";

const Alert = {
  // Error alert
  error: (title = "Oops...", text = "Something went wrong!") => {
    return Swal.fire({
      icon: "error",
      title,
      text,
      showConfirmButton: true,
    });
  },

  success: (title = "Success!", text = "Operation completed successfully!") => {
    return Swal.fire({
      icon: "success",
      title,
      text,
      showConfirmButton: true,
    });
  },
};

export default Alert;
