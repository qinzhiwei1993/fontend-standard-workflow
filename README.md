# fontend-standard-workflow

代码规范校验，commit msg校验，CHANGELOG.md生成，版本升级，打tag，发布release

---

目前项目已经加入`eslint`校验代码风格，并且在`git`钩子`pre-commit`时做了拦截校验，如果格式存在问题，就无法`commit`

现在要做的是对这之后的工作流程做进一步优化，使整个的流程更加规范化: 

1. 对`commit msg`校验，使用`Conventional Commits`规范
2. 每次发版之后在`master`根据当前`package.jon`的版本号打`tag`([conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)会根据`tag`生成版本变更信息)
3. 根据`git log`信息，自动生成`CHANGELOG.md`，前提是必须遵循`Conventional Commits`规范
4. 发布`release`



## 1. [husky](https://typicode.github.io/husky/#/)

拦截`Git Hooks`，让你在`Git`的生命周期做一些事情。这里使用的是 `husky v5`

huksy支持所有`Git Hooks`: 

1. 校验`commit msg`
2. 校验代码格式
3. 运行测试
...


## 2. [lint-stage](https://github.com/okonet/lint-staged)

使用`huksy`拦截`Git Hooks`，会导致，即便你只改了一个`js`文件，但是`git commit`的时候，还是会校验所有的`js`文件

`lint-stage`就可以解决上面发生的问题,它只会校验你提交或者说你修改的**部分内容**
