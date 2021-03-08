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
uses: nemerosa/ontrack-github-actions-cli-setup@v1
```
