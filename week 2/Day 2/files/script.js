const drivers = [
  {
    driverId: 1,
    name: "Sameer",
    rides: [
      { fare: 20, rating: 5, completed: true },
      { fare: 15, rating: 2, completed: false },
      { fare: 15, rating: 2, completed: true },
    ],
  },
  {
    driverId: 2,
    name: "Moiz",
    rides: [
      { fare: 25, rating: 4, completed: true },
      { fare: 10, rating: 3, completed: false },
      { fare: 40, rating: 5, completed: true },
      { fare: 20, rating: 5, completed: true },
      { fare: 45, rating: 5, completed: true },
      { fare: 50, rating: 5, completed: true },
    ],
  },
  {
    driverId: 3,
    name: "Awais",
    rides: [
      { fare: 30, rating: 5, completed: false },
      { fare: 5, rating: 4, completed: false },
    ],
  },
  {
    driverId: 4,
    name: "Haider",
    rides: [
      { fare: 30, rating: 5, completed: true },
      { fare: 5, rating: 1, completed: true },
    ],
  },
];

const projects = [
  {
    projectName: "Website Redesign",
    employees: [
      {
        empId: 101,
        name: "Haseeb",
        tasks: [{ taskName: "Coding", hoursWorked: 5, status: "completed" }],
      },
      {
        empId: 102,
        name: "Ali",
        tasks: [{ taskName: "Design", hoursWorked: 8, status: "completed" }],
      },
      {
        empId: 104,
        name: "Zain",
        tasks: [
          { taskName: "Management", hoursWorked: 2, status: "completed" },
        ],
      },
    ],
  },
  {
    projectName: "Mobile App Development",
    employees: [
      {
        empId: 101,
        name: "Haseeb",
        tasks: [{ taskName: "Coding", hoursWorked: 5, status: "incomplete" }],
      },
      {
        empId: 102,
        name: "Ali",
        tasks: [{ taskName: "Design", hoursWorked: 8, status: "completed" }],
      },
    ],
  },
  {
    projectName: "Marketing Campaign",
    employees: [
      {
        empId: 103,
        name: "Zohaib",
        tasks: [
          { taskName: "Lead Generation", hoursWorked: 4, status: "completed" },
        ],
      },
    ],
  },
];

const analyzeDrivers = (data) => {
  const processed = data.map((driver) => {
    const completedRides = driver.rides.filter((r) => r.completed);
    const totalEarnings = completedRides.reduce((sum, r) => sum + r.fare, 0);

    const rawAvg =
      completedRides.length > 0
        ? completedRides.reduce((sum, r) => sum + r.rating, 0) /
          completedRides.length
        : 0;

    return {
      ...driver,
      totalEarnings,
      avgRating: rawAvg.toFixed(1),
      numericRating: rawAvg,
      completedCount: completedRides.length,
    };
  });

  const topEarner = [...processed].sort(
    (a, b) => b.totalEarnings - a.totalEarnings,
  )[0];

  const highPerformers = processed.filter(
    (d) => d.completedCount >= 5 && d.numericRating > 4.5,
  );

  const inactiveDrivers = data
    .filter((d) => d.rides.length > 0 && d.rides.every((r) => !r.completed))
    .map((d) => d.name);

  return {
    all: processed,
    topEarner,
    highPerformers,
    inactiveDrivers,
  };
};

