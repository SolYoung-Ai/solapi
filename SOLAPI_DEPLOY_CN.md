# SolAPI 部署指南（中文）

> SolAPI 是 SolYoung 出品的 AI API 中转平台，基于开源项目 Sub2API 改造而来。
> 本指南面向 SolAPI 仓库（`https://github.com/SolYoung-Ai/solapi`）的实际部署。

---

## 0. 项目架构

| 组件 | 技术 | 说明 |
|------|------|------|
| 前端 | Vue 3 + Vite + Tailwind CSS | 已内嵌进后端二进制（`embed` tag），也可独立开发 |
| 后端 | Go + ent | 单一二进制，提供 Web UI + API 网关 |
| 数据库 | PostgreSQL | 业务数据持久化 |
| 缓存 | Redis | 会话、限流、队列等 |
| 反向代理 | Caddy（可选） | HTTPS 自动证书 + 健康检查 |

---

## 1. 环境要求

- Docker 24+ 与 Docker Compose v2（推荐方式）
- 或 Go 1.27+ / Node.js 22+（源码方式）
- 至少 2GB 可用内存（含 PostgreSQL + Redis）

---

## 2. 方式一：Docker Compose 部署（推荐）

### 2.1 构建 SolAPI 镜像

本仓库没有发布官方镜像，请基于源码本地构建：

```bash
cd solapi

# 国内网络可加构建参数加速
docker build -t solyoung/solapi:latest . \
  --build-arg NPM_CONFIG_REGISTRY=https://registry.npmmirror.com \
  --build-arg GOPROXY=https://goproxy.cn,direct
```

> 根目录 `Dockerfile` 为多阶段构建：前端打包 → Go 后端（内嵌前端）→ 精简运行镜像。
> 首次构建约 5-15 分钟，取决于网络。

### 2.2 准备环境变量

```bash
cd deploy
cp .env.example .env
chmod 600 .env
# 编辑 .env：必须设置强随机密码
#   POSTGRES_PASSWORD、JWT_SECRET、TOTP_ENCRYPTION_KEY、REDIS_PASSWORD
```

自动生成安全密钥的替代方式：

```bash
./docker-deploy.sh
# 该脚本会下载 compose 文件、生成随机密钥并创建数据目录
```

### 2.3 启动服务

```bash
# 使用本地目录卷版本（便于数据迁移与备份）
docker compose -f docker-compose.local.yml -f docker-compose.solapi.yml up -d

# 或使用命名卷版本
# docker compose -f docker-compose.yml -f docker-compose.solapi.yml up -d
```

首次启动会自动完成数据库迁移与初始化（`AUTO_SETUP=true`），无需 Setup Wizard。

### 2.4 验证

```bash
# 健康检查
curl -s http://localhost:8080/health
# 预期输出包含 ok/up 状态（HTTP 200）

# 查看日志
docker compose -f docker-compose.local.yml -f docker-compose.solapi.yml logs -f sub2api

# 查看运行状态
docker compose -f docker-compose.local.yml -f docker-compose.solapi.yml ps
```

访问 `http://localhost:8080` 即可打开 SolAPI 控制台。

---

## 3. 方式二：源码构建部署（无 Docker）

### 3.1 前端构建

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm run build   # 产物输出到 frontend/dist
```

### 3.2 后端构建（内嵌前端）

```bash
cd backend
go build -tags embed -ldflags="-s -w" -o bin/server ./cmd/server
```

> `-tags embed` 会把前端 `dist` 内嵌进二进制，单文件即可运行。

### 3.3 配置与运行

```bash
cp deploy/config.example.yaml /etc/sub2api/config.yaml
# 按需修改 config.yaml（数据库、Redis、站点名称等）

