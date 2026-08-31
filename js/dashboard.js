// =====================================================
// NEXA HR - DASHBOARD
// =====================================================


let allEmployees = [];

let departmentChart = null;



// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);



async function initializeDashboard() {

    displayCurrentDate();

    loadLoggedInUser();

    setupLogout();

    await loadDashboardData();

}



// =====================================================
// LOAD DASHBOARD DATA
// =====================================================

async function loadDashboardData() {

    try {

        showLoadingState();


        allEmployees =
            await getEmployees();


        if (!Array.isArray(allEmployees)) {

            allEmployees = [];
        }


        console.log(
            "Employees loaded:",
            allEmployees
        );


        updateStatistics(
            allEmployees
        );


        updateDepartmentChart(
            allEmployees
        );


        updateRecentEmployees(
            allEmployees
        );


        updateDepartmentSummary(
            allEmployees
        );


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );


        showDashboardError(
            error.message
        );

    }

}



// =====================================================
// STATISTICS
// =====================================================

function updateStatistics(employees) {


    // TOTAL

    const total =
        employees.length;


    document.getElementById(
        "totalEmployees"
    ).textContent = total;



    // PERMANENT

    const permanent =
        employees.filter(
            employee =>
                String(
                    employee.employeeType || ""
                )
                .toLowerCase()
                === "permanent"
        ).length;


    document.getElementById(
        "permanentEmployees"
    ).textContent = permanent;



    // HR

    const hr =
        employees.filter(
            employee =>
                String(
                    employee.employeeType || ""
                )
                .toLowerCase()
                === "hr"
        ).length;


    document.getElementById(
        "hrEmployees"
    ).textContent = hr;



    // TOTAL SALARY

    const totalSalary =
        employees.reduce(
            (total, employee) => {

                return total +
                    (Number(
                        employee.salary
                    ) || 0);

            },
            0
        );


    document.getElementById(
        "totalSalary"
    ).textContent =
        "LKR " +
        formatSalary(totalSalary);

}



// =====================================================
// DEPARTMENT DATA
// =====================================================

function getDepartmentCounts(employees) {

    const departments = {};


    employees.forEach(
        employee => {

            const department =
                employee.departmentName ||
                "Unknown";


            if (!departments[department]) {

                departments[department] = 0;
            }


            departments[department]++;

        }
    );


    return departments;

}



// =====================================================
// DEPARTMENT CHART
// =====================================================

function updateDepartmentChart(
    employees
) {

    const counts =
        getDepartmentCounts(
            employees
        );


    const labels =
        Object.keys(counts);


    const values =
        Object.values(counts);


    const canvas =
        document.getElementById(
            "departmentChart"
        );


    if (!canvas) {

        return;
    }


    if (departmentChart) {

        departmentChart.destroy();
    }


    departmentChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: labels,

                    datasets: [

                        {
                            data: values,

                            borderWidth: 0,

                            backgroundColor: [
                                "#635bff",
                                "#8b5cf6",
                                "#16a34a",
                                "#ea8b00",
                                "#1684e8",
                                "#ec4899"
                            ]

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "68%",

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                usePointStyle: true,

                                padding: 18,

                                font: {
                                    size: 11
                                }

                            }

                        }

                    }

                }

            }
        );

}



// =====================================================
// RECENT EMPLOYEES
// =====================================================

function updateRecentEmployees(
    employees
) {

    const container =
        document.getElementById(
            "recentEmployees"
        );


    if (!container) {

        return;
    }


    if (!employees.length) {

        container.innerHTML = `
            <div class="loading-state">
                <i class="bi bi-people fs-2"></i>
                <div class="mt-2">
                    No employees found.
                </div>
            </div>
        `;

        return;
    }


    const sorted =
        [...employees]
        .sort(
            (a, b) =>
                new Date(
                    b.dateOfJoining || 0
                ) -
                new Date(
                    a.dateOfJoining || 0
                )
        )
        .slice(0, 5);


    container.innerHTML =
        sorted
        .map(employee => {

            const name =
                employee.fullName?.trim()
                || "Unnamed Employee";


            const initials =
                getInitials(name);


            return `

                <div class="employee-row">

                    <div class="employee-avatar">

                        ${initials}

                    </div>


                    <div class="employee-info">

                        <strong>
                            ${escapeHTML(name)}
                        </strong>

                        <span>
                            ${
                                escapeHTML(
                                    employee.designationName
                                    || "Employee"
                                )
                            }
                        </span>

                    </div>


                    <div class="employee-salary">

                        ${
                            employee.salary
                                ? "LKR " +
                                  formatSalary(
                                      employee.salary
                                  )
                                : "-"
                        }

                    </div>

                </div>

            `;

        })
        .join("");

}



