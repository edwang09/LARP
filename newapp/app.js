//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    /*var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)*/
    var appid ="wxf0487d45228f02d3"
    var secret = "5cfc70f62660d126e14478a3db41d578"
    // 登录
    let that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        wx.request({
          url: 'https://usbackendwjn704.larpxiaozhushou.tk/unionid?appid=' + appid + '&secret=' + secret+'&js_code='+res.code+'&grant_type=authorization_code',
          success:function(res){
            console.log("unionid:" +res.data)
            that.globalData.unionid = res.data
          }
        })
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (true) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              //console.log(this)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              /*if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }*/
              
            }
          })
        }
      },
      fail: res => {
        console.log("failed")
      }
    })
  },
  globalData: {
    userInfo: null
  }
})