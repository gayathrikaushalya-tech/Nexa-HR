// =====================================================
// NEXA HR - API SERVICE
// =====================================================

const API_BASE =
    "https://api.freeprojectapi.com/api/EmployeeApp";


// =====================================================
// GENERIC API REQUEST
// =====================================================

async function apiRequest(url, options = {}) {

    try {

        const response =
            await fetch(url, options);


        // Check response type
        const contentType =
            response.headers.get("content-type") || "";


        let data;


        // JSON response
        if (contentType.includes("application/json")) {

            data = await response.json();

        }

        // Text response
        else {

            data = await response.text();

        }


        // Handle HTTP errors
        if (!response.ok) {

            let errorMessage =
                `Request failed (${response.status})`;


            if (typeof data === "string" && data) {

                errorMessage = data;

            }
            else if (data?.message) {

                errorMessage = data.message;

            }
            else if (data?.title) {

                errorMessage = data.title;

            }


            throw new Error(errorMessage);

        }


        return data;


    } catch (error) {

        console.error(
            "API ERROR:",
            error
        );


        throw error;

    }

}



// =====================================================
// GET ALL EMPLOYEES
// =====================================================

async function getEmployees() {

    return await apiRequest(
        `${API_BASE}/GetEmployees`
    );

}



// =====================================================
// GET EMPLOYEE BY ID
// =====================================================

async function getEmployeeById(employeeId) {

    if (!employeeId) {

        throw new Error(
            "Employee ID is required."
        );

    }


    return await apiRequest(
        `${API_BASE}/${employeeId}`
    );

}



// =====================================================
// GET DEPARTMENTS
// =====================================================

async function getDepartments() {

    return await apiRequest(
        `${API_BASE}/GetDepartments`
    );

}



// =====================================================
// GET DESIGNATIONS BY DEPARTMENT
// =====================================================

async function getDesignationsByDepartment(
    departmentId
) {

    if (!departmentId) {

        return [];

    }


    /*
     * We are currently using deptId because
     * this is the likely query parameter.
     *
     * We can change it after confirming
     * the exact Swagger parameter name.
     */

    return await apiRequest(
        `${API_BASE}/GetDesignationsByDeptId?deptId=${departmentId}`
    );

}



// =====================================================
// CREATE EMPLOYEE
// =====================================================

async function createEmployee(
    employeeData
) {

    return await apiRequest(
       `${API_BASE}/CreateEmployee`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(employeeData)

        }
    );

}



// =====================================================
// UPDATE EMPLOYEE
// =====================================================

async function updateEmployee(
    employeeData
) {

    return await apiRequest(
       `${API_BASE}/UpdateEmployee`,
        {

            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(employeeData)

        }
    );

}



// =====================================================
// DELETE EMPLOYEE
// =====================================================

async function deleteEmployee(
    employeeId
) {

    if (!employeeId) {

        throw new Error(
            "Employee ID is required."
        );

    }


    /*
     * IMPORTANT:
     *
     * Your API documentation does not clearly
     * show the parameter required by
     * DeleteEmployee.
     *
     * This is the version we are currently
     * testing:
     */

    return await apiRequest(
       `${API_BASE}/DeleteEmployee?id=${employeeId}`,
        {
            method: "DELETE"
        }
    );

}



// =====================================================
// FORMAT SALARY
// =====================================================

function formatSalary(value) {

    const salary =
        Number(value) || 0;


    return salary.toLocaleString(
        "en-LK",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}



// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(value) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(value);


    if (isNaN(date.getTime())) {

        return "-";

    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}



// =====================================================
// GET EMPLOYEE INITIALS
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
// EMPLOYEE TYPE CLASS
// =====================================================

function getEmployeeTypeClass(type) {

    const value =
        String(type || "")
            .toLowerCase();


    if (value === "permanent") {

        return "type-permanent";

    }


    if (value === "hr") {

        return "type-hr";

    }


    if (value === "contract") {

        return "type-contract";

    }


    return "type-other";

}



// =====================================================
// DEPARTMENT CLASS
// =====================================================

function getDepartmentClass(
    department
) {

    const value =
        String(department || "")
            .toLowerCase();


    if (value === "sales") {

        return "department-sales";

    }


    if (value === "marketing") {

        return "department-marketing";

    }


    return "department-other";

}