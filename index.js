
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const render = require("./lib/htmlRenderer");
const { run } = require("jest");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "index.html");


const teamProfile = [];


const managerPrompt = () => {
    return new Promise((res, rej) => {
        inquirer
            .prompt([
                {
                    type: "input",
                    message: `manager's name?`,
                    name: "name",
                },
                {
                    type: "input",
                    message: "manager's id?",
                    name: "id",
                },
                {
                    type: "input",
                    message: "manager's email?",
                    name: "email",
                },
                {
                    type: "input",
                    message: "manager's office number?",
                    name: "officeNumber",
                },
            ]).then(answers => {
                const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
                teamProfile.push(manager);
                res();
            });
    });
}

const employeePrompt = () => {
    return new Promise((resolve, rej) => {
        inquirer.prompt([
            {
                type: "list",
                message: "select using arrow keys for employee type:",
                name: "employeeType",
                choices: [
                    "Engineer",
                    "Intern",
                    {
                        name: "No more employees to add",
                        value: false
                    }
                ]
            },
            {
                message: "engineer's name?",
                name: "name",
                when: ({ employeeType }) => employeeType === "Engineer"
            },
            {
                message: "intern's name?",
                name: "name",
                when: ({ employeeType }) => employeeType === "Intern"
            },
            {
                message: "engineer's ID?",
                name: "id",
                when: ({ employeeType }) => employeeType === "Engineer"
            },
            {
                message: "intern's ID?",
                name: "id",
                when: ({ employeeType }) => employeeType === "Intern"
            },
            {
                message: "engineer's email address?",
                name: "email",
                when: ({ employeeType }) => employeeType === "Engineer"
            },
            {
                message: "intern's email address?",
                name: "email",
                when: ({ employeeType }) => employeeType === "Intern"
            },
            {
                message: "engineer's GitHub username?",
                name: "github",
                when: ({ employeeType }) => employeeType === "Engineer"
            },
            {
                message: "Which school is the intern from?",
                name: "school",
                when: ({ employeeType }) => employeeType === "Intern"
            }
        ]).then(answers => {
            if (answers.employeeType) {
                switch (answers.employeeType) {
                    case "Engineer":
                        const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
                        teamProfile.push(engineer);
                        break;
                    case "Intern":
                        const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
                        teamProfile.push(intern);
                        break;
                }
                return employeePrompt().then(() => resolve());
            } else {
                return resolve();
            }
        })
    })
}

const createHTMLFile = (htmlPage) => {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFile(outputPath, htmlPage, "utf-8", (err) => {
        if(err) throw err;
        console.log(`Success! See Team Profile Page at ${outputPath}`)
    });
}

//calls manager first, then Engineer or Intern
managerPrompt().then(() => {
    return employeePrompt();
}).then(() => {
    const templateHTML = render(teamProfile)
    createHTMLFile(templateHTML);
}).catch((err) => {
    console.log(err);
});