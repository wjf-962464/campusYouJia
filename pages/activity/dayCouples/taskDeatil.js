// pages/activity/dayCouples/taskDeatil.js
Page({


  data: {
      taskInfo:{}
  },

  onLoad: function(options) {
    let taskDetailData = JSON.parse(options.data)
    this.setData({
      taskInfo: taskDetailData
    })
    wx.setNavigationBarTitle({
      title: taskDetailData.task_title
    })
    wx.hideToast()
  },

  onShow: function() {

  },

})