# Clawpool Admin 插件发布清单

本文件用于记录 `@dhfpub/clawpool-openclaw-admin` 的已发布事实，以及后续版本发布时的执行清单。

## 已发布记录

### `0.2.2`（2026-03-18 CST）

- npm 包名：`@dhfpub/clawpool-openclaw-admin`
- 发布状态：已发布到 npm 官方源
- 发布执行人：`askie`
- 发布时间：`2026-03-18 08:13 CST`
- 计划内容：支持按精确 ID 执行 `contact_search` / `session_search`，替代模糊 `keyword` 查询
- 发布查询：`npm view @dhfpub/clawpool-openclaw-admin version dist-tags --registry=https://registry.npmjs.org`
- 已验证结果：
  - `npm test` 通过
  - `npm run pack:dry-run` 通过
  - npm `latest` 已更新为 `0.2.2`

### `0.2.0`（2026-03-17 CST）

- npm 包名：`@dhfpub/clawpool-openclaw-admin`
- 发布状态：已发布到 npm 官方源
- 发布执行人：`askie`
- 发布时间：`2026-03-17 16:47 CST`
- 计划内容：新增 speaking governance controls，支持群成员发言状态治理
- 发布查询：`npm view @dhfpub/clawpool-openclaw-admin version dist-tags --registry=https://registry.npmjs.org`
- 已验证结果：
  - `npm test` 通过
  - `npm run pack:dry-run` 通过
  - OpenClaw 隔离 profile 下本地 tarball 安装、启用、`plugins info`、skills 可见性检查通过
  - OpenClaw 隔离 profile 下从 npm 安装 `@dhfpub/clawpool-openclaw-admin`、启用、`plugins info`、skills 可见性检查通过
  - npm `latest` 已更新为 `0.2.0`

### `0.1.2`（2026-03-17 CST）

- npm 包名：`@dhfpub/clawpool-openclaw-admin`
- 发布状态：已发布到 npm 官方源
- 发布执行人：`askie`
- 发布时间：`2026-03-17 10:42 CST`
- 计划内容：README 补充与 `@dhfpub/clawpool-openclaw` 的职责边界、安装顺序与交叉引用
- 发布查询：`npm view @dhfpub/clawpool-openclaw-admin version dist-tags --registry=https://registry.npmjs.org`
- 已验证结果：
  - `npm test` 通过
  - `npm run pack:dry-run` 通过
  - npm `latest` 已更新为 `0.1.2`

### `0.1.1`（2026-03-17 CST）

- npm 包名：`@dhfpub/clawpool-openclaw-admin`
- 发布状态：已发布到 npm 官方源
- 发布执行人：`askie`
- 发布时间：`2026-03-17 10:39 CST`
- 计划内容：README 补充 `channels.clawpool` 前置依赖、required `tools` 配置与完整启用流程
- 发布查询：`npm view @dhfpub/clawpool-openclaw-admin version dist-tags --registry=https://registry.npmjs.org`
- 已验证结果：
  - `npm test` 通过
  - `npm run pack:dry-run` 通过
  - npm `latest` 已更新为 `0.1.1`
  - OpenClaw 隔离 profile 下从 npm 安装 `@dhfpub/clawpool-openclaw-admin`、启用、`plugins info clawpool-admin` 通过
  - `plugins info clawpool-admin` 包含 `Tools: clawpool_group, clawpool_agent_admin`

### `0.1.0`（2026-03-17 CST）

- npm 包名：`@dhfpub/clawpool-openclaw-admin`
- 发布状态：已发布到 npm 官方源
- 发布执行人：`askie`
- 发布时间：`2026-03-17 05:38 CST`
- 计划内容：typed optional admin tools、bundled skills、operator CLI
- 发布查询：`npm view @dhfpub/clawpool-openclaw-admin version dist-tags --registry=https://registry.npmjs.org`
- 已验证结果：
  - `npm test` 通过
  - `npm run pack:dry-run` 通过
  - OpenClaw 隔离 profile 下本地 tarball 安装、启用、`plugins info`、`plugins doctor` 通过
  - OpenClaw 隔离 profile 下从 npm 安装 `@dhfpub/clawpool-openclaw-admin`、启用、`plugins info`、`plugins doctor` 通过
  - `plugins info clawpool-admin` 包含 `Tools: clawpool_group, clawpool_agent_admin`
  - `openclaw clawpool-admin doctor` 在未配置 `channels.clawpool` 的洁净 profile 下输出账户可见性 JSON
  - npm `latest` 已更新为 `0.1.0`

