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

  delete: (text, expectedValue, inputType) => {
    return Swal.fire({
      title: "Confirm Deletion",
      html: `
        <p>${text || "You want to delete this item. This action cannot be undone."}</p>
        <p class="mt-2">
          Please type 
          ( <strong class="text-red-600">${expectedValue}</strong> )
          to confirm.
        </p>
      `,
      icon: "warning",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded shadow cursor-pointer duration-300",
        cancelButton:
          "bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded ml-2 mr-2 cursor-pointer duration-300",
        input:
          "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-400",
        actions: "flex gap-2",
      },
      preConfirm: (inputValue) => {
        if (inputType === "text") {
          if (
            inputValue.trim().toLowerCase() !==
            expectedValue.trim().toLowerCase()
          ) {
            Swal.showValidationMessage(
              `You must type "${expectedValue}" to confirm`,
            );
          }
        } else if (inputType === "number") {
          if (Number(inputValue) !== expectedValue) {
            Swal.showValidationMessage(
              `You must type "${expectedValue}" to confirm`,
            );
          }
        }
        return inputValue;
      },
    });
  },
};

export default Alert;
