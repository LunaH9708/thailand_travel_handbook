// Cloudflare Workers 入口：把 public/ 里的静态文件（index.html）直接返回给访客。
// 整个网站就是一个 index.html，零外部依赖、可离线打开。
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
