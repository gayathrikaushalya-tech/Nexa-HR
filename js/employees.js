// =====================================================
// NEXA HR - EMPLOYEE DIRECTORY
// =====================================================


let employees = [];

let filteredEmployees = [];

let employeeToDelete = null;



// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeEmployees
);



async function initializeEmployees() {

    setupEvents();

    loadUser();

    await loadEmployees();

}



// =====================================================
// LOAD EMPLOYEES
// =====================================================

async function loadEmployees() {

    showLoading();


    try {

        employees =
            await getEmployees();


        if (!Array.isArray(employees)) {

            employees = [];

        }


        filteredEmployees =
            [...employees];


        updateMiniStatistics();

        populateDepartmentFilter();

        renderEmployees();


    } catch (error) {

        console.error(
            "Unable to load employees:",
            error
        );


        showError(
            error.message
        );

    }

}



// =====================================================
// SETUP EVENTS
// =====================================================

function setupEvents() {


    // Search

    document
        .getElementById("searchInput")
        .addEventListener(
            "input",
            applyFilters
        );


    // Department

    document
        .getElementById("departmentFilter")
        .addEventListener(
            "change",
            applyFilters
        );


    // Type

    document
        .getElementById("typeFilter")
        .addEventListener(
            "change",
            applyFilters
        );


    // Refresh

    document
        .getElementById("refreshButton")
        .addEventListener(
            "click",
            loadEmployees
        );


    // Clear

    document
        .getElementById("clearFilters")
        .addEventListener(
            "click",
            clearFilters
        );


    // Logout

    document
        .getElementById("logoutButton")
        .addEventListener(
            "click",
            logout
        );


    // Delete

    document
        .getElementById(
            "confirmDeleteButton"
        )
        .addEventListener(
            "click",
            confirmDelete
        );

}



// =====================================================
// APPLY FILTERS
// =====================================================

