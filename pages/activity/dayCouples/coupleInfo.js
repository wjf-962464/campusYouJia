// pages/activity/dayCouples/coupleInfo.js
const httpUtil = require("../../../http/httpUtil.js")
const url = require("../../../constants/interfaceUrl.js")
Page({


  data: {
    sorryHint: "",
    okHint: "",
    coupleInfoArr: []
  },

  onLoad: function(options) {

  },


  onShow: function() {
    this.getCoupleInfo()
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getCoupleInfo()
  },
  getCoupleInfo() {
    let page = this
    let login_flag = wx.getStorageSync("login_flag")
    if (!login_flag) {
      this.showInfo("您还未登录，没有权限进行此活动!")
      return
    }
    let param = {
      login_flag: login_flag
    }
    httpUtil.httpGet(url.dailyCoupleActivity.getCoupleInfo, param, (res) => {
      if (res.resultCode == 2) {
        page.setData({
          sorryHint: res.message + "\n（不要问我为什么用这个颜色，你心里清楚）",
        })
      } else {
        res.data.forEach((item, index) => {
          item.aim_character = page.stringSplit(item.aim_character)
          item.self_character=page.stringSplit(item.self_character)
        })
        page.setData({
          okHint: res.data.length > 1 ? "恭喜你，意外的缘分" : "这是您的伴侣，请注意查收",
          coupleInfoArr: res.data
        })
      }
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
  stringSplit(string) {
    let str_arr = []
    if (string.indexOf(";") != -1) {
      str_arr = string.split(";")
      let arr_length = str_arr.length
      string = ""
      str_arr.forEach((item, index) => {
        if (index == arr_length - 1) {
          string += item
        } else {
          string += item + "\n"
        }
      })
    }
    return string
  }
})