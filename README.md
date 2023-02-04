# 易企管理后台

## 初始化工程

安装 `node_modules` 依赖:

```bash
npm install
```

或者

```bash
yarn
```

## 可运行脚本

详细请查看 `package.json` 的 scripts 目录

### 运行工程

```bash
npm start
```

或者

```bash
yarn start
```

### 构建生产代码

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

使用以下命令查看代码错误：

```bash
npm run lint:fix
```

### 代码测试

```bash
npm test
```

### 更多

访问 [Antd Pro 官网](https://pro.ant.design) 查看完整文档。

### git commit 规范

```
type: commit 的类型
feat: 新特性
fix: 修改问题
refactor: 代码重构
docs: 文档修改
style: 代码格式修改, 注意不是 css 修改
test: 测试用例修改
chore: 其他修改, 比如构建流程, 依赖管理.
scope: commit 影响的范围, 比如: route, component, utils, build...
subject: commit 的概述, 建议符合  50/72 formatting
body: commit 具体修改内容, 可以分为多行, 建议符合 50/72 formatting
footer: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.
```
