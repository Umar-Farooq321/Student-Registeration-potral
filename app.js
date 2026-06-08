const API_URL = 'http://localhost:3000/students';
let studentsData = [];

const registrationForm = document.getElementById('registrationForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const rollNoInput = document.getElementById('rollNo');
const phoneInput = document.getElementById('phone');
const departmentInput = document.getElementById('department');
const semesterInput = document.getElementById('semester');
const registrationDateInput = document.getElementById('registrationDate');

const searchInput = document.getElementById('searchInput');
const deptFilter = document.getElementById('deptFilter');

const submitBtn = document.getElementById('submitBtn');
const submitSpinner = document.getElementById('submitSpinner');
const submitIcon = document.getElementById('submitIcon');

const loadingOverlay = document.getElementById('loadingOverlay');
const errorAlert = document.getElementById('errorAlert');
const retryBtn = document.getElementById('retryBtn');
const tableWrapper = document.getElementById('tableWrapper');
const emptyState = document.getElementById('emptyState');
const studentTableBody = document.getElementById('studentTableBody');

let toastContainer = document.getElementById('toastContainer');
if (!toastContainer) {
  toastContainer = document.createElement('div');
  toastContainer.id = 'toastContainer';
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
}

async function fetchStudents() {
  showLoading(true);
  showError(false);
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    studentsData = await response.json();
    renderFilteredStudents();
  } catch (error) {
    showError(true);
  } finally {
    showLoading(false);
  }
}
