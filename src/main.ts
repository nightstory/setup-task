import * as core from '@actions/core'

import getOptions from './options';
import {installTask} from './setuper';

const main = async () => {
  const {cache, version} = getOptions()

  await installTask(cache, version)
}

try {
  main()
} catch (error) {
  core.setFailed(`${error}`)
}