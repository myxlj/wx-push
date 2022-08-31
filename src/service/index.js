const { default: axios } = require("axios");
const { hitokoto_type, cities } = require("../store");
const config = require("../../config");
const { randomNum, sortBirthdayTime, toLowerLine } = require("../utils")
const dayjs = require("dayjs")

/**
 * 通过appid和appsecret获得access_token
 * 因为每天发送次数不是特别频繁且access_token的值有效时间为7200s，故不存储
 * @returns
 */
const getAccessToken = async () => {
  const APP_ID = "wxa222c71efe4ec2a2";
  const APP_SECREAT = "27131ca5a31b92a51ec1fff48faaf7e4";
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECREAT}`;

  let access_token = "";
  try {
    const res = await axios.get(url).catch((e) => {
      console.error("获取accessToken失败: ", e);
    });
    if (res.status === 200 && res.data && res.data.access_token) {
      access_token = res.data.access_token;
    }
  } catch (e) {
    console.error("获取accessToken失败: ", e);
  }
  return access_token;
};

/**
 * 发送模板消息
 * @param {*} access_token
 * @param {*} template_id
 * @returns
 */
const sendMessages = async (templateId, user, accessToken, params) => {
  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`;

  const wxTemplateData = {};
  params.map((item) => {
    wxTemplateData[item.name] = {
      value: item.value,
      color: item.color,
    };
  });

  // 组装数据
  const data = {
    touser: user.id,
    template_id: templateId,
    url: "http://weixin.qq.com/download",
    topcolor: "#FF0000",
    data: wxTemplateData,
  };

  console.log("将要发送以下内容: ", data);

  // 发送消息
  const res = await axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
      },
    })
    .catch((err) => err);

  if (res.data && res.data.errcode === 0) {
    console.log("推送消息成功");
    return {
      name: user.name,
      success: true,
    };
  }
  console.error("推送失败！", res.data);
  return {
    name: user.name,
    success: false,
  };
};

/**
 * 获得随机颜色
 * @returns
 */
const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  //var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
  const color =
    "#" +
    (
      Array(6).join(0) +
      (r.toString(16) + g.toString(16) + b.toString(16))
    ).slice(-6);
  return color;
};

/**
 * 每日一言
 * @returns
 */
const getHitokoto = async (type) => {
  const filterQuery = hitokoto_type.filter((item) => item.name === type);
  const query = filterQuery.length
    ? filterQuery[0].type
    : hitokoto_type[randomNum(0, 6)].type;
  const url = `https://v1.hitokoto.cn/?c=${query}`;

  const res = await axios.get(url).catch((err) => err);

  if (res.status === 200 && res) {
    return res.data;
  }

  console.error("每日一言: 发生错误", res);
  return null;
};

/**
 * 获取天气情况
 * @param {*} province 省份
 * @param {*} city 城市
 */
const getWeather = async (province, city) => {
  if (
    !cities[province] ||
    !cities[province][city] ||
    !cities[province][city]["AREAID"]
  ) {
    console.error("配置文件中找不到相应的省份或城市");
    return null;
  }
  const address = cities[province][city]["AREAID"];

  const url = `http://d1.weather.com.cn/dingzhi/${address}.html?_=${new Date()}`;

  const res = await axios
    .get(url, {
      headers: {
        Referer: `http://www.weather.com.cn/weather1d/${address}.shtml`,
        "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36`,
      },
    })
    .catch((err) => err);

  try {
    if (res.status === 200 && res.data) {
      const temp = res.data.split(";")[0].split("=");
      const weatherStr = temp[temp.length - 1];
      const weather = JSON.parse(weatherStr);
      if (weather.weatherinfo) {
        return weather.weatherinfo;
      } else {
        throw new Error("天气情况: 找不到weatherinfo属性, 获取失败");
      }
    } else {
      throw new Error(res);
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error("天气情况: 序列化错误", e);
    } else {
      console.error("天气情况: ", e);
    }
    return null;
  }
};

/**
 * 金山词霸每日一句
 * @returns
 */
const getCIBA = async () => {
  const url = "http://open.iciba.com/dsapi/";
  const res = await axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
      },
    })
    .catch((err) => err);

  if (res.status === 200 && res) {
    return res.data;
  }
  console.error("金山词霸每日一句: 发生错误", res);
  return null;
};

/**
 * 获取重要节日信息
 * @returns
 */
const getBirthdayMessage = () => {
  // 计算重要节日倒数
  const birthdayList = sortBirthdayTime(config.FESTIVALS);
  console.log(birthdayList);
  let resMessage = "";

  birthdayList.forEach((item, index) => {
    if (
      !config.FESTIVALS_LIMIT ||
      (config.FESTIVALS_LIMIT && index < config.FESTIVALS_LIMIT)
    ) {
      let message = null;

      // 生日相关
      if (item.type === "生日") {
        // 获取周岁
        const age = dayjs().diff(item.year + "-" + item.date, "year");

        if (item.diffDay === 0) {
          message = `今天是 ${item.name} 的${age ? age + "岁" : ""}生日哦，祝${
            item.name
          }生日快乐！`;
        } else {
          message = `距离 ${item.name} 的${age ? age + 1 + "岁" : ""}生日还有${
            item.diffDay
          }天`;
        }
      }

      // 节日相关
      if (item.type === "节日") {
        if (item.diffDay === 0) {
          message = `今天是 ${item.name} 哦，要开心！`;
        } else {
          message = `距离 ${item.name} 还有${item.diffDay}天`;
        }
      }

      // 存储数据
      if (message) {
        resMessage += `${message} \n`;
      }
    }
  });

  return resMessage;
};

/**
 * 推送消息, 进行成功失败统计
 * @param {*} templateId
 * @param {*} users
 * @param {*} accessToken
 * @param {*} params
 * @returns
 */
const sendMessageReply = async (templateId, users, accessToken, params) => {
  const allPormise = [];
  const needPostNum = users.length;
  let successPostNum = 0;
  let failPostNum = 0;
  const successPostIds = [];
  const failPostIds = [];
  users.forEach(async (user) => {
    allPormise.push(sendMessages(templateId, user, accessToken, params));
  });
  const resList = await Promise.all(allPormise);
  resList.forEach((item) => {
    if (item.success) {
      successPostNum++;
      successPostIds.push(item.name);
    } else {
      failPostNum++;
      failPostIds.push(item.name);
    }
  });

  return {
    needPostNum,
    successPostNum,
    failPostNum,
    successPostIds: successPostIds.length ? successPostIds.join(",") : "无",
    failPostIds: failPostIds.length ? failPostIds.join(",") : "无",
  };
};

/**
 * 推送回执
 * @param {*} templateId
 * @param {*} users
 * @param {*} accessToken
 * @param {*} params
 */
const callbackReply = async (templateId, users, accessToken, params) => {
  users.forEach(async (user) => {
    await sendMessages(templateId, user, accessToken, params);
  });
};

module.exports = {
  getAccessToken,
  sendMessages,
  randomColor,
  getHitokoto,
  getWeather,
  getCIBA,
  getBirthdayMessage,
  sendMessageReply,
  callbackReply,
};
