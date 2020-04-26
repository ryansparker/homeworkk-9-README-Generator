const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

const questions = [{
    type: "input",
    message: "What is your GitHub username?",
    name: "username"
},
{
    type: "input",
    message: "What is your email address?",
    name: "email"
}, 
{
    type: "input",
    message: "What is the name of the GitHub repo?",
    name: "repo"
},
{
    type: "input",
    message: "Enter installation instructions:",
    name: "install"
},
{
    type: "input",
    message: "Enter usage information:",
    name: "usage"
},
{
    type: "input",
    message: "Enter contributing information:",
    name: "contributing"
},
{
    type: "input",
    message: "Enter license information:",
    name: "license"
},
{
    type: "input",
    message: "Enter test instructions:",
    name: "test"
}]

function processResponse(response, profile) {
    const {
        title = 'Title Here',
        desc = 'Description Here',
        install = "Install",
        usage = "Usage",
        license = "License",
        contributing = "Contributing",
        test = "Test",
        email = "name@example.com"
    } = response

    const out = `
        ## ${title}

        ${desc}

        ## Table of Contents

        * Installation
        * Usage
        * License
        * Contributing
        * Tests

        ## Installation

        ${install}

        ## Usage

        ${usage}

        ## License

        ${license}

        ## Contributing

        ${contributing}

        ## Tests

        ${test}

        ## Author
        
        ![${profile.name}](${profile.avatar_url})
        ${profile.name}
        ${profile.bio}
       
        ${email}

        `

    return out;
}


const result = inquirer.prompt(questions)
result.then(function (response) {
    const profileURL = `https://api.github.com/users/${response.username}`;
    
    axios.get(profileURL)
        .then(function (profile) {
            const output = processResponse(response, profile);
            fs.writeFile("README.md", output, function(err){
                console.log(err);
            })
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });

})

function x(p1, p2) {

}




