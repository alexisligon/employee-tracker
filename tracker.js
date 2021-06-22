const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

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

//function for adding a department
const addDept = () => {
  inquirer.prompt([
    {
      type: 'input',
      message: 'What department would you like to add?',
      name: 'departmentType'
    }
  ])
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
}

//function for viewing all departments
const viewDept = () => {
  connection.query('SELECT * FROM department',
    (err, results) => {
      if (err) throw err;

      const departmentArray = [];
      results.forEach(({ id, name }) => {
        departmentArray.push({ id, name });
      });
      console.table('Departments', departmentArray);
      init();
    })
}

//function for adding a job role
const addRole = () => {
  connection.query(
    'SELECT * FROM department',
    (err, results) => {
      if (err) throw err;
      //renames key value pairs for inquirer choices of department
      const departmentChoices = results.map(function (department) {
        return {
          value: department.id,
          name: department.name,
        }
      })
      //Questions for job roles to add
      inquirer.prompt([
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
          choices: departmentChoices
        }
      ])
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
    }
  )

}

//function for viewing all job roles
const viewRoles = () => {
  connection.query('SELECT * FROM role',
    (err, results) => {
      if (err) throw err;

      const roleArray = [];
      results.forEach(({ id, title, salary, department_id }) => {
        roleArray.push({ id, title, salary, department_id });
      });
      console.table('Job Roles', roleArray);
      init();
    })
}

//function for adding employees
const addEmp = () => {
  connection.query(
    'SELECT * FROM role',
    (err, results) => {
      if (err) throw err;
      const jobRoleChoices = results.map(function (jobRole) {
        return {
          value: jobRole.id,
          name: jobRole.title,
        }
      })
      console.log("jobRoleChoices:", jobRoleChoices)
      inquirer.prompt(
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
          {
            type: 'list',
            message: "What is the employee's job role?",
            name: 'empJobRole',
            choices: jobRoleChoices
          },
          //if job role id is 2,4, 6 then manager is null
          //else ask who is employee's manager
          //display choices of 2,4,6
          //change to select only managers
          // {
          //   type: 'list',
          //   message: "Who is the employee's manager?",
          //   name: 'empsMan',
          //   choices: ['Manager 1', 'Manager 2', 'Manager 3']
          // }
        ]
      )
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
    }
  )

}

//function for viewing employees
const viewEmp = () => {

}


init = () => {
  inquirer.prompt(questions)
    .then((answer) => {
      switch (answer.firstChoice) {
        case ('ADD_DEPARTMENT'):
          addDept()
          break;

        case ('ADD_EMPLOYEE'):
          addEmp();
          break;

        case ('ADD_ROLE'):
          addRole();
          break;

        case ('QUIT'):
          process.exit();

        case ('VIEW_DEPARTMENTS'):
          viewDept();
          break;

        case ('VIEW_ROLES'):
          viewRoles();
          break;

        case ('VIEW_EMPLOYEES'):
          connection.query('SELECT * FROM employee',
            (err, results) => {
              if (err) throw err;

              const employeeArray = [];
              results.forEach(({ first_name, last_name, role_id }) => {
                employeeArray.push({ first_name, last_name, role_id });
              });
              console.table(employeeArray);
              init();
            })
          break;


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
