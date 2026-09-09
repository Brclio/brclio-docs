# Skinny NZ 手机话费充值核验

核验日期：2026-09-09。仅阅读公开官网与帮助页；未进行账户登录、填写银行卡或提交付款。除注明搜索索引或主代理观察外，下列网页正文均通过 Chrome 的实际浏览器 accessibility tree 阅读确认。

## 可以直接用于教程的事实

1. **银行卡有发行地限制。** 官方支持主要新西兰银行的 Visa / Mastercard 借记卡与信用卡，例如 ANZ、ASB、Westpac、BNZ、Kiwibank、Co-operative Bank。官方明确不接受 American Express、Diners、Credit Union、SBS Bank、海外/国际银行的卡（包括 TransferWise、Crypto.com、Revolut）及 Prezzy Card。因此不能写“中国发行的 Visa/Mastercard 一定能充值”。
   - https://www.skinny.co.nz/help/mobile-help/general/payment-methods/debit-and-credit-cards
2. **最低金额为 NZ$5。** 预付费套餐官网写 top-up starting from $5；现行短信帮助也要求充值金额为 $5 或更多。**最高金额、每日上限、支付附加费并未从本次公开页面证实，不要编写数值或承诺零手续费。**
   - https://www.skinny.co.nz/pricing/plans/
   - https://www.skinny.co.nz/help/mobile-help/help-with-your-account/billing/manage-your-account-by-text-2424
3. **充值是添加预付余额；套餐提供分钟、短信、流量额度。** 现行手机条款 3.13–3.15 说明余额可按 casual rates 使用，也可购买套餐；套餐在到期且余额充足（或有 Set & Forget）时续订。表述应为“充值不等于首次购买套餐；已订阅套餐可能在到期时自动扣余额续费”。不能笼统说“充值绝不会触发套餐变化”。
   - https://www.skinny.co.nz/skinny-terms/specific-technologies-terms/ （Last updated: 11 August 2026）
4. **账户有效期：至少每 12 个月充值或续订套餐一次。** 现行条款 3.23 / 3.62 比旧文档更准确：add credit **or otherwise renew your Plan**。否则账户及剩余余额会到期。不要写单纯每 12 个月必须额外充值，也不要以“发条短信/有余额”代替充值或套餐续订。
   - https://www.skinny.co.nz/skinny-terms/specific-technologies-terms/
5. **查询余额与套餐状态。** 官网账户或 Skinny Mobile App 可查账户余额及活动（条款 3.16）；从 Skinny 手机发送 `BAL` 至 `2424` 可查询话费和分钟/短信/流量余额，发送 `INFO` 至 `2424` 可查看套餐、价格和续订信息。官方称这些自助短信免费；本次未实测在中国漫游网络发送短码，因此中国读者优先使用官网/App。
   - https://www.skinny.co.nz/help/mobile-help/help-with-your-account/billing/manage-your-account-by-text-2424
6. **公开列出的支付渠道。** 当前 Managing payments 页列出 Set & Forget、Visa Debit/Credit card、Online Eftpos（通过 Skinny Mobile App）、Recharge Voucher。银行卡页说明可做 one-off Top-Ups，也可保存卡用于 Auto Top-Up。one-off 只代表一次性，并不等于免登录。
   - https://www.skinny.co.nz/help/mobile-help/help-with-your-account/billing/managing-payments/
7. **充值券与短信充值。** `TOPUP <12-digit voucher code>` 发至 `2424`；已保存银行卡可用 `TOPUP <amount> <4-digit registration code>`。四位 registration/security code 是在 Skinny 保存卡时自行设置的代码，**不是银行卡 PIN，也不是卡背面的 CVC/CVN**。教程若没有专门讲保存卡，不宜混入这一高级步骤。
   - https://www.skinny.co.nz/help/mobile-help/help-with-your-account/billing/manage-your-account-by-text-2424
   - https://www.skinny.co.nz/help/mobile-help/help-with-your-account/billing/failed-top-up
