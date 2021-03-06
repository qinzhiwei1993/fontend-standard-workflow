# fontend-standard-workflow

代码规范校验，`commit`规范校验，`CHANGELOG.md`生成，版本升级，打`tag`，发布`release`

---

目前前端项目已经在`pre-commit`时使用`lint-stage`和`eslint`做了增量的代码格式校验，在代码层面做了一定程度的规范化。为了进一步规范前端开发的流程以及便于协同工作时方便其他人知道我们每个版本都做了些什么，或者我们自己回顾自己做的东西时，更清晰易懂，不必切到当时的分支去查看代码。因此，我对代码校验后的流程又做了如下的一些规范化优化：


1. 对`commit`使用`Conventional Commits`规范
2. 在`commit-msg`阶段对`commit`进行校验
3. 无论是项目还是组件库都要有自己的版本，每完成一个版本都要采用`semver`规范，升级版本，并且打上`tag`
4. 发版之后，根据提交的`commit`信息生成`CHANGELOG.md`
5. 发布`release`,这里的`release`指的是`github`或者`gitlab`中的`release`


---

在开始前介绍整个流程前，先看下实现后的效果图: 

![image](./images/WX20201228-144307@2x.png)

![image](./images/WX20201228-144436@2x.png)


---

下面介绍在优化整个流程过程中用到的工具(部分常用的工具只做简单介绍):


## 1. [husky](https://typicode.github.io/husky/#/)

拦截`Git Hooks`，让你在`Git`的生命周期做一些事情。这里使用的是 `husky v4`

huksy 支持所有`Git Hooks`:

1. 校验`commit msg`
2. 校验代码格式
3. 运行测试
   ...

## 2. [lint-stage](https://github.com/okonet/lint-staged)

使用`huksy`拦截`Git Hooks`，会导致，即便你只改了一个`js`文件，但是`git commit`的时候，还是会校验所有的`js`文件

`lint-stage`就可以解决上面发生的问题,它只会校验你提交或者说你修改的**部分内容**

## 3. [eslint](https://github.com/eslint/eslint#installation-and-usage)

代码格式校验

---

### **在开始介绍如何拦截`commit-msg`，并生成`CHANGELOG.md`之前，我们需要先知道，目前比较主流的`commit-msg`规范是怎么样的？**

[conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/)是目前使用最广的写法，比较合理和系统化，并且有配套的工具

每次提交，Commit message 都包括三个部分：Header，Body 和 Footer。

```
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

其中，Header 是必需的，Body 和 Footer 可以省略。

#### 3.1 Header

Header 部分只有一行，包括三个字段：`type`（必需）、`scope`（可选）和`subject`（必需）

> （1） `type`用于说明 commit 的类别

```
feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动
...
```

> （2）`scope`用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

> （3）`subject`是 commit 目的的简短描述，不超过 50 个字符

#### 3.2 Body

Body 部分是对本次 commit 的详细描述，可以分成多行

#### 3.3 Footer

> （1）不兼容变动

如果当前代码与上一个版本不兼容，则 Footer 部分以`BREAKING CHANGE`开头，后面是对变动的描述、以及变动理由和迁移方法

> （2）关闭 Issue

如果当前 commit 针对某个 issue，那么可以在 Footer 部分关闭这个 issue

```
Closes #123, #245, #992
```

---

## 4. [commitizen](https://github.com/commitizen/cz-cli)交互式提交`commit-msg`

这里只介绍本地使用的方式，便于协同作业，安装的版本相同

```shell
# 安装
npm install --save-dev commitizen
# 安装适配器，使项目对commitizen友好
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

在`package.json`中配置

```json
{
    "scripts": {
        "commit": "cz"
    }
}

// npm run commit 后将弹出交互命令行
```

如果想强制必须使用该交互方式，可以拦截`prepare-commit-msg`，那么在`git commit`时也会弹出交互命令行

```json
{
    "husky": {
        "hooks": {
            "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true"
        }
    }
}
```

## 5.[commitlint](https://github.com/conventional-changelog/commitlint#what-is-commitlint)

在介绍完`conventional commit`和交互式的`commit`工具之后，现在还需要一个能校验我们所提交的代码是否严格遵循了`conventional commit`规范的工具。这个工具就是`commitlint`

这个工具使用很简单，仅需一下两步即可：

