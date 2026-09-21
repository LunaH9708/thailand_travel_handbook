# 清迈 + 普吉岛 10 日旅行手册 · 部署说明

一个**单文件、零依赖、可离线**的旅行手册网页，部署到**免费的 Cloudflare Workers**，
通过 **GitHub 连接**实现「你 push 就自动上线」。任何人点开链接即可看，不用登录、不用装 App。

---

## 📁 这个仓库里有什么

| 文件 | 作用 |
|------|------|
| `public/index.html` | **整个网站就是这一个文件**，所有样式/脚本/数据都内嵌，离线可用 |
| `wrangler.toml` | Cloudflare Workers 配置（用 Static Assets 托管上面的 html） |
| `src/worker.js` | Workers 入口，把请求转给静态文件 |
| `.github/workflows/deploy.yml` | 备选：用 GitHub Actions 自动部署（可选） |

> 以后要改内容（比如补机票截图信息、划掉待办），**只改 `public/index.html` 一个文件**就行。

---

## 🖥️ 你需要亲手做的步骤（一次性）

下面标了 **[电脑]** 的步骤**必须在电脑上做**（涉及 Git、命令行、账号后台）；
标 **[手机也可]** 的用手机浏览器也能完成，但建议在电脑上做更顺手。

### 第 1 步 · 注册 GitHub 账号  **[手机也可，建议电脑]**
- 打开 https://github.com → 注册（免费）。
- 记好用户名和密码/验证码方式。

### 第 2 步 · 新建一个仓库  **[电脑]**
- 登录后点右上角 **＋ → New repository**。
- Repository name 填 `travel-handbook`（随便起，英文）。
- 选 **Public**（这样任何人都能访问）。
- 不要勾选 “Add a README”，其它保持默认 → 点 **Create repository**。

### 第 3 步 · 注册 Cloudflare 账号  **[手机也可，建议电脑]**
- 打开 https://www.cloudflare.com → 注册（免费，绑定邮箱+卡号仅用于防滥用，Workers 免费额度内不扣费）。
- 验证邮箱完成注册。

### 第 4 步 · 在电脑上安装 Git  **[电脑]**
- Windows：下载 https://git-scm.com 安装；Mac：终端跑 `xcode-select --install` 或装 Homebrew。
- 装好后打开终端验证：`git --version` 有版本号即可。
- 配置一次身份（终端执行）：
  ```
  git config --global user.email "你的邮箱"
  git config --global user.name "你的名字"
  ```

### 第 5 步 · 把本仓库的文件放进你的 GitHub 仓库  **[电脑]**
有两种方式，选一种：

**方式 A（推荐，最简单）—— 直接用 GitHub 网页上传**
1. 进入你刚建的 `travel-handbook` 仓库。
2. 把本地的 `public/index.html`、`wrangler.toml`、`src/worker.js`、`.github/` 文件夹
   直接拖进网页的 “uploading an existing file” 区域。
3. 写提交说明 `init`，点 **Commit changes**。
（注意：文件夹结构要保持 `public/index.html`、`src/worker.js`、`.github/workflows/deploy.yml` 不变。）

**方式 B —— 用 Git 命令行（你本地已有这些文件时）**
```
git clone https://github.com/你的用户名/travel-handbook.git
cd travel-handbook
# 把 public/、src/、wrangler.toml、.github/ 复制进这个目录
git add -A
git commit -m "init"
git push
```

### 第 6 步 · 在 Cloudflare 后台「连接 Git」让它自动上线  **[电脑]**
1. 登录 Cloudflare → 左侧 **Workers & Pages** → **Create** → 选 **Pages** 旁边的
   **Workers**（或直接在 Workers 里点 **Create Worker** 后选 “Connect to Git”）。
2. 授权连接你的 GitHub，选中 `travel-handbook` 仓库。
3. 配置（关键）：
   - **Framework preset / 构建命令**：留空（不需要构建）
   - **Output directory / 输出目录**：`public`
   - 分支：`main`
4. 点 **Deploy**（或 Save & Deploy）。
5. 等几十秒，Cloudflare 会给你一个公开网址，形如：
   `https://travel-handbook.<你的子域>.workers.dev`
   （也可在 Workers 设置里绑自己的域名，可选）。

> ✅ 完成这一步后，**以后你只要往 `main` 分支 push，网站就自动更新**——这就是「我 push 你就上线」。

---

## 🔁 以后怎么更新内容（比如补截图信息）

1. 把新的 `public/index.html`（我改好后会给你）覆盖进仓库并 push。
2. Cloudflare 自动重新部署，访客刷新即得最新版。
3. 想本地预览：直接双击 `public/index.html` 用浏览器打开即可（离线也能看）。

---

## ❓ 常见问题

- **网址打不开？** 确认仓库是 **Public**，且 Cloudflare 那一步 Output directory 填的是 `public`。
- **改了没生效？** Cloudflare 部署有几十秒延迟；浏览器可能缓存，强制刷新（Ctrl/Cmd+Shift+R）。
- **想换成自己的域名？** 在 Cloudflare Workers 的 **Custom Domains / Triggers** 里添加并解析 CNAME 即可（免费）。
- **免费额度够吗？** Workers 免费版每天 10 万次请求、Static Assets 免费额度足够个人旅行手册长期使用。

---

## 🗺 网页功能速览
- 顶部「此刻关注」：下一个行程事件 + 大号倒计时（天/时/分/秒，每秒跳），带泰国/当地时区。
- 行程总览地图：手绘感 SVG，按天配色画路线，标每晚住宿（🛏）。
- 已确认机票/酒店/行程：含时间、地址占位、电话（截图到齐后补全）。
- 逐日行程：左侧时间、右侧内容，标注需提前订/已付；每天可展开当日路线地图，一键打开全天 Google 导航。
- 待办清单（纯列表）+ 实用贴士。
- 每个地点点击即唤起 Google 导航；白天/黑夜按时间自动换配色。