// =====================================================
// DEPARTMENT SUMMARY
// =====================================================

function updateDepartmentSummary(
    employees
) {

    const container =
        document.getElementById(
            "departmentSummary"
        );


    if (!container) {

        return;
    }


    const counts =
        getDepartmentCounts(
            employees
        );


    const total =
        employees.length;


    if (!Object.keys(counts).length) {

        container.innerHTML = `
            <div class="col-12 text-center text-muted">
                No department data available.
            </div>
        `;

        return;
    }


    container.innerHTML =
        Object.entries(counts)
        .map(
            ([department, count]) => {

                const percentage =
                    total
                        ? Math.round(
                            (count / total) *
                            100
                        )
                        : 0;


                return `

                    <div class="col-md-6 col-xl-3">

                        <div
                            style="
                                padding:18px;
                                border:1px solid #eeeef4;
                                border-radius:12px;
                            "
                        >

                            <div
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    margin-bottom:10px;
                                "
                            >

                                <strong
                                    style="
                                        font-size:13px;
                                    "
                                >

                                    ${escapeHTML(
                                        department
                                    )}

                                </strong>


                                <span
                                    style="
                                        font-size:12px;
                                        color:#635bff;
                                        font-weight:700;
                                    "
                                >

                                    ${count}

                                </span>

                            </div>


                            <div
                                style="
                                    height:6px;
                                    background:#f0f0f5;
                                    border-radius:10px;
                                    overflow:hidden;
                                "
                            >

                                <div
                                    style="
                                        width:${percentage}%;
                                        height:100%;
                                        background:#635bff;
                                        border-radius:10px;
                                    "
                                >
                                </div>

                            </div>


                            <small
                                style="
                                    display:block;
                                    margin-top:8px;
                                    color:#999;
                                    font-size:10px;
                                "
                            >

                                ${percentage}% of workforce

                            </small>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}



// =====================================================
// DATE
// =====================================================

function displayCurrentDate() {

    const element =
        document.getElementById(
            "currentDate"
        );


    if (!element) {

        return;
    }


    element.textContent =
        new Date().toLocaleDateString(
            "en-LK",
            {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}



// =====================================================
// USER
// =====================================================

function loadLoggedInUser() {

    const user =
        localStorage.getItem(
            "nexaHRUser"
        );


    if (!user) {

        return;
    }


    try {

        const parsed =
            JSON.parse(user);


        const element =
            document.getElementById(
                "userEmail"
            );


        if (
            element &&
            parsed.email
        ) {

            element.textContent =
                parsed.email;

        }

    } catch (error) {

        console.error(
            "User data error:",
            error
        );

    }

}



// =====================================================
// LOGOUT
// =====================================================

function setupLogout() {

    const button =
        document.getElementById(
            "logoutButton"
        );


    if (!button) {

        return;
    }


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            localStorage.removeItem(
                "nexaHRLoggedIn"
            );


            localStorage.removeItem(
                "nexaHRUser"
            );


            window.location.href =
                "index.html";

        }
    );

}



// =====================================================
// LOADING
// =====================================================

function showLoadingState() {

    document.getElementById(
        "totalEmployees"
    ).textContent = "…";

    document.getElementById(
        "permanentEmployees"
    ).textContent = "…";

    document.getElementById(
        "hrEmployees"
    ).textContent = "…";

    document.getElementById(
        "totalSalary"
    ).textContent = "…";

}



// =====================================================
// ERROR
// =====================================================

function showDashboardError(
    message
) {

    document.getElementById(
        "totalEmployees"
    ).textContent = "!";

    document.getElementById(
        "permanentEmployees"
    ).textContent = "!";

    document.getElementById(
        "hrEmployees"
    ).textContent = "!";

    document.getElementById(
        "totalSalary"
    ).textContent = "!";


    const recent =
        document.getElementById(
            "recentEmployees"
        );


    if (recent) {

        recent.innerHTML = `

            <div class="error-state">

                <i
                    class="bi bi-exclamation-triangle fs-3">
                </i>

                <div class="mt-2">
                    Unable to load employees.
                </div>

                <small>
                    ${escapeHTML(message)}
                </small>

            </div>

        `;

    }

}



// =====================================================
// INITIALS
// =====================================================

function getInitials(name) {

    if (!name) {

        return "?";
    }


    const words =
        name
            .trim()
            .split(/\s+/);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}



// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}