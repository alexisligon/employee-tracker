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

//adding a department question
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


//add employee questions
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
          //change job role question from input to list type
          //choose from job roles already entered
          {
            type: 'list',
            message: "What is the employee's job role?",
            name: 'empJobRole',
            choices: jobRoleChoices
          },
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
//insert this data into role table on sql


init = () => {
  inquirer.prompt(questions)
    .then((answer) => {
      console.log('answer: ', answer.firstChoice);
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
          break;

        case ('VIEW_EMPLOYEES'):
          connection.query('SELECT * FROM employee',
            (err, results) => {
              if (err) throw err;

              const employeeArray = [];
              results.forEach(({ first_name, last_name, role_id, manager_id }) => {
                employeeArray.push({ first_name, last_name, role_id, manager_id });
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
