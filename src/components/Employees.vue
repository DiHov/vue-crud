<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>Employees</h1>
        <hr><br><br>
        <alert :message="message"  v-if="showMessage"></alert>
        <button type="button"
                class="btn btn-success btn-sm"
                v-b-modal.employee-modal>Add Employee</button>
        <br><br>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">ФИО</th>
              <th scope="col">з/п</th>
              <th scope="col">возраст</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in data" :key="employee.id">
              <td>{{ employee.employee_name }}</td>
              <td>{{ employee.employee_salary }}</td>
              <td>{{ employee.employee_age }}</td>
              <td>
                <button type="button"
                        class="btn btn-warning btn-sm"
                        v-b-modal.employee-update-modal
                        @click="editEmployee(employee)">
                    Update
                </button>
                <button type="button"
                        class="btn btn-danger btn-sm"
                        @click="onDeleteEmployee(employee)">
                    Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
        <b-modal ref="addEmployeeModal"
                 id="employee-modal"
                 title="Add a new employee"
                 hide-footer>
          <b-form @submit="onSubmit" @reset="onReset" class="w-100">
            <b-form-group id="form-name-group"
                          label="Name:"
                          label-for="form-name-input">
                <b-form-input id="form-name-input"
                              type="text"
                              v-model="addEmployeeForm.name"
                              required
                              placeholder="Enter name">
                </b-form-input>
            </b-form-group>
            <b-form-group id="form-salary-group"
                          label="Salary:"
                          label-for="form-salary-input">
                <b-form-input id="form-salary-input"
                              type="text"
                              v-model="addEmployeeForm.salary"
                              required
                              placeholder="Enter salary">
                </b-form-input>
            </b-form-group>
            <b-form-group id="form-age-group"
                          label="Age:"
                          label-for="form-age-input">
                <b-form-input id="form-age-input"
                              type="text"
                              v-model="addEmployeeForm.age"
                              required
                              placeholder="Enter age">
                </b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary">Submit</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
          </b-form>
        </b-modal>
        <b-modal ref="editEmployeeModal"
                 id="employee-update-modal"
                 title="Update"
                 hide-footer>
          <b-form @submit="onSubmitUpdate" @reset="onResetUpdate" class="w-100">
          <b-form-group id="form-name-edit-group"
                        label="Name:"
                        label-for="form-name-edit-input">
            <b-form-input id="form-name-edit-input"
                          type="text"
                          v-model="editForm.name"
                          required
                          placeholder="Enter name">
            </b-form-input>
          </b-form-group>
          <b-form-group id="form-salary-edit-group"
                        label="Salary:"
                        label-for="form-salary-edit-input">
            <b-form-input id="form-salary-edit-input"
                      type="text"
                      v-model="editForm.salary"
                      required
                      placeholder="Enter salary">
            </b-form-input>
          </b-form-group>
          <b-form-group id="form-age-edit-group"
                        label="Age:"
                        label-for="form-age-edit-input">
            <b-form-input id="form-age-edit-input"
                      type="text"
                      v-model="editForm.age"
                      required
                      placeholder="Enter age">
            </b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Update</b-button>
          <b-button type="reset" variant="danger">Cancel</b-button>
          </b-form>
        </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import Alert from './Alert';

export default {
  data() {
    return {
      data: [],
      addEmployeeForm: {
        employee_name: '',
        employee_salary: '',
        employee_age: '',
      },
      editForm: {
        id: '',
        employee_name: '',
        employee_salary: '',
        employee_age: '',
      },
      message: '',
      showMessage: false,
    };
  },
  components: {
    alert: Alert,
  },
  methods: {
    getEmployee() {
      const path = 'https://dummy.restapiexample.com/api/v1/employees';
      axios.get(path)
        .then((res) => {
          this.data = res.data.data;
        })
        .catch((error) => {
          // eslint-отключение следующей строки
          // eslint-disable-next-line
          console.error(error);
        });
    },
    addEmployee(payload) {
      const path = 'http://dummy.restapiexample.com/api/v1/create';
      axios.post(path, payload)
        .then(() => {
          this.getEmployee();
          this.message = 'Employee added!';
          this.showMessage = true;
        })
        .catch((error) => {
          // eslint-отключение следующей строки
          // eslint-disable-next-line
          console.log(error);
          this.getEmployee();
        });
    },
    initForm() {
      this.addEmployeeForm.employee_name = '';
      this.addEmployeeForm.employee_salary = '';
      this.addEmployeeForm.employee_age = '';
      this.editForm.id = '';
      this.editForm.employee_name = '';
      this.editForm.employee_salary = '';
      this.editForm.employee_age = '';
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$refs.addEmployeeModal.hide();
      const payload = {
        employee_name: this.addEmployeeForm.employee_name,
        employee_salary: this.addEmployeeForm.employee_salary,
        employee_age: this.addEmployeeForm.employee_age,
      };
      this.addEmployee(payload);
      this.initForm();
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.addEmployeeModal.hide();
      this.initForm();
    },
    editEmployee(employee) {
      this.editForm = employee;
    },
    onSubmitUpdate(evt) {
      evt.preventDefault();
      this.$refs.editEmployeeModal.hide();
      const payload = {
        employee_name: this.editForm.employee_name,
        employee_salary: this.editForm.employee_salary,
        employee_age: this.editForm.employee_age,
      };
      this.updateEmployee(payload, this.editForm.id);
    },
    updateEmployee(payload, employeeID) {
      const path = `http://dummy.restapiexample.com/api/v1/update/${employeeID}`;
      axios.put(path, payload)
        .then(() => {
          this.getEmployee();
          this.message = 'Employee updated!';
          this.showMessage = true;
        })
        .catch((error) => {
          // eslint-отключение следующей строки
          // eslint-disable-next-line
          console.error(error);
          this.getEmployee();
        });
    },
    onResetUpdate(evt) {
      evt.preventDefault();
      this.$refs.editEmployeeModal.hide();
      this.initForm();
      this.getEmployee();
    },
    removeEmployee(employeeID) {
      const path = `http://dummy.restapiexample.com/api/v1/delete/${employeeID}`;
      axios.delete(path)
        .then(() => {
          this.getEmployee();
          this.message = 'Employee removed!';
          this.showMessage = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          // eslint-disable-next-line
          console.error(error);
          this.getEmployee();
        });
    },
    onDeleteEmployee(employee) {
      this.removeEmployee(employee.id);
    },
  },
  created() {
    this.getEmployee();
  },
};
</script>
