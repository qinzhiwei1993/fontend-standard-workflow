#!/usr/bin/env node

// 1. 获取远程最新版本号
// 2. 判断是beta发版还是生产发版，升级版本号
// 3. 变更packcage.json中版本号和package-lock.json中版本号
// 4. publish package

// 合并到master
// 打 tag
// 生成CHANGELOG 和 发布github releaser
// 根据实际情况，更改CHANGELOG，然后push

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const argvs = yargs(hideBin(process.argv))
    .option('releaser', {
        alias: 'r',
        type: 'boolean',
        description: '是否发布releaser到github或者gitLab'
    })
    .option('changelog', {
        alias: 'c',
        type: 'boolean',
        description: '是否更新CHANGELOG.md'
    })
    .option('update-version', {
        alias: 'u',
        type: 'boolean',
        description: '是否更新package.json中版本号'
    })
    .option('publish', {
        alias: 'p',
        type: 'boolean',
        description: '是否发布package'
    })
    .option('tag', {
        alias: 't',
        type: 'boolean',
        description: '是否添加tag'
    })
    .argv

console.log('yargs', argvs)