const analyzeProjects = (data) => {
  const HOURLY_RATE = 10;
  const globalEmployeeStats = {};

  const projectInsights = data.map((project) => {
    let projectTotalHours = 0;
    let hasIncompleteEmployee = false;

    const employeeDetails = project.employees.map((emp) => {
      const completedTasks = emp.tasks.filter((t) => t.status === "completed");
      const empHours = completedTasks.reduce(
        (sum, t) => sum + t.hoursWorked,
        0,
      );
      const taskNames = emp.tasks.map((t) => t.taskName).join(", ");

      projectTotalHours += empHours;

      if (completedTasks.length === 0) hasIncompleteEmployee = true;

      if (!globalEmployeeStats[emp.empId]) {
        globalEmployeeStats[emp.empId] = {
          name: emp.name,
          totalHours: 0,
          projects: new Set(),
        };
      }
      globalEmployeeStats[emp.empId].totalHours += empHours;
      globalEmployeeStats[emp.empId].projects.add(project.projectName);

      return { name: emp.name, hours: empHours, taskNames };
    });

    return {
      projectName: project.projectName,
      totalCost: projectTotalHours * HOURLY_RATE,
      hasIncompleteEmployee,
      employeeDetails,
    };
  });

  const mostHardworking = Object.values(globalEmployeeStats).sort(
    (a, b) => b.totalHours - a.totalHours,
  )[0];

  const projectsWithLaggards = projectInsights
    .filter((p) => p.hasIncompleteEmployee)
    .map((p) => p.projectName);

  const multiProjectEmployees = Object.values(globalEmployeeStats)
    .filter((e) => e.projects.size > 1)
    .map((e) => e.name);

  return {
    projectInsights,
    mostHardworking,
    projectsWithLaggards,
    multiProjectEmployees,
  };
};

function renderDrivers() {
  const dashboard = document.getElementById("dashboard");
  const results = analyzeDrivers(drivers);

  dashboard.innerHTML = `
    <div class="card">
        <h3>Top Earner: ${results.topEarner.name}</h3>
        <p>Total: $${results.topEarner.totalEarnings}</p>
        <h4>High Performers (5+ Rides, >4.5 Rating)</h4>
        <p>${
          results.highPerformers.length > 0
            ? results.highPerformers.map((d) => d.name).join(", ")
            : "No drivers meet this criteria yet."
        }
        </p>
        <h4>Inactive Drivers (All rides incomplete)</h4>
        <p>${
          results.inactiveDrivers.length > 0
            ? results.inactiveDrivers.join(", ")
            : "None"
        }</p>
    </div>

    <table>
        <thead>
            <tr><th>Name</th><th>Avg Rating</th><th>Completed</th><th>Total Earned</th></tr>
        </thead>
        <tbody>
            ${results.all
              .map(
                (d) => `
                <tr>
                    <td>${d.name} </td>
                    <td>${d.avgRating}</td>
                    <td>${d.completedCount}</td>
                    <td>$${d.totalEarnings}</td>
                </tr>
            `,
              )
              .join("")}
        </tbody>
    </table>
  `;
}

function renderProjects() {
  const dashboard = document.getElementById("dashboard");
  const results = analyzeProjects(projects);

  let html = `

    <div class="card">
        <p><strong>Most Hardworking:</strong> ${results.mostHardworking ? results.mostHardworking.name : "N/A"} 
           <span class="badge">${results.mostHardworking ? results.mostHardworking.totalHours : 0} hrs</span></p>
        
        <p><strong>Multi-Project Staff:</strong> 
            ${
              results.multiProjectEmployees.length > 0
                ? results.multiProjectEmployees
                    .map((name) => `<span class="tag">${name}</span>`)
                    .join(", ")
                : "None"
            }
        </p>
        
        <p><strong>Projects with Pending Tasks:</strong> 
            ${results.projectsWithLaggards.join(", ") || "None"}
        </p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Project Name</th>
                <th>Employee Name</th>
                <th>Task</th>
                <th>Hours (Completed)</th>
                <th>Project Total Cost</th>
            </tr>
        </thead>
        <tbody>`;
  results.projectInsights.forEach((project) => {
    project.employeeDetails.forEach((emp, index) => {
      html += `
        <tr>
            ${
              index === 0
                ? `<td rowspan="${project.employeeDetails.length}"><strong>${project.projectName}</strong></td>`
                : ""
            }
            <td>${emp.name}</td>
            <td>${emp.taskNames}</td>
            <td>${emp.hours} hrs</td>
            ${
              index === 0
                ? `<td rowspan="${project.employeeDetails.length}">$${project.totalCost}</td>`
                : ""
            }
        </tr>`;
    });
  });

  html += `</tbody></table>`;
  dashboard.innerHTML = html;
}
