// pages/activity/dayCouples/taskDeatil.js
Page({


  data: {
      taskInfo:{}
  },

  onLoad: function(options) {
    wx.hideToast()
    let taskDetailData = JSON.parse(options.data)
    this.setData({
      taskInfo: taskDetailData
    })
    wx.setNavigationBarTitle({
      title: taskDetailData.task_title
    })
  },

  onShow: function() {

  },

})