## 0. 基本信息（每次后续发布必须填写）

- [ ] 插件目录：`openclaw_plugins/clawpool-openclaw-admin`
- [ ] npm 包名：`@dhfpub/clawpool-openclaw-admin`
- [ ] 目标版本（SemVer）：`______`
- [ ] 发布执行人：`______`
- [ ] 发布时间（CST）：`______`
- [ ] 变更说明链接（PR/Issue）：`______`
- [ ] 风险等级：`低 / 中 / 高`
- [ ] 回滚负责人：`______`

## 1. 发布门禁（必须全部通过）

- [ ] `openclaw.plugin.json` 合法，且包含 `id`、`skills`、`configSchema`
- [ ] `package.json` 包含 `openclaw.extensions`
- [ ] `package.json` 包含 `openclaw.install.npmSpec/localPath/defaultChoice`
- [ ] 插件已通过 OpenClaw 注册 `clawpool-admin` CLI 命令
- [ ] `openclaw.extensions == ./dist/index.js`
- [ ] 工具元数据一致：
  - [ ] `openclaw.tools.clawpool_group.optional == true`
  - [ ] `openclaw.tools.clawpool_agent_admin.optional == true`
- [ ] npm 包元数据完整：
  - [ ] `repository`
  - [ ] `license`
  - [ ] `bugs`
  - [ ] `homepage`
  - [ ] `files`（限制发布内容）
  - [ ] `publishConfig.access == public`
- [ ] GitHub 源码仓库为公开可访问
- [ ] 仓库 README 包含安装、tool、CLI、skills 说明
- [ ] 仓库 README 明确说明 `channels.clawpool` 前置依赖
- [ ] 仓库 README 明确说明 required `tools` 配置：
  - [ ] `message`
  - [ ] `clawpool_group`
  - [ ] `clawpool_agent_admin`
  - [ ] `tools.sessions.visibility == agent`
- [ ] 仓库 README 明确说明何时只装 `@dhfpub/clawpool-openclaw`、何时必须同时安装 `@dhfpub/clawpool-openclaw-admin`
- [ ] 仓库 README 交叉引用 `openclaw_plugins/clawpool/README.md`
- [ ] 仓库 Issue Tracker 可用（用于问题收敛）

## 2. 阶段 A：本地校验

- [ ] 编译产物生成：
  - 命令：`npm install`
  - 命令：`npm run build`
  - 验收：生成 `dist/index.js`
- [ ] 打包预演：
  - 命令：`npm run pack:dry-run`
  - 验收：tarball 文件列表与预期一致，包含 `dist/index.js`、插件清单、README、LICENSE、`skills/**`，不包含 `src/*.ts`、sourcemap、测试与发布清单
- [ ] 本地链接安装：
  - 当前 OpenClaw `2026.3.13` 下，优先使用本地 tarball 安装回归而不是目录安装
  - 命令：`cd openclaw_plugins/clawpool-openclaw-admin && npm pack --ignore-scripts`
  - 命令：`openclaw --profile <name> plugins install <repo-root>/openclaw_plugins/clawpool-openclaw-admin/*.tgz`
- [ ] 启用与体检：
  - 命令：`openclaw --profile <name> plugins enable clawpool-admin`
  - 命令：`openclaw --profile <name> plugins list`
  - 命令：`openclaw --profile <name> plugins doctor`
