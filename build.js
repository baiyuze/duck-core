import tag from './tag.js'
import { removeSync, ensureFileSync } from 'fs-extra/esm'
import { spawn } from 'node:child_process'
import { globSync } from 'glob'
import path from 'path'
import fs from 'fs-extra/esm'
import { writeFileSync } from 'fs'
import slash from 'slash'
import crossSpawn from 'cross-spawn'
import { zip } from './ZipAFolder.js'
import os from 'os'
import chalk from 'chalk'
import cloneDeep from 'lodash/cloneDeep.js'
import ora from 'ora'

const assetsUrl =
  'https://lmes:gldt-ocw4NMSiDHD461ZoDvyK@gitlab.syc-cms.com:8443/lmes-plugin/web/assets.git'
const baseDir = './node_modules/.cache/wwwroot'
const baseBuildFile = './node_modules/.cache/widgets.json'
const hostPath = slash(path.resolve(process.cwd(), baseDir))
const hostZipPath = slash(path.resolve(process.cwd(), './wwwroot.zip'))
let isDebugMode = false
// 编译进程总数量
let buildSumCount = 0
let startTime = Date.now()
let widgetNames = []
// 剩余未编译结束数据
let remainWidgetNames = []
let isMultipleBuild = false
let spinner = ora('编译中，请稍后...\n')

removeHostPackage()
buildWidgets()

/**
 * 编译组件
 */
function buildWidgets() {
  const isWin = process.platform === 'win32'
  const argv = process.argv || []
  // 当debug模式下，将本地206环境下的图片地址映射到代码中，可以将.env环境进行设置VITE_STATIC_URL
  if (argv.includes('debug')) {
    isDebugMode = true
    argv.splice(argv.indexOf('debug'), 1)
  }
  // 支持传入多个组件名称进行打包，npm run build QualityManagement,ProcessManagement
  const widgetName = argv[argv.length - 1]

  const widgetsPath = globSync(`./src/widgets/*/index.ts`)
  widgetNames = widgetsPath.map((file) => {
    const parts = isWin
      ? path.resolve(file).split('\\')
      : path.resolve(file).split('/')
    return parts[parts.length - 2]
  })
  const originWidgets = [...widgetNames]
  let remainWidgetNames = [...widgetNames]
  if (widgetName.includes(',')) {
    isMultipleBuild = true
    widgetName.split(',').forEach((name) => {
      if (!widgetNames.includes(name)) {
        console.error(chalk.red(`组件${name}不存在`))
        process.exit(1)
      }
    })
    widgetNames = widgetName.split(',')
    remainWidgetNames = cloneDeep(widgetNames)
  } else {
    if (!widgetNames.includes(widgetName)) {
      isMultipleBuild = true
    } else {
      isMultipleBuild = false
    }
  }

  try {
    fs.removeSync('./dist')
  } catch (error) {
    console.error('dist不存在，继续执行打包任务')
  }
  buildSumCount = widgetNames.length

  function buildWidget(currentBuildWidgets) {
    const isWidgetArray = Array.isArray(currentBuildWidgets)
    // 打包一个组件
    if (!isWidgetArray || (widgetName && originWidgets.includes(widgetName))) {
      runBuild(null, !isWidgetArray ? currentBuildWidgets : widgetName)
    } else {
      // 打包多组件，按CPU默认并行度打包
      const buildWidgets = divideArray(currentBuildWidgets)
      const slashPath = slash(path.resolve(process.cwd(), baseBuildFile))
      ensureFileSync(slashPath)
      writeFileSync(slashPath, JSON.stringify(buildWidgets, null, 2))
      for (let index = 0; index < Object.keys(buildWidgets).length; index++) {
        const widgets = buildWidgets[index]
        if (widgets.length) {
          runBuild(index)
        }
      }
    }
  }
  async function build(buildWidgetName) {
    if (!buildWidgetName) {
      const cpus = os.availableParallelism()
      const currentBuildWidgets = widgetNames.splice(0, cpus)
      buildWidget(currentBuildWidgets)
    } else {
      buildWidget(buildWidgetName)
    }
  }
  function start() {
    spinner.start()
    build()
  }
  start()

  /**
   * 运行编译
   * @param {*} nodeIndex 设置打包组件起点
   */
  function runBuild(nodeIndex, widgetName) {
    // return new Promise((resolve,reject) => {

    const cmdParams = ['run', 'build-lib']
    cmdParams.push(isDebugMode ? 'development' : 'production')
    const run = spawn(
      process.platform === 'win32' ? 'npm.cmd' : 'npm',
      cmdParams,
      {
        // stdio: 'inherit',
        shell: true,
        env: {
          // 编译组件索引映射
          ...process.env,
          NODE_INDEX: nodeIndex,
          BUILD_WIDGET_NAME: widgetName,
        },
      }
    )

    const errTpl = `node_modules/@microsoft/signalr/dist/esm/Utils.js`

    run.stderr.on('data', (data) => {
      const error = data.toString()
      if (error.includes(errTpl)) return
      if (error.includes('error')) {
        console.error(
          chalk.red(`编译组件${widgetName}失败，错误信息：\n${error}`)
        )
        process.exit(1)
      } else {
        console.warn(`编译组件${widgetName}警告信息：\n${error}`)
      }
    })

    run.on('close', async (code) => {
      // 添加打包hash
      remainWidgetNames.shift()
      if (
        (!widgetNames.length && !remainWidgetNames.length) ||
        !isMultipleBuild
      ) {
        spinner.stop()
        await tag()
        if (isMultipleBuild) {
          console.log(
            chalk.green(`\n已经编译完所有组件，正在添加版本tag，请稍后...\n`)
          )
          console.log(chalk.green(`\n开始打包wwwroot.zip包\n`))
          getHostPackage()
        } else {
          console.log(
            chalk.green(`\n编译总时间: ${(Date.now() - startTime) / 1000}秒\n`)
          )
        }
      } else {
        const name = widgetNames.shift()
        if (name && widgetNames.length) {
          spinner.text = `正在编译组件: ${chalk.green(
            name
          )}，剩余组件数量：${chalk.green(widgetNames.length)}\n`
        }

        if (name && isMultipleBuild) {
          build(name)
        }
      }
    })
    // })
  }
}
/**
 * 获取等分的组件数据
 * @param {*} widgets
 * @param {*} cpus
 * @returns
 */