```shell
# Install commitlint cli and conventional config
npm install --save-dev @commitlint/{config-conventional,cli}

# Configure commitlint to use conventional config
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

[commitlint-config-conventional (based on the the Angular convention)](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#type-enum) 支持一下类型:

1. `build`: 影响构建系统或外部依赖项的更改(示例范围:gulp、broccoli、npm)
2. `ci`: 对 CI 配置文件和脚本的更改(示例范围:Travis, Circle, BrowserStack, SauceLabs)
3. `chore`: 其他不修改 src 或测试文件的更改, 发版
4. `docs`: 文档变更
5. `feat`: 新的特性、功能
6. `fix`: bug 修复
7. `perf`: 性能优化
8. `refactor`: 重构
9. `revert`: 返回先前的提交
10. `style`: 不影响代码含义的更改(空白、格式、缺少分号等)
11. `test`: 测试

## 6.[conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)

`commit-msg`的交互式提交和格式校验工具都已经实现，下面就需要根据我们的**约定提交**内容生成变更文档了`CHANGELOG.md`

`conventional-changelog`提取`git log`历史信息，然后生成文档

快速开始

```bash
$ npm install -g conventional-changelog-cli
$ cd my-project

# 在之前CHANGELOG.md基础上叠加，更新最近一个tag的commit msg
$ conventional-changelog -p angular -i CHANGELOG.md -s

# 更新全部commit msg，覆盖CHANGELOG.md
conventional-changelog -p angular -i CHANGELOG.md -s -r 0
```

在`package.json`中配置

```json
{
    "scripts": {
        "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
    }
}
```

## 7. 自动发版工具[standard-version](https://github.com/conventional-changelog/standard-version)

**语义化版本控制**版本格式：`MAJOR.MINOR.PATCH`，版本号递增规则如下：

主版本号：当你做了不兼容的 API 修改，
次版本号：当你做了向下兼容的功能性新增，
修订号：当你做了向下兼容的问题修正

`standard-version`是基于[semver](https://semver.org/)(Semantic Versioning)和[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)进行版本变更和生成 changeLog 的实用工具

`standard-version`作了以下几件事:

1. 查看`package.json`中版本
2. 升级`package.json`中版本号和`package-lock.json`中版本号
3. 基于[conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) 生成`changelog`
4. 创建一个新的 commit（包含`bumpFiles`和更新的`CHANGELOG`）
5. 基于新的版本创建`tag`

### 快速开始

1. 安装依赖

`npm install --save-dev standard-version`

2. 在`package.json`中添加脚本

```json
{
    "scripts": {
        "release": "standard-version"
    }
}

// npm run release
```

## 8.[conventional-github-releaser](https://github.com/conventional-changelog/releaser-tools)

发布到`Github release`或者`GitLab release`

**不建议将`Personal access tokens`放到项目本地使用，发布到`github`识别后会立即失效**
### 快速开始

```bin
$ npm install -g conventional-github-releaser
$ cd my-project
$ conventional-github-releaser -p angular
```

```json
// package.json
{
    "scripts": {
        "release": "conventional-github-releaser -p angular -n changelog-options.js -i CHANGELOG.md -s -r 0 -t e3c6d36e80b8faba29f44e91c5778a8271e83291"
    }
}
```

## 9.脚本配置

```json
{
    "scripts": {
        "commit": "cz", // conventional-commit 交互式提交 commit
        "changelog": "conventional-changelog -p angular -n changelog-options.js -i CHANGELOG.md -s -r 0", // 生成 CHANGELOG.md
        "github-releaser": "conventional-github-releaser -p angular -n changelog-options.js -i CHANGELOG.md -s -r 0 -t e3c6d36e80b8faba29f44e91c5778a8271e83291", // 发布github或者gitlab releaser
        "update-project-version: project-minor": "node scripts/release/version-updater.js -t project -r minor", // 更新项目的版本信息
        "update-project-version: project-patch": "node scripts/release/version-updater.js -t project -r minor", // 更新项目的版本信息
        "update-package-version: patch": "node scripts/release/version-updater.js -r patch", // 更新组件库版本信息
        "update-package-version: minor": "node scripts/release/version-updater.js -r minor",// 更新组件库版本信息
        "tag": "node scripts/release/tag.js", // 打tag标签
        "release": "npm run tag && npm run github-releaser"
    }
}
```

## 10. 推荐工作流程

- `package`(组件库)
    - 需求开发
    - 提交commit
    - beta发版
        - `update-package-version: patch` 更新组件库版本，然后打包`publish`
    - release发版
        - `update-package-version: minor` 更新组件库版本，然后打包`publish`
        - `release`分支重新发版，`update-package-version: patch` 更新组件库版本，然后打包`publish`
    - master发版
        - `changelog` -> 在`CHANGELOG.md`添加迭代相关信息 -> `commit` -> `release`
- 迭代项目
    - 需求开发
    - 提交commit
    - beta发版
        - `build`
    - release发版
        - `update-project-version: project-minor` 版本，然后`build`
        - `release`分支重新发版，`update-project-version: project-patch` 更新版本，然后打包`build`
    - master发版
        - `changelog` -> 在`CHANGELOG.md`添加迭代相关信息 -> `commit` -> `release`



