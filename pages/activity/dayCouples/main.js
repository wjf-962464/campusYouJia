// pages/activity/dayCouples/main.js
const httpUtil = require("../../../http/httpUtil.js")
const url = require("../../../constants/interfaceUrl.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData:{},
    welcome_text: '',
    activity_notice: '',
    loveAnimation: null,
    participateFlag: false
  },
  /**页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getIfParticipate()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideToast()
  },

  onShow: function(options) {
    this.getIfParticipate()
  },
  /**获取活动信息 */
  getActivityInfo() {
    let page = this
    let login_flag = wx.getStorageSync("login_flag")
    if (!login_flag) {
      wx.showModal({
        title: '温馨提示',
        content: '您还未登录，没有权限进行此活动!',
      })
      return
    }
    let param = {
      login_flag: login_flag,
      activity_name: '一日情侣'
    }
    httpUtil.httpPost(url.activityManager.getRecentActivity, param, (res) => {
      let data = res.data
      if (data.status == 1) { //活动筹备中
        if (!page.data.participateFlag){
          page.initLoveAnimation()
        }
        page.setData({
          activity_notice: data.activity_notice,
          welcome_text: data.welcome_text
        })
      } else if (data.status == 2) { //活动进行中
        if (page.data.participateFlag) { //参加了
          wx.reLaunch({
            url: `task?type=${page.data.userData.record_status}&preference=${page.data.userData.sexual_preference}`,
            success: function () {
              wx.showToast({
                title: '活动已经开始了',
                icon: 'loading'
              })
            }
          })
        } else { //未参加
          page.setData({
            activity_notice: '很遗憾，活动已经开始了',
            participateFlag: true
          })
        }
      }
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
  /**获取参与信息 */
  getIfParticipate() {
    let page = this
    let login_flag = wx.getStorageSync("login_flag")
    if (!login_flag) {
      wx.showModal({
        title: '温馨提示',
        content: '您还未登录，没有权限进行此活动!',
      })
      return
    }
    let param = {
      login_flag: login_flag
    }
    httpUtil.httpGet(url.dailyCoupleActivity.ifParticipate, param, (res) => {
      if (res.resultCode == 1) { //
        page.setData({
          userData:res.data,
          participateFlag: true
        })
      }else{
        page.setData({
          participateFlag: false
        })
      }
      page.getActivityInfo()
    })
  },
  /**初始化心动循环动画*/
  initLoveAnimation() {
    let animation = wx.createAnimation({
      duration: 350
    })
    let next = true;
    setInterval(function repeat() {
      if (next) {
        animation.scaleX(1.7).scaleY(1.7).step()
        next = !next
      } else {
        animation.scaleX(0.9).scaleY(0.9).step()
        next = !next
      }
      this.setData({
        loveAnimation: animation.export()
      })
    }.bind(this), 350)
  },
  /**心动图案的点击事件 */
  gotoInfoTable() {
    wx.navigateTo({
      url: "infoTable",
      success: function() {
        wx.showToast({
          title: '正在努力加载',
          icon: 'loading'
        })
      }
    })
  }
})