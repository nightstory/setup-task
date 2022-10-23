import * as shell from 'shelljs';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as cache from '@actions/cache';
import * as os from 'os';

export const installTask = async (useCache: boolean, version: string) => {
  const taskDir = os.homedir() + '/setup-task/'
  const taskDirBin = os.homedir() + '/setup-task-bin/'
  const cacheKey = 'setup-task-cache-key'

  if (useCache) {
    const restored = await cache.restoreCache([taskDirBin], cacheKey)
    core.addPath(taskDirBin + 'bin')
    shell.chmod('+x', `${taskDirBin}/bin/task`)

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
    core.addPath(taskDirBin + 'bin')
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
  const url = `https://raw.githubusercontent.com/nightstory/task/master/install-task.sh`
  await exec.exec('curl', [
    '--silent',
    '--create-dirs',
    '--location',
    '--output',
    file,
    url,
  ])
  shell.chmod('+x', file)
  await exec.exec(file, ['-b', `${binDir}/bin`, version], {cwd: downloadDir})
  await exec.exec('rm', ['-rf', downloadDir])
  shell.chmod('+x', `${binDir}/bin/task`)

  core.info('✅ task is installed!')
};