./bin/server -config /etc/sub2api/config.yaml
```

---

## 4. 关键环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `SERVER_PORT` | 否 | 服务端口，默认 8080 |
| `SERVER_MODE` | 否 | `release` / `debug` |
| `POSTGRES_HOST/PORT/USER/PASSWORD/DB` | 是 | PostgreSQL 连接 |
| `REDIS_ADDR/PASSWORD` | 是 | Redis 连接 |
| `JWT_SECRET` | 是 | 登录令牌签名密钥，必须为强随机值 |
| `TOTP_ENCRYPTION_KEY` | 是 | TOTP/敏感字段加密密钥，必须为强随机值 |
| `AUTO_SETUP` | 容器部署是 | 首次启动自动迁移初始化 |
| `UPDATE_GITHUB_TOKEN` | 否 | 可选，用于 GitHub Release 更新检查 |

> 生产环境务必修改所有默认密钥；`.env` 文件权限设为 `600`。
> 严禁将真实 API Key、支付密钥、JWT 密钥提交到 Git 仓库。

---

## 5. 数据持久化与备份

### 5.1 数据目录

- `docker-compose.yml`：命名卷 `sub2api_data`、`postgres_data`、`redis_data`
- `docker-compose.local.yml`：本地目录 `./data`、`./postgres_data`、`./redis_data`（推荐，便于备份）

### 5.2 备份

```bash
# PostgreSQL 备份
docker compose exec postgres pg_dump -U postgres sub2api > backup_$(date +%Y%m%d).sql

# 恢复
cat backup_20260101.sql | docker compose exec -T postgres psql -U postgres sub2api
```

### 5.3 健康检查

Compose 已为应用配置 `/health` 健康检查（`start_period` 内不重启实例）。Caddyfile 也配置了 `/health` 探测。

---

## 6. 反向代理与 HTTPS（Caddy）

`deploy/Caddyfile` 已包含完整 HTTPS 配置模板：

```bash
cd deploy
# 1. 修改 Caddyfile 第一行域名为你的真实域名
#    api.sub2api.com → api.solyoung.top

# 2. 将 Caddyfile 放入 Caddy 数据目录或使用宿主机 Caddy
caddy run --config Caddyfile
```

Caddy 会自动申请 Let's Encrypt 证书并代理到 `localhost:8080`，内置 `/health` 健康检查与 TLS 安全基线。多节点场景参考 `EDGE_SECURITY.md` 配置可信代理 IP。

---

## 7. 升级与回滚

### 7.1 升级

```bash
cd solapi
git pull origin main            # 拉取最新代码
docker build -t solyoung/solapi:latest .
docker compose -f docker-compose.local.yml -f docker-compose.solapi.yml up -d
```

> 升级前建议先备份数据库（见第 5 节）。迁移脚本由后端启动时自动执行，保持向前兼容。

### 7.2 回滚

```bash
# 用旧镜像标签重建并重启（前提是旧版本已打标签）
docker build -t solyoung/solapi:previous .
docker compose -f docker-compose.local.yml -f docker-compose.solapi.yml up -d
```

---

## 8. 本地开发

```bash
# 前端热更新（默认代理到 localhost:8080）
cd frontend
pnpm install
pnpm run dev

# 后端（需本地 PostgreSQL/Redis）
cd backend
go run ./cmd/server
```

前端单元测试与检查：

```bash
cd frontend
pnpm run lint:check        # ESLint
pnpm run typecheck         # vue-tsc 类型检查
pnpm run check:i18n        # 中英文案键完整性
pnpm run test:run          # Vitest 全部单测
```

---

## 9. 常见问题

| 问题 | 处理 |
|------|------|
| 8080 端口被占用 | 修改 `.env` 中 `SERVER_PORT` |
| 首次启动报数据库连接失败 | 确认 PostgreSQL 已启动、密码与 `.env` 一致 |
| 前端构建内存不足 | 增大 Node 内存：`NODE_OPTIONS=--max-old-space-size=4096` |
| 登录后页面空白 | 确认 `SERVER_MODE=release` 与 `JWT_SECRET` 已正确配置 |
| 需要 CDN/WAF 防护 | 阅读 `deploy/EDGE_SECURITY.md` 配置可信代理与安全基线 |

---

## 10. 合规与风险提示

- SolAPI 仅为技术中转层，上游模型的使用须遵守 OpenAI、Anthropic、Google 等服务商条款及当地法律法规。
- 订阅共享、额度分配等用途可能存在服务商条款风险，请自行核实合规性，本产品不提供任何官方授权背书。
- 本项目沿用上游 Sub2API 的 LICENSE 与版权声明，未移除归属信息。
