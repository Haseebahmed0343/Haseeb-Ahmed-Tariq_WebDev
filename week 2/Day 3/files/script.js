let allUsers = [];
const userGrid = document.getElementById("user-grid");
const searchInput = document.getElementById("search-input");
const messageArea = document.getElementById("message-area");

async function fetchUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error("Failed to fetch users");

    const data = await response.json();
    allUsers = data
      .filter((u) => parseFloat(u.address.geo.lat) < 0)
      .sort((a, b) => a.name.localeCompare(b.name));

    renderUsers(allUsers);
  } catch (err) {
    messageArea.innerHTML = `<p class="error">${err.message}</p>`;
  }
}

function renderUsers(users) {
  userGrid.innerHTML = "";
  messageArea.innerHTML = "";

  if (users.length === 0) {
    userGrid.innerHTML = '<p class="no-results">No users found</p>';
    return;
  }

  users.forEach((user) => {
    const isSpecial = user.address.zipcode.startsWith("5");
    const card = document.createElement("div");
    card.className = `card ${isSpecial ? "special-zip" : ""}`;

    card.innerHTML = `
                <h3>${user.name}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>City:</strong> ${user.address.city}</p>
                <button class="btn" onclick="toggleDetails(${user.id})">Show Details</button>
                <div id="details-${user.id}" class="details">
                    <p><strong>Full Address:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city}</p>
                    <p><em>"${user.company.catchPhrase}"</em></p>
                </div>
            `;
    userGrid.appendChild(card);
  });
}

function toggleDetails(userId) {
  const allDetails = document.querySelectorAll(".details");
  const target = document.getElementById(`details-${userId}`);
  const isAlreadyOpen = target.classList.contains("active");

  allDetails.forEach((el) => el.classList.remove("active"));

  if (!isAlreadyOpen) {
    target.classList.add("active");
  }
}

searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term),
  );
  renderUsers(filtered);
});

fetchUsers();
