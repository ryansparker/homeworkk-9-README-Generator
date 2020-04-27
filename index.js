const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

const readmeFile = process.argv[2] || 'README.md'

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

function generateReadme(response, profile = {}, repo = {}) {
    const {
        install,
        usage,
        license,
        contributing,
        test,
        email
    } = response

    const out = `
## ${repo.name || 'Insert Project Name Here'}

Project URL: ${repo.html_url || 'Insert URL Here'}

${repo.description || 'Insert Description Here'}

## Table of Contents

* [create an anchor](#anchors-in-markdown)
* [Installation] (#installation)
* [Usage] (#usage)
* [License] (#license)
* [Contributing] (#contributing)
* [Tests] (#tests)

## Installation

${install || 'Insert Installation Instructions'}

## Usage

${usage || 'Insert Usage Instructions'}

## License

${license || 'Insert License'}

## Contributing

${contributing || 'Insert Contributing Instructions'}

## Tests

${test || 'Insert Test Instructions'}

## Author

${profile.avatar_url ? `![${profile.name || 'Name Here'}](${profile.avatar_url})` : ''}

${profile.name || 'Insert Name Here'}

${profile.location ? `${profile.location}\n` : ''}
${profile.blog ? `${profile.blog}\n` : ''}
${email || 'name@example.com'}

${profile.bio || 'Insert Biography Here'}`

    return out;
}

// BEGIN PROGRAM HERE

inquirer.prompt(questions)
    .then(function (response) {
        const username = response.username.trim()
        const reponame = response.repo.trim()

        const tasks = []

        if ( username ) {
            const profileURL = `https://api.github.com/users/${username}`;
            tasks.push(axios.get(profileURL).then(function (response) {
                return response.data
            }).catch( function (err) {
                console.log('Unable to fetch profile information from Github. Check your username.')
            }))
        }

        if ( username && reponame ) {
            const repoURL = `https://api.github.com/repos/${username}/${reponame}`;
            tasks.push(axios.get(repoURL).then(function (response) {
                return response.data
            }).catch( function (err) {
                console.log('Unable to fetch repo information from Github. Check your repo name.')
            }))
        }

        // Wait for out tasks to finish
        Promise.all(tasks).then( function (data) {
            const [profile, repo] = data

            const readme = generateReadme(response, profile, repo)
            fs.writeFile(readmeFile, readme, function(err){
                if ( err ) {
                    console.log(err);
                } else {
                    console.log(`Readme written to ${readmeFile}`)
                }
            })
        })
    })
