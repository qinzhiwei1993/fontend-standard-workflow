/****
 * 
 * 给当前版本创建标签
 *   创建标签前请确保本地所有变更已经全部提交
 */
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const log = console.log
// 命令行执行时所在位置
const CWD = process.cwd()


const readPackage = () => {
    const filePath = path.resolve(CWD, './package.json')
    const packageJson = JSON.parse(fs.readFileSync(filePath))
    return packageJson
}

const version = readPackage().version

const CMD = `git tag v${version}`

log(chalk.keyword('orange')(`请确保本地所有变更已经'commit'`))

exec(CMD, (err, stdout, stderr) => {
    if (err) {
        return log(chalk.red(stderr))
    }
    log(chalk.green(`taged ${version} success!`))
    log(chalk.green(`please run 'git push --follow-tags' if you are ready`)) // --follow-tags参数会使得 commit 以及与之相关的标签（注意，不是所有的标签）一起推送
})