
const API_URL = 'http://localhost:3000/students';
let studentsData = [];

let editDialog = null;
let deleteDialog = null;

const statTotalStudents = document.getElementById('statTotalStudents');
const statActiveRate = document.getElementById('statActiveRate');
const statSeniorCount = document.getElementById('statSeniorCount');

const adminSearchInput = document.getElementById('adminSearchInput');
const adminDeptFilter = document.getElementById('adminDeptFilter');
const adminTableBody = document.getElementById('adminTableBody');
const loadingOverlay = document.getElementById('loadingOverlay');
const errorAlert = document.getElementById('errorAlert');
const retryBtn = document.getElementById('retryBtn');
const tableWrapper = document.getElementById('tableWrapper');
const emptyState = document.getElementById('emptyState');

const editForm = document.getElementById('editForm');
const editStudentId = document.getElementById('editStudentId');
const editRollNo = document.getElementById('editRollNo');
const editFullName = document.getElementById('editFullName');
const editEmail = document.getElementById('editEmail');
const editPhone = document.getElementById('editPhone');
const editDepartment = document.getElementById('editDepartment');
const editSemester = document.getElementById('editSemester');
const editStatus = document.getElementById('editStatus');
const editRegistrationDate = document.getElementById('editRegistrationDate');
const saveBtn = document.getElementById('saveBtn');
const saveSpinner = document.getElementById('saveSpinner');

const deleteStudentId = document.getElementById('deleteStudentId');
const deleteWarningText = document.getElementById('deleteWarningText');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteSpinner = document.getElementById('deleteSpinner');

const closeEditDialogBtn = document.getElementById('closeEditDialogBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const closeDeleteDialogBtn = document.getElementById('closeDeleteDialogBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

let toastContainer = document.getElementById('toastContainer');
if (!toastContainer) {
  toastContainer = document.createElement('div');
  toastContainer.id = 'toastContainer';
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
}

async function fetchAdminData() {
  showLoading(true);
  showError(false);
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch database: ${response.status} ${response.statusText}`);
    }
    studentsData = await response.json();
    calculateStats();
    renderFilteredAdminTable();
  } catch (error) {
    showError(true);
  } finally {
    showLoading(false);
  }
}

function calculateStats() {
  const total = studentsData.length;
  statTotalStudents.textContent = total;

  if (total === 0) {
    statActiveRate.textContent = '0%';
    statSeniorCount.textContent = '0';
    return;
  }

  const activeCount = studentsData.filter(student => student.status === 'Active').length;
  const activePercentage = ((activeCount / total) * 100).toFixed(1);
  statActiveRate.textContent = `${activePercentage}%`;

  const seniorSemesters = ['5th', '6th', '7th', '8th'];
  const seniorCount = studentsData.filter(student => seniorSemesters.includes(student.semester)).length;
  statSeniorCount.textContent = seniorCount;
}

function renderAdminTable(list) {
  adminTableBody.innerHTML = '';

  if (list.length === 0) {
    emptyState.classList.remove('d-none');
    tableWrapper.classList.add('d-none');
    return;
  }

  emptyState.classList.add('d-none');
  tableWrapper.classList.remove('d-none');

  list.forEach(student => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="padding-left: 1rem; font-weight: 600; color: var(--text-muted);">${escapeHTML(student.rollNo)}</td>
      <td style="font-weight: 500;">${escapeHTML(student.fullName)}</td>
      <td>${escapeHTML(student.department)}</td>
      <td>${escapeHTML(student.semester)}</td>
      <td>
        <span class="badge ${escapeHTML(student.status)}">
          ${escapeHTML(student.status)}
        </span>
      </td>
      <td style="color: var(--text-muted); font-size: 0.85rem;">${escapeHTML(student.registrationDate)}</td>
      <td class="text-end" style="padding-right: 1.5rem;">
        <button class="btn btn-outline-primary btn-sm me-1 btn-edit" data-id="${student.id}" title="Edit Record">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-outline-danger btn-sm btn-delete" data-id="${student.id}" title="Delete Record">
          <i class="bi bi-trash-fill"></i>
        </button>
      </td>
    `;
    adminTableBody.appendChild(tr);
  });

  trigButtonEvents();
}

