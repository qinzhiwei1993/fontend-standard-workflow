# fontend-standard-workflow

代码规范校验，`commit msg` 校验，CHANGELOG.md 生成，版本升级，打 tag，发布 release

---

目前项目已经加入`eslint`校验代码风格，并且在`git`钩子`pre-commit`时做了拦截校验，如果格式存在问题，就无法`commit`

现在要做的是对这之后的工作流程做进一步优化，使整个的流程更加规范化:

1. 对`commit msg`校验，使用`Conventional Commits`规范
2. 每次发版之后在`master`根据当前`package.jon`的版本号打`tag`([conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)会根据`tag`生成版本变更信息)
3. 根据`git log`信息，自动生成`CHANGELOG.md`，前提是必须遵循`Conventional Commits`规范
4. 发布`release`

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

1. build
2. ci
3. chore
4. docs
5. feat
6. fix
7. perf
8. refactor
9. revert
10. style
11. test