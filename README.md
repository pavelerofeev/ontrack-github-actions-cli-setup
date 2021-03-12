# Ontrack GitHub actions: CLI setup

GitHub action to setup the [Ontrack CLI](https://github.com/nemerosa/ontrack-cli).

## Inputs

### `version`

Version of the [Ontrack CLI](https://github.com/nemerosa/ontrack-cli/releases) to install. If not specified, defaults to the latest available.

## Outputs

### `installed`

Version which has actually been installed.


## Example usage

```yaml
- name: Setup the CLI
  uses: nemerosa/ontrack-github-actions-cli-setup@v1
# You can then use `ontrack-cli` directly
- name: Connect to Ontrack
  runs: ontrack-cli config create prod <ontrack-url> --token <token>
- name: Branch setup
  runs: ontrack-cli branch setup --project <project> --branch <branch>
- name: Build creation
  runs: ontrack-cli build setup  --project <project> --branch <branch> --build <build>
```

## Building

Download the dependencies by running:

```bash
npm install
```

To build the distribution:

```bash
ncc build
```