function divideArray(widgets) {
  // 当打包时，操作电脑可能会卡
  const cpus = os.availableParallelism()
  let result = {}
  let dataPerKey = Math.floor(widgets.length / cpus)
  let remainingData = widgets.length
  for (let i = 0; i < cpus; i++) {
    let currentDataCount = Math.min(dataPerKey, remainingData)
    result[i] = widgets.splice(0, currentDataCount)
    remainingData -= currentDataCount
  }
  if (widgets.length) {
    widgets.forEach((widgetName, index) => {
      result[index].push(widgetName)
    })
  }
  return result
}
/**
 * 获取host包 zip包
 * @param {*}
 */
function getHostPackage() {
  const resourcesPath = slash(
    path.resolve(process.cwd(), `${baseDir}/resources`)
  )

  const widgetsPath = slash(path.resolve(process.cwd(), `${baseDir}/widgets`))
  const currentDistPath = slash(path.resolve(process.cwd(), './dist'))
  const isResources = fs.pathExistsSync(resourcesPath)
  const isWidgets = fs.pathExistsSync(widgetsPath)
  if (!isResources) {
    fs.mkdirpSync(resourcesPath)
  }
  if (!isWidgets) {
    fs.mkdirpSync(widgetsPath)
  }

  const git = crossSpawn.sync('git', ['clone', assetsUrl, '-b', 'develop'], {
    stdio: 'inherit',
    cwd: resourcesPath,
    shell: true,
  })

  if (git.status === 0) {
    fs.removeSync(slash(path.resolve(resourcesPath, './assets/.git')), {
      recursive: true,
    })
    const dirs = globSync(slash(path.resolve(currentDistPath, './**/*.js')))
    dirs.forEach((dir) => {
      const widgetName = slash(dir).replace(currentDistPath, '.')
      const widgetPath = slash(path.resolve(widgetsPath, widgetName))

      fs.copySync(slash(dir), widgetPath)
    })
    zipDir(hostPath, hostZipPath)
      .then(() => {
        console.log(chalk.green(`${hostZipPath} 压缩成功`))
        fs.removeSync(hostPath, {
          recursive: true,
        })
        console.log(
          chalk.green(`\n编译总时间: ${(Date.now() - startTime) / 1000}秒\n`)
        )
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
/**
 * 压缩zip包
 * @param {*} dir
 * @param {*} zipPath
 * @returns
 */
function zipDir(dir, zipPath) {
  return new Promise(async (resolve, reject) => {
    try {
      await zip(slash(dir), slash(zipPath))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
/**
 * 删除host包
 * @param {*}
 */
function removeHostPackage() {
  if (fs.pathExistsSync(hostPath)) {
    fs.removeSync(hostPath, {
      recursive: true,
    })
  }
  if (fs.pathExistsSync(hostZipPath)) {
    fs.removeSync(hostZipPath, {
      recursive: true,
    })
  }
}