function applyFilters() {


    const search =
        document
            .getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();


    const department =
        document
            .getElementById("departmentFilter")
            .value
            .toLowerCase();


    const type =
        document
            .getElementById("typeFilter")
            .value
            .toLowerCase();


    filteredEmployees =
        employees.filter(
            employee => {


                const searchableText = [

                    employee.fullName,

                    employee.email,

                    employee.phone,

                    employee.departmentName,

                    employee.designationName,

                    employee.employeeType

                ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchableText.includes(
                        search
                    );


                const matchesDepartment =
                    !department ||
                    String(
                        employee.departmentName || ""
                    )
                    .toLowerCase()
                    === department;


                const matchesType =
                    !type ||
                    String(
                        employee.employeeType || ""
                    )
                    .toLowerCase()
                    === type;


                return (
                    matchesSearch &&
                    matchesDepartment &&
                    matchesType
                );

            }
        );


    renderEmployees();

}



// =====================================================
// RENDER EMPLOYEES
// =====================================================

function renderEmployees() {


    const tbody =
        document.getElementById(
            "employeeTableBody"
        );


    const state =
        document.getElementById(
            "tableState"
        );


    const table =
        document.getElementById(
            "employeeTable"
        );


    if (!filteredEmployees.length) {

        tbody.innerHTML = "";

        table.style.display = "none";

        state.style.display = "flex";


        state.innerHTML = `

            <i class="bi bi-person-x"></i>

            <strong>
                No employees found
            </strong>

            <small>
                Try changing your search or filters.
            </small>

        `;


        updateResultText();

        return;

    }


    table.style.display = "table";

    state.style.display = "none";


    tbody.innerHTML =
        filteredEmployees
        .map(
            employee =>
                createEmployeeRow(
                    employee
                )
        )
        .join("");


    updateResultText();

}



// =====================================================
// CREATE TABLE ROW
// =====================================================

function createEmployeeRow(
    employee
) {


    const name =
        employee.fullName?.trim()
        || "Unnamed Employee";


    const initials =
        getInitials(name);


    const employeeType =
        employee.employeeType?.trim()
        || "Other";


    const typeClass =
        getTypeBadgeClass(
            employeeType
        );


    const department =
        employee.departmentName?.trim()
        || "Unknown";


    const designation =
        employee.designationName?.trim()
        || "Not specified";


    const salary =
        Number(employee.salary) || 0;


    return `

        <tr>

            <!-- EMPLOYEE -->

            <td>

                <div class="employee-person">

                    <div class="person-avatar">

                        ${initials}

                    </div>


                    <div>

                        <div class="person-name">

                            ${escapeHTML(name)}

                        </div>


                        <div class="person-email">

                            ${escapeHTML(
                                employee.email || "-"
                            )}

                        </div>

                    </div>

                </div>

            </td>


            <!-- PHONE -->

            <td>

                ${
                    escapeHTML(
                        employee.phone || "-"
                    )
                }

            </td>


            <!-- DEPARTMENT -->

            <td>

                <span
                    class="badge-custom department-badge">

                    ${escapeHTML(
                        department
                    )}

                </span>

            </td>


            <!-- DESIGNATION -->

            <td>

                ${escapeHTML(
                    designation
                )}

            </td>


            <!-- DATE -->

            <td>

                ${formatDate(
                    employee.dateOfJoining
                )}

            </td>


            <!-- TYPE -->

            <td>

                <span
                    class="badge-custom ${typeClass}">

                    ${escapeHTML(
                        employeeType
                    )}

                </span>

            </td>


            <!-- SALARY -->

            <td>

                <strong>

                    LKR
                    ${formatSalary(salary)}

                </strong>

            </td>


            <!-- ACTIONS -->

            <td>

                <div class="action-buttons">


                    <!-- VIEW -->

                    <button
                        class="action-btn"
                        title="View employee"
                        onclick="viewEmployee(
                            ${employee.employeeId}
                        )">

                        <i class="bi bi-eye"></i>

                    </button>


                    <!-- EDIT -->

                    <button
                        class="action-btn"
                        title="Edit employee"
                        onclick="editEmployee(
                            ${employee.employeeId}
                        )">

                        <i class="bi bi-pencil"></i>

                    </button>


                    <!-- DELETE -->

                    <button
                        class="action-btn delete"
                        title="Delete employee"
                        onclick="openDeleteModal(
                            ${employee.employeeId},
                            '${escapeForAttribute(name)}'
                        )">

                        <i class="bi bi-trash3"></i>

                    </button>


                </div>

            </td>

        </tr>

    `;

}



// =====================================================
// VIEW EMPLOYEE
// =====================================================

function viewEmployee(employeeId) {

    window.location.href =
        `employee-details.html?id=${employeeId}`;

}



// =====================================================
// EDIT EMPLOYEE
// =====================================================

function editEmployee(employeeId) {

    window.location.href =
        `edit-employee.html?id=${employeeId}`;

}



// =====================================================
// DELETE MODAL
// =====================================================

function openDeleteModal(
    employeeId,
    employeeName
) {

    employeeToDelete =
        employeeId;


    document.getElementById(
        "deleteEmployeeName"
    ).textContent =
        employeeName;


    const modalElement =
        document.getElementById(
            "deleteModal"
        );


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}



// =====================================================
// CONFIRM DELETE
// =====================================================

async function confirmDelete() {

    if (!employeeToDelete) {

        return;
    }


    const button =
        document.getElementById(
            "confirmDeleteButton"
        );


    const originalText =
        button.innerHTML;


    button.disabled = true;

    button.innerHTML = `
        <span
            class="spinner-border spinner-border-sm">
        </span>
        Deleting...
    `;


    try {

        await deleteEmployee(
            employeeToDelete
        );


        const modal =
            bootstrap.Modal.getInstance(
                document.getElementById(
                    "deleteModal"
                )
            );


        modal.hide();


        employeeToDelete = null;


        await loadEmployees();


        alert(
            "Employee deleted successfully."
        );


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Unable to delete employee.\n\n" +
            error.message
        );

    } finally {

        button.disabled = false;

        button.innerHTML =
            originalText;

    }

}



