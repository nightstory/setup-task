import shell from 'shelljs';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import os from 'os';
import cache from '@actions/cache';

export const installTask = async (useCache: boolean, version: string) => {
  const taskDir = os.homedir() + '/setup-task/'
  const taskDirBin = os.homedir() + '/setup-task-bin/'
  const cacheKey = 'setup-task-cache-key'

  if (useCache) {
    const restored = await cache.restoreCache([taskDirBin], cacheKey)
    core.addPath(taskDirBin + '/bin')

    if (restored && isTaskAvailable()) {
      core.info('🎉 task available from cache!')
    } else {
      await downloadInstallTask(version, taskDir, taskDirBin)

      core.info('📦 task is being added to cache...')
      await cache.saveCache([taskDirBin], cacheKey)
      core.info('✅ task is cached successfully!')
    }
  } else {
    await downloadInstallTask(version, taskDir, taskDirBin)
    core.addPath(taskDirBin + '/bin')
  }

  if (!isTaskAvailable()) {
    core.setFailed('❌ task is still not accessible, please contact action maintainers!')
  }
};

const isTaskAvailable: () => boolean =
  () => !!shell.which('task');

const downloadInstallTask = async (version: string, downloadDir: string, binDir: string) => {
  core.info('⌛ task is installing...')

  const file = downloadDir + 'install-task.sh'
  const url = version === 'latest'
    ? 'https://github.com/nightstory/task/releases/latest/download/install-task.sh'
    : `https://github.com/nightstory/task/releases/download/${version}/install-task.sh`
  await exec.exec('curl', [
    '--silent',
    '--create-dirs',
    '--location',
    '--output',
    file,
    url,
  ])
  await exec.exec(file, ['-b', binDir, version], {cwd: downloadDir})
  await exec.exec('rm', ['-rf', downloadDir])

  core.info('✅ task is installed!')
};