function renderFilteredAdminTable() {
  const searchTerm = adminSearchInput.value.toLowerCase().trim();
  const filterDept = adminDeptFilter.value;

  const filtered = studentsData.filter(student => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm) ||
      student.rollNo.toLowerCase().includes(searchTerm);

    const matchesDept =
      filterDept === 'ALL' || student.department === filterDept;

    return matchesSearch && matchesDept;
  });

  renderAdminTable(filtered);
}

function trigButtonEvents() {
  const editButtons = adminTableBody.querySelectorAll('.btn-edit');
  const deleteButtons = adminTableBody.querySelectorAll('.btn-delete');

  editButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openEditModal(id);
    });
  });

  deleteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openDeleteModal(id);
    });
  });
}

function openEditModal(id) {
  const student = studentsData.find(s => s.id === id);
  if (!student) return;

  clearModalValidationStates();

  editStudentId.value = student.id;
  editRollNo.value = student.rollNo;
  editFullName.value = student.fullName;
  editEmail.value = student.email;
  editPhone.value = student.phone;
  editDepartment.value = student.department;
  editSemester.value = student.semester;
  editStatus.value = student.status;
  editRegistrationDate.value = student.registrationDate;

  editDialog.showModal();
}

function validateEditForm() {
  let isValid = true;

  const fullNameVal = editFullName.value.trim();
  const nameRegex = /^[a-zA-Z\s]{3,50}$/;

  if (!nameRegex.test(fullNameVal)) {
    markInvalid(editFullName, 'Valid name required (minimum 3 letters, alphabetic only).');
    isValid = false;
  } else {
    markValid(editFullName);
  }

  const emailVal = editEmail.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(emailVal)) {
    markInvalid(editEmail, 'Enter a valid email address.');
    isValid = false;
  } else {
    markValid(editEmail);
  }

  const phoneVal = editPhone.value.trim();
  const phoneRegex = /^\d{10,11}$/;

  if (!phoneRegex.test(phoneVal)) {
    markInvalid(editPhone, 'Phone number must be a 10 to 11 digit number.');
    isValid = false;
  } else {
    markValid(editPhone);
  }

  const regDateVal = editRegistrationDate.value;

  if (!regDateVal) {
    markInvalid(editRegistrationDate, 'Please select registration date.');
    isValid = false;
  } else {
    const selectedDate = new Date(regDateVal);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      markInvalid(editRegistrationDate, 'Date cannot be in the future.');
      isValid = false;
    } else {
      markValid(editRegistrationDate);
    }
  }

  return isValid;
}

function markInvalid(element, message) {
  element.classList.add('is-invalid');
  element.classList.remove('is-valid');

  const feedbackElement = document.getElementById(`${element.id}Feedback`);
  if (feedbackElement) {
    feedbackElement.textContent = message;
  }
}

function markValid(element) {
  element.classList.remove('is-invalid');
  element.classList.add('is-valid');
}

function clearModalValidationStates() {
  const inputs = editForm.querySelectorAll('.form-control, .form-select');

  inputs.forEach(input => {
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');
  });
}

async function updateStudent(e) {
  e.preventDefault();

  if (!validateEditForm()) return;

  const id = editStudentId.value;

  setSaveLoading(true);

  const updatedPayload = {
    fullName: editFullName.value.trim(),
    email: editEmail.value.trim(),
    rollNo: editRollNo.value.trim(),
    phone: editPhone.value.trim(),
    department: editDepartment.value,
    semester: editSemester.value,
    registrationDate: editRegistrationDate.value,
    status: editStatus.value
  };

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedPayload)
    });

    if (!response.ok) {
      throw new Error(`Failed to update data: ${response.status} ${response.statusText}`);
    }

    editDialog.close();
    showToast('Student details updated successfully.', 'success');
    await fetchAdminData();
  } catch (error) {
    showToast('Failed to update student records. Check server connection.', 'danger');
  } finally {
    setSaveLoading(false);
  }
}
