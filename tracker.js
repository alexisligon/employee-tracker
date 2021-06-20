const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employeeTracker_DB',
});

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

//adding a department question
const addDept =
  //add this data to department table
  [
    {
      type: 'input',
      message: 'What department would you like to add?',
      name: 'departmentType'
    }
  ]

//add employee questions
const addEmp =
  //add this data to employee table
  [
    {
      type: 'input',
      message: "What is the employee's first name?",
      name: 'empFirstName'
    },
    {
      type: 'input',
      message: "What is the employee's last name?",
      name: 'empLastName'
    },
    //change job role question from input to list type
    //choose from job roles already entered
    {
      type: 'input',
      message: "What is the employee's job role?",
      name: 'empJobRole'
    },
    {
      type: 'list',
      message: "Who is the employee's manager?",
      name: 'empsMan',
      choices: ['Manager 1', 'Manager 2', 'Manager 3']
    }
  ]

//add job role questions
const addRole =
  //insert this data into role table on sql
  [
    {
      type: 'input',
      message: 'What job role do you want to add?',
      name: 'jobRole'
    },
    {
      type: 'input',
      message: 'What is the starting salary for this job role?',
      name: 'jobSalary'
    },
    {
      type: 'list',
      message: 'What department is this job role in?',
      name: 'roleDepartment',
      choices: ['Human Resource', 'Marketing', 'Customer Service', 'Sales', 'Research', 'Development']
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
              connection.query(
                'INSERT INTO department SET ?',
                {
                  name: answer.departmentType,
                },
                (err) => {
                  if (err) throw err;
                  console.log('department added successfully!');
                  init();
                }
              )
            })
          break;

        case ('ADD_EMPLOYEE'):
          inquirer.prompt(addEmp)
            .then((answer) => {
              connection.query(
                'INSERT INTO employee SET ?',
                {
                  first_name: answer.empFirstName,
                  last_name: answer.empLastName,
                  role_id: answer.empJobRole,
                  manager_id: answer.empsMan,
                },
                (err) => {
                  if (err) throw err;
                  console.log('employee added successfully!');
                  init();
                }
              )
            })
          break;

        case ('ADD_ROLE'):
          inquirer.prompt(addRole)
            .then((answer) => {
              connection.query(
                'INSERT INTO role SET ?',
                {
                  title: answer.jobRole,
                  salary: answer.jobSalary,
                  department_id: answer.roleDepartment,

                },
                (err) => {
                  if (err) throw err;
                  console.log('job role added successfully!');
                  init();
                }
              )
            })
          break;

          case ('QUIT'):
            process.exit();

        default:
          break;
      }

    })
}

connection.connect((err) => {
  if (err) throw err;
  init();
});



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
