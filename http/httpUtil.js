const BASE_URL = "https://wjfcoding.top/campusApp/"

const defaultMethod = {
  showLoading: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
  },
  cancelLoading: function() {
    wx.hideToast()
  },
  xhr({
    url = '',
    data = {},
    method = "GET",
    success = null,
    isMask = true
  }) {
    //请求路径拼接
    url = BASE_URL + url
    //启动加载层
    if (isMask) {
      this.showLoading()
    }
    new Promise((resolve, reject) => {
      let page=this
      wx.request({
        url,
        data,
        method,
        ...method.toLowerCase() != 'get' ? {
          header: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        } : {},
        success(res) {
          let result = res.data
          if (result.resultCode == 0) {
            wx.hideToast()
            wx.showModal({
              title: '温馨提示',
              content: result.message,
              showCancel: false,
              confirmText: "了解"
            })
          } else {
            console.log(result)
            resolve(result)
          }
        },
        fail(error) {
          if (isMask) {
            wx.hideToast()
          }
          wx.showModal({
            title: '温馨提示',
            content: '网络错误或服务器繁忙!',
            showCancel: false,
            confirmText:"了解"
          })
          reject(error)
        },
        complete() {
          if (isMask) {
            wx.hideToast()
          }
        }
      })
    }).then((res) => {
      success(res)
      if (isMask) {
        wx.hideToast()
      }
    })
  }
}
module.exports = {
  httpGet(url = '', data = {}, success = null, isMask = true) {
    defaultMethod.xhr({
      url,
      data,
      method: 'get',
      success,
      isMask
    })
  },
  httpPost(url = '', data = {}, success = null, isMask = true) {
    defaultMethod.xhr({
      url,
      data,
      method: 'post',
      success,
      isMask
    })
  },
  httpPut(url = '', data = {}, success = null, isMask = true) {
    defaultMethod.xhr({
      url,
      data,
      method: 'put',
      success,
      isMask
    })
  },
  httpDelete(url = '', data = {}, success = null, isMask = true) {
    defaultMethod.xhr({
      url,
      data,
      method: 'delete',
      success,
      isMask
    })
  }
}