const core = require('@actions/core');
const github = require('@actions/github');

try {
    // Gets the version, if available
    let version = core.getInput('version');
    // TODO If the version is not provided, computes the latest
    if (!version) {
        console.log("No version provided. Getting the latest version from GitHub.")
        version = '0.0.9';
    }
    console.log(`Using version: ${version}`);
} catch (error) {
    core.setFailed(error.message);
}
