// pages/activity/dayCouples/infoTable.js
const httpUtil = require("../../../http/httpUtil.js")
const url = require("../../../constants/interfaceUrl.js")
Page({
  data: {
    coupleFlag: false,
    table_title_img: "http://39.108.128.147:8080/campusApp/images/acitivity/daily_couple/table_title_img.jpg",
    address: "",
    phone_num: "",
    self_character_arr: [],
    self_character_text: "",
    aim_character_arr: [],
    aim_character_text: "",
    characterMarkArr: [{
        name: "身高",
        value: ["<160", "160~165", "165~170", "170~175", "175~180", ">180"]
      },
      {
        name: "年级",
        value: ["大一", "大二", "大三", "大四", "大五", "其他"]
      },
      {
        name: "校区",
        value: ["越秀校区", "梁林校区", "平湖校区", "非本校"]
      },
      {
        name: "星座",
        value: ["白羊", "金牛", "双子", "巨蟹", "狮子", "处女", "天秤", "天蝎", "射手", "魔羯", "水瓶", "双鱼"]
      },
      {
        name: "标签1",
        value: ["内敛", "外向", "热情", "蹦迪达人", "旅游达人", "闲庭看书", "电影迷", "摄影", "书画"]
      },
      {
        name: "标签2",
        value: ["游戏", "运动达人", "吃货", "古灵精怪", "佛系青年", "健身", "睡懒觉", "动漫迷", "烹饪控"]
      },
      {
        name: "标签3",
        value: ["烘培控", "二次元", "音乐控", "颜值控", "情场小白", "驰骋情场", "铲屎官", "有点皮", "颜值爆表", ]
      }
    ]
  },
  /**生命周期函数--监听页面加载 */
  onLoad: function(options) {
    wx.hideToast()
  },

  /**表单提交 */
  submitInfo: function(e) {
    if (this.tableCheck(e.detail.value)) {
      return
    }
    let table = e.detail.value
    let login_flag = wx.getStorageSync("login_flag")
    if (!login_flag) {
      this.showInfo("您还未登录，没有权限进行此活动!")
      return
    }
    let param = {}
    let httpUrl = ""
    if (this.data.coupleFlag) {
      httpUrl = url.dailyCoupleActivity.submitPersonalInfo2
      param = {
        login_flag: login_flag,
        phone_num: table.phone_num,
        address: table.address,
        gender: table.gender,
      }
    } else {
      httpUrl = url.dailyCoupleActivity.submitPersonalInfo
      param = {
        login_flag: login_flag,
        phone_num: table.phone_num,
        address: table.address,
        gender: table.gender,
        sexual_preference: table.sexual_preference,
        self_character: table.self_character,
        aim_character: table.aim_character
      }
    }
    httpUtil.httpPost(httpUrl, param, (res) => {
      wx.showToast({
        title: '成功参与一日情侣活动',
        icon: 'success'
      })
      wx.navigateBack({})
    })
  },
  /**表单校验 */
  tableCheck(table) {
    // console.log('form发生了submit事件，携带数据为：', table)
    if (this.data.coupleFlag) {
      if (table.address == "" || table.wx_name == "" || table.phone_num == "") {
        this.showInfo("请完整完整填写姓名、微信号和地址")
        return true
      }
      let regular = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      if (!regular.test(table.phone_num)) {
        this.showInfo("手机号错误")
        return true
      }
      if (table.gender == "") {
        this.showInfo("请勾选性别")
        return true
      }
      return false
    }
    if (table.address == "" || table.wx_name == "" || table.phone_num == "") {
      this.showInfo("请完整完整填写姓名、微信号和地址")
      return true
    }
    let regular = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
    if (!regular.test(table.phone_num)) {
      this.showInfo("手机号错误")
      return true
    }
    if (table.gender == "" || table.sexual_preference == "") {
      this.showInfo("请勾选性别和取向")
      return true
    }
    if (table.self_character == "" || table.aim_character == "") {
      this.showInfo("为了找到您的灵魂伴侣\r\n请为您和对方选择至少一个标签")
      return true
    }
    return false
  },
  /**标签选择监听 */
  markCheckListener(e) {
    let flag = e.currentTarget.dataset.flag
    let key = e.currentTarget.dataset.key
    let valueArr = e.detail.value
    let character_arr = []
    if (flag == "self") {
      character_arr = this.data.self_character_arr
    } else {
      character_arr = this.data.aim_character_arr
    }
    character_arr.forEach((item, index) => {
      if (item.key == key) {
        character_arr.splice(index)
      }
    })
    valueArr.forEach((item, index) => {
      character_arr.push({
        key: key,
        value: item
      })
    })
    let character_text = ""
    character_arr.forEach((item, index) => {
      character_text += item.key + "：" + item.value + ";"
    })
    character_text = character_text.substr(0, character_text.length - 1)
    if (character_arr.length > 6) {
      this.showInfo("至多选择六个标签哦，请谨慎考虑\r\n麻烦亲手动取消掉多余的勾选\r\n具体以显示的结果为准")
      return
    }
    if (flag == "self") {
      this.setData({
        self_character_arr: character_arr,
        self_character_text: character_text
      })
    } else {
      this.setData({
        aim_character_arr: character_arr,
        aim_character_text: character_text
      })
    }
  },
  /**情侣选择监听 */
  coupleCheckListen(e) {
    let flag = false
    if (e.detail.value == "是") {
      flag = true
    }
    this.setData({
      coupleFlag: flag
    })
  },
  /**地址选择 */
  chooseAddress() {
    let page = this
    wx.chooseAddress({
      success: function(res) {
        page.setData({
          address: res.cityName + res.countyName + res.detailInfo,
          phone_num: res.telNumber
        })
      },
      fail: function() {
        page.showInfo("请授权自动填表或修改")
      }
    })
  },
  showInfo(info = "msg_default", title = "温馨提示") {
    wx.showModal({
      title: title,
      content: info,
      showCancel: false
    })
  }
})