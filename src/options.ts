import * as core from '@actions/core'

export interface Options {
  readonly cache: boolean
  readonly version: string
}

function findOption(inputKey: string, envKey: string) {
  const input = core.getInput(inputKey)

  if (input.length === 0) {
    return process.env[envKey] ?? null
  } else {
    return input
  }
}

const getOptions: () => Options = () => ({
  version: findOption('version', 'ST_VERSION') ?? 'latest',
  cache: (findOption('enable-cache', 'ST_ENABLE_CACHE') ?? 'true') === 'true',
})

export default getOptions