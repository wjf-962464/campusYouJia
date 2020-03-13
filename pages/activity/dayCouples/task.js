// pages/activity/dayCouples/task.js
const httpUtil = require("../../../http/httpUtil.js")
const url = require("../../../constants/interfaceUrl.js")
Page({

  data: {
    type: 0,
    preference: "",
    taskList: [],
    suggestionIcon:"../../../images/activity_dailyCouple/icon_feed_back.png",
    coupleIcon:"",
    coupleText:""
  },

  onLoad: function(options) {
    let coupleIcon ="../../../images/activity_dailyCouple/icon_my_couple.png"
    let coupleText="你的伴侣"
    if (options.preference=="同性"){
      coupleIcon = "../../../images/activity_dailyCouple/icon_my_couple2.png"
      coupleText = "你的小彩虹"
    }
    this.setData({
      type: options.type,
      preference: options.preference,
      coupleIcon: coupleIcon,
      coupleText: coupleText
    })
    wx.hideToast()
  },
  onShow: function() {
    this.getTaskList()
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getTaskList()
  },

  /** 获取任务列表 */
  getTaskList() {
    let page = this
    let login_flag = wx.getStorageSync("login_flag")
    if (!login_flag) {
      this.showInfo("您还未登录，没有权限进行此活动!")
      return
    }
    let param = {
      login_flag: login_flag
    }
    httpUtil.httpGet(url.dailyCoupleActivity.getTaskList, param, (res) => {
      page.setData({
        taskList: res.data
      })
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },

  /** 前往建议反馈页 */
  gotoSuggestPage() {
    wx.navigateTo({
      url: `suggestion`,
      success: function() {
        wx.showToast({
          title: '竭诚为您服务',
          icon: 'loading'
        })
      },
      fail: function() {
        console.log("前往建议反馈页失败")
      }
    })
  },
  /** 前往对象信息页 */
  gotoCoupleInfoPage() {
    wx.navigateTo({
      url: `coupleInfo`,
      success: function() {
        wx.showToast({
          title: '祝白头偕老',
          icon: 'loading'
        })
      },
      fail: function() {
        console.log("前往对象信息页失败")
      }
    })
  },
  /** 前往任务详情页 */
  gotoTaskDetail(e) {
    let data = e.currentTarget.dataset.bean
    let dataStr = JSON.stringify(data)
    wx.navigateTo({
      url: `taskDeatil?data=${dataStr}`,
      success: function() {
        wx.showToast({
          title: '任务开始喽',
          icon: 'loading'
        })
      },
      fail: function() {
        console.log("前往任务详情页失败")
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