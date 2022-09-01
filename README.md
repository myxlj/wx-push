<div align="center">

<h1 align="center">

💡 wx-push

</h1>

</div>
## 1. 如何使用(以测试号为例)

wx-push 实现自消息推送的原理，是通过调用一系列开放的api实现的, 所以也非常适合初学者学习。

**要使用 wx-push, 我们只需要做拥有自己的公众号, 得到相关配置信息进行配置即可**

### 1.1. 第一步：注册一个微信公众号

- 浏览器打开并登录 [微信公众测试号](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
- 登录成功后, 就可以生成微信公众测试号的appID和appsecret这两串数字, 记下备用
![image](https://user-images.githubusercontent.com/26435303/187818606-5595bd99-a3e3-4466-835f-b94bb7c8f498.png)

- 扫描测试号二维码关注测试号, 扫描之后, 右边就会出现相应的已关注人员id, 记下备用
![image](https://user-images.githubusercontent.com/26435303/187818736-ebd96856-d37e-44e1-bd9c-532f72b6a4c1.png)


### 1.2. 第二步：进行模板配置

新增测试模板, 点击 `新增测试模板` , 进行以下设置

> 这里面的每一个{{***.DATA}}都对应相应的数据，需要就保留，不需要就删掉

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
![image](https://user-images.githubusercontent.com/26435303/187818800-3bcf0c7d-6557-4999-b9d4-4a266e0cab2d.png)

### 1.3. 第三步：fork仓库, 填入相应配置
- fork仓库

![image](https://user-images.githubusercontent.com/26435303/187818843-7a0757c9-c9ad-4035-960b-3840e68c507c.png)

- 修改相应配置

![image](https://user-images.githubusercontent.com/26435303/187818976-34ca9b20-db22-4fe4-9e59-bd99269bdc13.png)
![image](https://user-images.githubusercontent.com/26435303/187819216-be011ce3-9b13-4de0-a106-dc3b9b28f6a5.png)
![image](https://user-images.githubusercontent.com/26435303/187819261-56073242-fde7-4f93-940a-1b22b440d8d3.png)


- 按需填入相应配置后保存

![image](https://user-images.githubusercontent.com/26435303/187819276-64866fb2-e4a3-4da6-a929-0f7d2874952f.png)
![image](https://user-images.githubusercontent.com/26435303/187819298-d1e55e7c-5a3c-4d6e-a618-fc12892e598f.png)
![image](https://user-images.githubusercontent.com/26435303/187819517-8779f63f-a095-410b-972e-907ee77e20d8.png)


### 1.4. 第四步：启用workflow自动任务,定时执行
- 启用action脚本

![image](https://user-images.githubusercontent.com/26435303/187819666-6e69c6cb-b3d5-4368-bbd0-558b9381312a.png)
![image](https://user-images.githubusercontent.com/26435303/187820771-8c9c75ab-97c7-4041-9176-84d752df7274.png)



### 1.5. 第五步(选做): 检查脚本是否可以正常执行
- 手动启动脚本
![image](https://user-images.githubusercontent.com/26435303/187820735-2ba7629a-6c2a-4323-9b78-284c0830f5d0.png)


## 2. action脚本说明
这里的脚本使用的是 github 的 workflow 定时任务, 具体脚本文件放置在:

```
wx-push/.github/workflows/wxpush-on-time.yml
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