8. **付款失败先查银行卡账单。** 官方 Failed top up 页建议收到报错后先查看是否已经扣款，再考虑其他卡或浏览器；可联系发卡行。充值券代码连续输错 5 次会暂停券充值功能数小时。避免重复盲点支付。
   - https://www.skinny.co.nz/help/mobile-help/help-with-your-account/billing/failed-top-up
9. **海外可充值。** 官方海外漫游页展开 “How do I top-up while overseas?” 后说明：Skinny App、线上充值或致电 +64 3 371 0866（使用 Skinny 手机免费）。本次没有实测中国网络直连/短信到达/银行认证，不能保证这些环节。
   - https://www.skinny.co.nz/pricing/overseas-roaming/
10. **新 SIM 激活与漫游是不同问题。** 现行条款 1.2 / 3.48 要求自 2024-04-09 起新 SIM 首次在新西兰连接激活。海外漫游页还明确：中国从 2026 年 7 月起，漫游语音拨打/接听要求兼容 VoLTE roaming 的设备。充值教程不能暗示给未在 NZ 激活的新卡充值就能在中国使用。
    - https://www.skinny.co.nz/skinny-terms/specific-technologies-terms/
    - https://www.skinny.co.nz/pricing/overseas-roaming/

## 当前有证据的后台路径（仅官方文档，未实测登录后界面）

- **Auto Top-Up 更新**：登录 Dashboard → 左侧 `Manage Payments` → `Top-up` 下切换 `Auto-Top-Ups` → 更新金额及开始日期 → `continue` → 完成下一页提示。
  - https://www.skinny.co.nz/help/mobile-help/general/payment-methods/updating-your-auto-top-up
- **Set & Forget**：登录 → `Manage Payments` → `Manage Card` 注册符合要求的卡 → `Set & Forget` → `START SET & FORGET`。
  - https://www.skinny.co.nz/help/mobile-help/help-with-your-account/billing/managing-payments/
- 二者区别：Auto Top-Up 按设定日期给余额充值；Set & Forget 用卡支付套餐续费。现行条款 3.19 明确建议已有 Set & Forget 时不要同时设置 Auto Top-Up。
  - https://www.skinny.co.nz/skinny-terms/specific-technologies-terms/
- 当前公开资料未找到手机网页版一次性充值的逐屏完整操作说明。可以指引登录 `Manage Payments` 后选择一次性充值、核对号码/金额并按官方页面提示完成，但需明确后台按钮和流程没有逐屏实测，不制造假的官方后台截图。

## 实测和资料冲突

- 主代理实测首页 `QUICK TOP-UP` 的 `/topup` 跳往 `signin.skinny.co.nz` 登录页；不能宣称当前网页支持免登录充值。登录后是否还存在某种 guest 路径，本次未证实。
- 搜索引擎仍收录 `.../general/payment-methods/managing-payments` 和旧的 2424 路径；当前前者实测 404。已通过官网目录找到上面的 `help-with-your-account/billing/...` 有效替代路径。
- `https://www.skinny.co.nz/mobileappskinny-terms/` 是旧式长条款，含 2014 年历史内容；应引用 2026-08-11 更新的 specific-technologies-terms，尤其有效期、取消套餐和自动充值规定。
- 2424 页面仍提 Windows / BlackBerry 和历史套餐名称；本教程可使用通用 BAL / INFO / TOPUP，但不照抄整张旧套餐命令表。
- 未证实：最高充值金额、单日/单卡限额、特定跨境手续费、支付宝/微信支付、海外卡偶发成功案例、付款完成后的成功页样式、精确到账时间、国内网络可达性。教程不要把这些写成已验证事实。

## 截图建议

- 官方银行卡限制页可完整拍入 Visa/Mastercard 与 Cards we don't accept 部分。
- 官方 Auto Top-Up 帮助页可拍下真实 5 步说明，明确标注为“官方帮助页”。
- 当前公开来源均为实际页面，未处理或改造页面内容。
