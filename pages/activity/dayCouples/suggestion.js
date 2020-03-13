// pages/activity/dayCouples/suggestion.js
const httpUtil = require("../../../http/httpUtil.js")
const url = require("../../../constants/interfaceUrl.js")
Page({


  data: {
    suggestionValue: ""
  },


  onLoad: function(options) {
    wx.hideToast()
  },

  onShow: function() {

  },

  submitSuggestion(e) {
    let page = this
    console.log(e.detail.value.suggest)
    if (e.detail.value.suggest == "") {
      this.showInfo("您还没有输入任何内容呢")
      return
    }
    let login_flag = wx.getStorageSync("login_flag")
    if (!login_flag) {
      this.showInfo("您还未登录，没有权限进行此活动!")
      return
    }
    let param = {
      login_flag: login_flag,
      suggestion: e.detail.value.suggest
    }
    httpUtil.httpPost(url.dailyCoupleActivity.feedBack, param, (res) => {
      page.showInfo(res.message, "You嘉")
      page.setData({
        suggestionValue: ""
      })
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