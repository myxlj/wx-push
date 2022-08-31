<div align="center">

<h1 align="center">

💡 wx-push

</h1>

</div>
## 1. 如何使用(以测试号为例)

wechat-public-account-push 实现自消息推送的原理，是通过调用一系列开放的api实现的, 所以也非常适合初学者学习。

**要使用 wechat-public-account-push, 我们只需要做拥有自己的公众号, 得到相关配置信息进行配置即可**

### 1.1. 第一步：注册一个微信公众号

- 浏览器打开并登录 [微信公众测试号](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
- 登录成功后, 就可以生成微信公众测试号的appID和appsecret这两串数字, 记下备用
![appID-appsecret](img/wx-test-id.png)

- 扫描测试号二维码关注测试号, 扫描之后, 右边就会出现相应的已关注人员id, 记下备用
![wx-test-follow](img/wx-test-follow.png)


### 1.2. 第二步：进行模板配置

新增测试模板, 点击 `新增测试模板` , 进行以下设置

> 这里面的每一个{{***.DATA}}都对应相应的数据，需要就保留，不需要就删掉

> **更多模板** 请查看上方更新内容

模板标题: 自定义，例如: `亲爱的，早上好!`

模板内容:

```
{{date.DATA}}  
城市：{{city.DATA}}  
天气：{{weather.DATA}}  
最低气温: {{min_temperature.DATA}}  
最高气温: {{max_temperature.DATA}}  
今天是我们恋爱的第{{love_day.DATA}}天
今天是我们结婚的第{{marry_day.DATA}}天
{{birthday_message.DATA}}

{{note_en.DATA}}  
{{note_ch.DATA}}
```

记下模板代码
![](img/wx-test-tmp.png)

### 1.3. 第三步：fork仓库, 填入相应配置
- fork仓库

    ![github-fork](img/github-fork.png)

- 修改相应配置

    ![](img/github-into-config.png)

    ![](img/github-into-config-2.png)

    ![](img/github-into-config-3.png)

- 按需填入相应配置后保存

    ![](img/edit-config.png)

    ![](img/edit-config-eg.png)

    ![](img/edit-config-commit.png)

### 1.4. 第四步：启用workflow自动任务,定时执行
- 启用action脚本

    ![](img/action.png)

    ![](img/action-comit.png)

    ![](img/action-comit-2.png)

### 1.5. 第五步(选做): 检查脚本是否可以正常执行
- 手动启动脚本
    ![](img/action-test.png)

- 查看执行结果
    ![](img/action-test-2.png)

    ![](img/action-test-3.png)

    ![](img/action-test-4.png)

## 2. action脚本说明
这里的脚本使用的是 github 的 workflow 定时任务, 具体脚本文件放置在:

```
wechat-public-account-push/.github/workflows/weixin-push-on-time.yml
```

这里简单说明一下如何更改自动执行时间

目前脚本默认执行时间为 **每天的 北京时间上午 8:00**

如果想要变更脚本定时任务执行时间,可以更改以下代码段

```
on:
  workflow_dispatch:
  schedule:
    # 每天国际时间4:00 运行, 即北京时间 12:00 运行
    - cron: '0 4 * * *'
```
