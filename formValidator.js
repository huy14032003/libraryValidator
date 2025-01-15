function validator(option) {
  function getParent(element, compareValue) {
    while (element.parentElement) {
      if (element.parentElement.matches(compareValue))
        return element.parentElement;
      element = element.parentElement;
    }
  }

  function errorMessage(inputElement, message) {
    var formGroup = getParent(inputElement, option.formGroupSelect);
    if (formGroup) {
      var errorElement = formGroup.querySelector(option.message);
      if (errorElement) {
        errorElement.innerHTML = message; // Hiển thị thông báo lỗi
        inputElement.classList.add("invalid"); // Thêm lớp lỗi vào input
      }
    }
  }

  function clearError(inputElement) {
    var formGroup = getParent(inputElement, option.formGroupSelect);
    if (formGroup) {
      var errorElement = formGroup.querySelector(option.message);
      if (errorElement) {
        errorElement.innerHTML = ""; // Xóa thông báo lỗi
        inputElement.classList.remove("invalid"); // Loại bỏ lớp lỗi khỏi input
      }
    }
  }

  var rules = {
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
      var compareInput = document.getElementById(compareValue); // Lấy đối tượng DOM từ ID
      return value === compareInput.value ? "" : "Giá trị không khớp."; // So sánh giá trị
    },
  };

  function validate(input) {
    var idrule = input.dataset.rule ? input.dataset.rule.split(",") : [];
    var error = "";
    idrule.forEach(function (rule) {
      var [ruleName, ...params] = rule.split(":");
      if (error) return; // Nếu đã có lỗi, không cần kiểm tra thêm
      if (rules[ruleName]) error = rules[ruleName](input.value, ...params);
    });
    if (error) {
      errorMessage(input, error);
      return false;
    } else {
      clearError(input);
      return true;
    }
  }

  var formElement = document.querySelector(option.form);
  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault(); // Ngừng hành động mặc định của form (submit)

      // Kiểm tra tất cả các input trong form
      formElement.querySelectorAll("input, select").forEach(function (input) {
        validate(input); // Gọi validate cho từng input
      });
    };

    // Lắng nghe sự kiện oninput cho tất cả các input và select
    formElement.querySelectorAll("input, select").forEach(function (input) {
      input.oninput = function () {
        validate(input);
        // Gọi validate khi người dùng nhập vào trường
      };
    });
    formElement.querySelectorAll("input, select").forEach(function (input) {
      input.onblur = function () {
        validate(input); // Gọi validate khi người dùng nhập vào trường
      };
    });
  }
}