// =====================================================
// DEPARTMENT FILTER
// =====================================================

function populateDepartmentFilter() {


    const select =
        document.getElementById(
            "departmentFilter"
        );


    const departments =
        [
            ...new Set(
                employees
                    .map(
                        employee =>
                            employee.departmentName
                    )
                    .filter(Boolean)
            )
        ]
        .sort();


    select.innerHTML = `

        <option value="">
            All Departments
        </option>

    `;


    departments.forEach(
        department => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                department;


            option.textContent =
                department;


            select.appendChild(
                option
            );

        }
    );

}



// =====================================================
// MINI STATISTICS
// =====================================================

function updateMiniStatistics() {


    document.getElementById(
        "miniTotal"
    ).textContent =
        employees.length;


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
        "miniPermanent"
    ).textContent =
        permanent;


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
        "miniHR"
    ).textContent =
        hr;


    const departments =
        new Set(
            employees
                .map(
                    employee =>
                        employee.departmentName
                )
                .filter(Boolean)
        );


    document.getElementById(
        "miniDepartments"
    ).textContent =
        departments.size;

}



// =====================================================
// RESULT TEXT
// =====================================================

function updateResultText() {


    document.getElementById(
        "resultText"
    ).textContent =

        `${filteredEmployees.length} of ` +
        `${employees.length} employees`;


    document.getElementById(
        "paginationText"
    ).textContent =

        `Showing ${filteredEmployees.length} employee(s)`;

}



// =====================================================
// CLEAR FILTERS
// =====================================================

function clearFilters() {


    document.getElementById(
        "searchInput"
    ).value = "";


    document.getElementById(
        "departmentFilter"
    ).value = "";


    document.getElementById(
        "typeFilter"
    ).value = "";


    applyFilters();

}



// =====================================================
// LOADING
// =====================================================

function showLoading() {


    const table =
        document.getElementById(
            "employeeTable"
        );


    const state =
        document.getElementById(
            "tableState"
        );


    table.style.display =
        "none";


    state.style.display =
        "flex";


    state.innerHTML = `

        <div
            class="spinner-border"
            style="color:#635bff;">
        </div>

        <div class="mt-3">
            Loading employees...
        </div>

    `;

}



// =====================================================
// ERROR
// =====================================================

function showError(message) {


    const table =
        document.getElementById(
            "employeeTable"
        );


    const state =
        document.getElementById(
            "tableState"
        );


    table.style.display =
        "none";


    state.style.display =
        "flex";


    state.innerHTML = `

        <i
            class="bi bi-cloud-slash"
            style="color:#dc2626;">
        </i>

        <strong>
            Unable to load employees
        </strong>

        <small>
            ${escapeHTML(message)}
        </small>

        <button
            class="btn btn-sm btn-outline-primary mt-3"
            onclick="loadEmployees()">

            Try Again

        </button>

    `;

}



// =====================================================
// TYPE BADGE
// =====================================================

function getTypeBadgeClass(type) {


    const value =
        String(type || "")
            .toLowerCase();


    if (value === "permanent") {

        return "badge-permanent";

    }


    if (value === "hr") {

        return "badge-hr";

    }


    return "badge-other";

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
// ESCAPE HTML
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



// =====================================================
// ESCAPE ATTRIBUTE
// =====================================================

function escapeForAttribute(value) {

    return String(value ?? "")
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}



// =====================================================
// USER
// =====================================================

function loadUser() {

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


        const email =
            document.getElementById(
                "userEmail"
            );


        if (
            email &&
            parsed.email
        ) {

            email.textContent =
                parsed.email;

        }

    } catch (error) {

        console.error(error);

    }

}



// =====================================================
// LOGOUT
// =====================================================

function logout(event) {

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