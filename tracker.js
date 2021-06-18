const inquirer = require('inquirer');

//initial question for what to do
const questions = [
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'firstChoice',
    choices: [
      {
        name: "View All Employees",
        value: "VIEW_EMPLOYEES"
      },
      {
        name: "View All Employees By Department",
        value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
      },
      {
        name: "View All Employees By Manager",
        value: "VIEW_EMPLOYEES_BY_MANAGER"
      },
      {
        name: "Add Employee",
        value: "ADD_EMPLOYEE"
      },
      {
        name: "Remove Employee",
        value: "REMOVE_EMPLOYEE"
      },
      {
        name: "Update Employee Role",
        value: "UPDATE_EMPLOYEE_ROLE"
      },
      {
        name: "Update Employee Manager",
        value: "UPDATE_EMPLOYEE_MANAGER"
      },
      {
        name: "View All Roles",
        value: "VIEW_ROLES"
      },
      {
        name: "Add Role",
        value: "ADD_ROLE"
      },
      {
        name: "Remove Role",
        value: "REMOVE_ROLE"
      },
      {
        name: "View All Departments",
        value: "VIEW_DEPARTMENTS"
      },
      {
        name: "Add Department",
        value: "ADD_DEPARTMENT"
      },
      {
        name: "Remove Department",
        value: "REMOVE_DEPARTMENT"
      },
      {
        name: "Quit",
        value: "QUIT"
      }
    ]
  }
]

//adding a department
const addDept = 
[
  {
    type: 'input',
    message: 'What department would you like to add?',
    name: 'departmentType'
  }
]

init = () => {
    inquirer.prompt(questions)
    .then((answer) => {
      console.log('answer: ', answer.firstChoice);
      switch (answer.firstChoice) {
        case ('ADD_DEPARTMENT'):
          inquirer.prompt(addDept)
          .then((answer) => {
            console.log('department type: ', answer.departmentType)
          })
          break;
      
        default:
          break;
      }
      
    })
}

init();

//What would you like to do?

//ADD
//Add a department
//Add a role
//Add an employee


//VIEW
//View all departments
//View all job roles
//View employees


//UPDATE
//update employee roles
