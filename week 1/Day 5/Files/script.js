const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");
const imageInput = document.getElementById("profileImage");
const preview = document.getElementById("imagePreview");

const cityData = {
  Pakistan: ["Islamabad", "Karachi", "Lahore"],
  USA: ["New York", "Los Angeles", "Chicago"],
  UK: ["London", "Manchester", "Birmingham"],
};

countrySelect.addEventListener("change", (e) => {
  const country = e.target.value;
  citySelect.innerHTML = '<option value="">Select City</option>';

  if (country) {
    citySelect.disabled = false;
    cityData[country].forEach((city) => {
      const opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  } else {
    citySelect.disabled = true;
  }
  validateForm();
});

imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `<img src="${e.target.result}">`;
      localStorage.setItem("temp_img", e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

const validateForm = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const dob = document.getElementById("dob").value;
  const phone = document.getElementById("phone").value;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPassValid = pass.length >= 8 && /\d/.test(pass);
  const isphoneValid = /^\+?\d{10,11}$/.test(phone);
  let isAdult = false;
  if (dob) {
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    isAdult = age >= 18;
  }

  document.getElementById("emailError").textContent =
    isEmailValid || !email ? "" : "Invalid email format";
  document.getElementById("passwordError").textContent =
    isPassValid || !pass ? "" : "Min 8 chars + 1 number";
  document.getElementById("phoneError").textContent =
    isphoneValid || !phone ? "" : "Invalid phone number";
  document.getElementById("dobError").textContent =
    isAdult || !dob ? "" : "Must be 18+ years old";

  const isValid =
    isEmailValid &&
    isPassValid &&
    isAdult &&
    form.fullName.value &&
    countrySelect.value &&
    citySelect.value;

  submitBtn.disabled = !isValid;

  saveProgress();
};

const saveProgress = () => {
  const formData = {
    name: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    country: countrySelect.value,
    dob: document.getElementById("dob").value,
  };
  localStorage.setItem("reg_progress", JSON.stringify(formData));
};

const loadProgress = () => {
  const saved = JSON.parse(localStorage.getItem("reg_progress"));
  const savedImg = localStorage.getItem("temp_img");

  if (saved) {
    document.getElementById("fullName").value = saved.name || "";
    document.getElementById("email").value = saved.email || "";
    document.getElementById("dob").value = saved.dob || "";
    countrySelect.value = saved.country || "";
    if (saved.country) countrySelect.dispatchEvent(new Event("change"));
  }
  if (savedImg) {
    preview.innerHTML = `<img src="${savedImg}">`;
  }
  validateForm();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const finalData = {
    name: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    location: `${citySelect.value}, ${countrySelect.value}`,
    dob: document.getElementById("dob").value,
  };

  localStorage.setItem("final_user", JSON.stringify(finalData));

  document.getElementById("summaryData").innerHTML = `
        <p><strong>Name:</strong> ${finalData.name}</p>
        <p><strong>Email:</strong> ${finalData.email}</p>
        <p><strong>Location:</strong> ${finalData.location}</p>
        <p><strong>DOB:</strong> ${finalData.dob}</p>
    `;
  document.getElementById("summaryModal").style.display = "flex";
});

function closeModal() {
  localStorage.clear();
  location.reload();
}

form.querySelectorAll("input, select").forEach((el) => {
  el.addEventListener("input", validateForm);
});

window.onload = loadProgress;
