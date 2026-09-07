# FitLog

FitLog 是一个低负担的个人健身打卡工具。它记录体重、腰围、训练、饮食内容和恢复状态，用长期趋势和 AI 周报帮助用户调整下一周，而不是强迫用户计算卡路里。

## 功能

- 每日体重、腰围、力量/有氧训练和恢复状态。
- 饮食只记录吃了什么，不猜测总热量。
- 7日平均体重、最近腰围、本周训练量和连续打卡。
- 最近30次体重趋势与14天记录本。
- DeepSeek AI 周报，输出具体证据和一个可执行的下周重点。
- 周一、周三、周五训练计划，页面内直接播放 Lyfta 动态示范并保留详情入口。
- 训练与 AI 周报按个人健身房设备清单规划；清单位于 `lib/gym-equipment.ts`，正式训练、热身、拉伸及备选动作均需遵守。独立划船机按力量器械处理，有氧热身使用跑步机和椭圆机。
- JSON 导入/导出备份。
- 数据持久化到服务器 SQLite；浏览器只保存一个随机设备凭证。
- 可安装为手机 Web App。

## 本地运行

```bash
npm install
copy .env.example .env.local
npm run dev
```

`.env.local`：

```dotenv
DEEPSEEK_API_KEY=你的密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-pro
FITLOG_DB_PATH=.runtime/fitlog.db
```

## 验证

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 隐私与边界

- 体重、腰围和每日记录保存在服务器 SQLite，按高强度随机设备凭证隔离，API 不接受无凭证读写。
- 设备凭证只保存在浏览器；清理浏览器前应先导出 JSON 备份。
- 生成 AI 周报时，服务端读取最近最多14天记录并发送至配置的 DeepSeek API。
- AI 周报是习惯复盘，不构成医疗诊断或治疗建议。
- 应用内将 `/api/coach` 限制为每个 IP 每小时最多 10 次；公网部署还可在 Nginx 层增加额外限制。