- [ ] required tools 配置验证：
  - 验收：profile 配置中的 `tools.profile == coding`
  - 验收：`tools.alsoAllow` 包含 `message`、`clawpool_query`、`clawpool_group`、`clawpool_agent_admin`
  - 验收：`tools.sessions.visibility == agent`
- [ ] 工具可见性验证：
  - 命令：`openclaw --profile <name> plugins info clawpool-admin`
  - 验收：输出包含 `Tools: clawpool_query, clawpool_group, clawpool_agent_admin`
- [ ] 技能发布验证：
  - 验收：tarball 和本地安装结果都包含 `skills/clawpool-query/SKILL.md`
  - 验收：tarball 和本地安装结果都包含 `skills/clawpool-group-governance/SKILL.md`
  - 验收：tarball 和本地安装结果都包含 `skills/clawpool-agent-admin/SKILL.md`
- [ ] CLI 回归：
  - 命令：`openclaw clawpool-admin doctor`
  - 命令：`openclaw clawpool-admin create-agent --agent-name release-smoke`
- [ ] 与 `channels.clawpool` 已配置环境完成一次真实 group/admin tool 调用验证

## 3. 阶段 B：发布到 npm

- [ ] 确认账号具备 `@dhfpub` scope 发布权限
- [ ] 登录校验：
  - 命令：`npm login --registry=https://registry.npmjs.org`
  - 命令：`npm whoami --registry=https://registry.npmjs.org`
- [ ] 更新 `package.json` 版本号
- [ ] 正式发布：
  - 命令：`npm publish --access public --registry=https://registry.npmjs.org`
- [ ] 发布后查询：
  - 命令：`npm view @dhfpub/clawpool-openclaw-admin version dist-tags --registry=https://registry.npmjs.org`

## 4. 阶段 C：从 npm 安装回归

- [ ] 全新安装验证：
  - 命令：`openclaw plugins install @dhfpub/clawpool-openclaw-admin`
- [ ] 启用与体检：
  - 命令：`openclaw plugins enable clawpool-admin`
  - 命令：`openclaw plugins doctor`
- [ ] 依赖约束验证：
  - 验收：未配置 `channels.clawpool` 时，`openclaw clawpool-admin doctor` 输出 `configured: false` 的账户可见性结果
  - 验收：已配置 `channels.clawpool` 时，`openclaw clawpool-admin doctor` 输出目标账户配置
  - 验收：未启用 required tools 时，README 已明确说明工具不可直接被 agent 调用
- [ ] 功能回归：
  - [ ] `clawpool_query` 的 `contact_search` / `session_search` / `message_history` 调用正常
  - [ ] `clawpool_group` 的 `detail` 调用正常
  - [ ] `clawpool_agent_admin` 的 `create_api_agent` 调用正常
  - [ ] `create-agent` CLI 输出下一步命令正常

## 5. 阶段 D：提交官方社区插件收录

- [ ] fork 官方仓库：`openclaw/openclaw`
- [ ] 修改文件：`docs/plugins/community.md`
- [ ] 按官方格式新增条目（必须包含）：
  - [ ] 插件名
  - [ ] npm 包名
  - [ ] GitHub 仓库 URL
  - [ ] 一句话描述
  - [ ] 安装命令（`openclaw plugins install @dhfpub/clawpool-openclaw-admin`）
- [ ] 创建 PR 并附上：
  - [ ] 安装成功证据
  - [ ] 基础验证结果
  - [ ] 维护人联系方式

## 6. 发布后动作

- [ ] 在源码仓库打 Tag
- [ ] 更新 changelog（版本号与关键改动）
- [ ] 观察 issue 反馈与安装报错
- [ ] 如需紧急修复，按补丁版本（`x.y.z+1`）发版

## 7. 回滚预案（提前确认）

- [ ] 明确回滚触发条件（例如安装失败率、核心功能不可用）
- [ ] npm 处置策略：`deprecate` 当前问题版本并发布修复版
- [ ] 社区收录 PR 若有错误，提交修正 PR 或撤回条目
- [ ] 记录复盘：原因、影响范围、修复措施、防再发动作
