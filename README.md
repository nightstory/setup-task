# Setup custom `go-task/task` GitHub Action

A GitHub Action Wrapper for the delightful [`go-task`](https://github.com/go-task/task) CLI tool.

## Inputs (optional)
* `enable-cache`:
  Cache or not the installation. Default: `true`
* `version`:
  The version of custom task to be used. Check <https://github.com/nightstory/task/releases> for valid options.
  Default: `v3.17.0-gcp-gha`

## Example usage
```yaml
uses: nightstory/setup-task@v1
with:
  enable-cache: true
  version: v3.17.0-gcp-gha
```