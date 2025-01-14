// formValidator.js

(function (global) {
  const formValidator = {
    // Hàm hiển thị lỗi
    showError: function (input, message) {
      const formGroup = input.parentElement;
      const errorMessage = formGroup.querySelector(".error-message");
      errorMessage.textContent = message;
      formGroup.classList.add("invalid");
    },

    // Hàm xóa lỗi
    clearError: function (input) {
      const formGroup = input.parentElement;
      const errorMessage = formGroup.querySelector(".error-message");
      errorMessage.textContent = "";
      formGroup.classList.remove("invalid");
    },

    // Các quy tắc kiểm tra
    rules: {
      isRequired: function (value) {
        return value.trim() ? "" : "Trường này không được để trống.";
      },
      isEmail: function (value) {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(value) ? "" : "Email không hợp lệ.";
      },
      minLength: function (value, min) {
        return value.length >= min ? "" : `Phải có ít nhất ${min} ký tự.`;
      },
      isMatch: function (value, compareValue) {
        return value === compareValue ? "" : "Giá trị không khớp.";
      },
    },

    // Hàm kiểm tra
    validateInput: function (input) {
      const id = input.id;
      let error = "";

      if (id === "name") {
        error = this.rules.isRequired(input.value);
      }
      if (id === "email") {
        error =
          this.rules.isRequired(input.value) || this.rules.isEmail(input.value);
      }
      if (id === "pass") {
        error =
          this.rules.isRequired(input.value) ||
          this.rules.minLength(input.value, 6);
      }
      if (id === "cf-pass") {
        const passValue = document.querySelector("#pass").value;
        error =
          this.rules.isRequired(input.value) ||
          this.rules.isMatch(input.value, passValue);
      }

      if (error) {
        this.showError(input, error);
        return false;
      } else {
        this.clearError(input);
        return true;
      }
    },

    // Xử lý khi submit form
    handleSubmit: function (formId) {
      const form = document.querySelector(formId);
      if (!form) return;

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const inputs = form.querySelectorAll("input");
        let isValid = true;

        inputs.forEach((input) => {
          if (!formValidator.validateInput(input)) {
            isValid = false;
          }
        });

        if (isValid) {
          const data = {};
          inputs.forEach((input) => {
            data[input.id] = input.value;
          });
          console.log("Dữ liệu gửi đi:", data);
          alert("Đăng ký thành công!");
        }
      });
    },

    // Xử lý khi người dùng nhập
    handleInput: function (formId) {
      const form = document.querySelector(formId);
      if (!form) return;

      form.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", () => {
          formValidator.validateInput(input);
        });
        input.onblur = function () {
          formValidator.validateInput(input);
        };
      });
    },

    // Hàm khởi tạo (kết nối tất cả các hàm)
    init: function (options) {
      formValidator.handleSubmit(options.formId);
      formValidator.handleInput(options.formId);
    },
  };

  // Xuất thư viện ra global
  global.formValidator = formValidator;
})(window);
