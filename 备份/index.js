//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  }, 
  //事件处理函数
  JoinGameBtn: function() {
    try {
      var tableid= wx.getStorageSync('tableid')
      var gameid= wx.getStorageSync('gameid')
      var characterid= wx.getStorageSync('characterid')
      var user_id= wx.getStorageSync('user_id')
      var table_id= wx.getStorageSync('table_id')
      console.log(tableid + gameid + characterid + user_id + table_id)
      if (tableid && gameid && characterid!=null && user_id && table_id) {
        //wx.showToast({ title: '进入已建房间', icon: 'loading', duration: 2000 });
        wx.navigateTo({
          url: '../room/room'
        })
      } else {
        wx.navigateTo({
          url: '../join/join'
        })
      }
    } catch (e) {
      console.log("not created")
    }

  },
  create: function () {
    try {
      var value = wx.getStorageSync('createtableid')
      if (value) {
        //wx.showToast({ title: '进入已建房间', icon: 'loading', duration: 2000 });
        console.log(value)
        wx.navigateTo({
          url: '../create/create?tableid=' + value
        })
      } else {
        //wx.showToast({ title: '进入超市', icon: 'loading', duration: 2000 });
        console.log('tobe created')
        wx.navigateTo({
          url: '../shop/shop'
        })
      }
    } catch (e) {
      console.log("not created")
    }
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else{
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
/**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
