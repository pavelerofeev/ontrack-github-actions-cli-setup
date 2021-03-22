const os = require('os');
const fs = require('fs');
const path = require('path');

const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');
const exec = require('@actions/exec');
const github = require('@actions/github');

(async () => {
    try {
        await setup();
    } catch (error) {
        core.setFailed(error.message);
    }
})();

async function setup() {
    // Gets the version, if available
    let version = core.getInput('version');
    if (!version) {
        console.log("No version provided. Getting the latest version from GitHub.")
        const githubToken = core.getInput("github-token")
        if (!githubToken) {
            throw "GitHub token must be provided in order to get the latest version of the CLI."
        }
        const octokit = github.getOctokit(githubToken)
        const release = await octokit.repos.getLatestRelease({
            owner: "nemerosa",
            repo: "ontrack-cli"
        })
        version = release.data.name
    }
    console.log(`Using version: ${version}`);
    core.setOutput('installed', version);

    // Information about the OS
    const osPlatform = mapOS(os.platform());
    const osArch = mapArch(os.arch());
    console.log(`For OS platform: ${osPlatform}`);
    console.log(`For OS arch: ${osArch}`);

    // Getting the URL to the CLI
    const downloadUrl = `https://github.com/nemerosa/ontrack-cli/releases/download/${version}/ontrack-cli-${osPlatform}-${osArch}`;
    console.log(`Downloading CLI from ${downloadUrl}`);

    // Downloading
    await downloadAndSetup(downloadUrl)

    // CLI config?
    const url = core.getInput('url')
    const token = core.getInput('token')
    if (url && token) {
        let name = core.getInput('name')
        if (!name) name = 'prod'
        await configureCLI(url, token, name)

        // Name of the GitHub configuration in Ontrack
        const config = core.getInput('config')
        if (config) {
            await configureProject(config)
        }
    }
}

async function configureCLI(url, token, name) {
    console.log(`Connecting to ${url}...`)
    await exec.exec('ontrack-cli', ['config', 'create', name, url, '--token', token])
}

async function configureProject(config) {
    console.log(`Configuring branch for config ${config}...`)

    // GitHub context
    const context = github.context;
    console.log(`GitHub context = ${context}`);

    // GitHub repository (name) ==> Ontrack project
    const project = context.repo.repo;
    console.log(`Ontrack project = ${project}`);

    // GitHub branch
    console.log(`GitHub ref = ${context.ref}`);
    let branch = '';
    const branchPrefix = 'refs/heads/';
    if (context.ref.startsWith('refs/heads/')) {
        branch = context.ref.substring(branchPrefix.length);
    }

    // Branch setup
    if (branch) {

        console.log(`Ontrack branch = ${branch}`);
        let setupArgs = ['branch', 'setup', '--project', project, '--branch', branch]

        let autoVS = core.getInput("auto-validation-stamps")
        if (autoVS === true || autoVS === 'true') {
            setupArgs.push("--auto-create-vs")
        } else if (autoVS === 'force') {
            setupArgs.push("--auto-create-vs", "--auto-create-vs-always")
        } else if (autoVS === false || autoVS === 'false') {
            setupArgs.push("--auto-create-vs=false")
        }

        let autoPL = core.getInput("auto-promotion-levels")
        if (autoPL === true || autoPL === 'true') {
            setupArgs.push("--auto-create-pl")
        } else if (autoPL === false || autoPL === 'false') {
            setupArgs.push("--auto-create-pl=false")
        }

        await exec.exec('ontrack-cli', setupArgs)

        core.setOutput('project', project);
        core.setOutput('branch', branch);

        let indexation = core.getInput('indexation');
        if (!indexation) indexation = 0

        await exec.exec('ontrack-cli', ['project', 'set-property', '--project', project, 'github', '--configuration', config, '--repository', `${context.repo.owner}/${context.repo.repo}`, '--indexation', indexation, '--issue-service', 'self'])
        await exec.exec('ontrack-cli', ['branch', 'set-property', '--project', project, '--branch', branch, 'git', '--git-branch', branch])
    }
}

async function downloadAndSetup(url) {
    const cliPath = await tc.downloadTool(url);
    console.log(`Downloaded at ${cliPath}`)

    // Make the download executable
    if (!os.platform().startsWith('win')) {
        await fs.chmodSync(cliPath, '766')
    }

    const dir = path.dirname(cliPath)
    console.log(`Directory is ${dir}`)

    // If we're on Windows, then the executable ends with .exe
    const exeSuffix = os.platform().startsWith('win') ? '.exe' : '';

    await io.mv(cliPath, [dir, `ontrack-cli${exeSuffix}`].join(path.sep))

    // Add to the path
    core.addPath(dir)
}

// arch in [arm, x32, x64...] (https://nodejs.org/api/os.html#os_os_arch)
// return value in [amd64, 386, arm]
function mapArch(arch) {
    const mappings = {
        x32: '386',
        x64: 'amd64'
    };
    return mappings[arch] || arch;
}

// os in [darwin, linux, win32...] (https://nodejs.org/api/os.html#os_os_platform)
// return value in [darwin, linux, windows]
function mapOS(os) {
    const mappings = {
        win32: 'windows'
    };
    return mappings[os] || os;
}
