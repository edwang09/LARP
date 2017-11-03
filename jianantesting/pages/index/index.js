//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
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
  onShow: function () {
    try {
      var tableid = wx.getStorageSync('tableid')
      var gameid = wx.getStorageSync('gameid')
      var characterid = wx.getStorageSync('characterid')
      var user_id = wx.getStorageSync('user_id')
      var table_id = wx.getStorageSync('table_id')
      console.log(tableid + gameid + characterid + user_id + table_id)
      if (tableid && gameid && characterid != null && user_id && table_id) {
        //wx.showToast({ title: '进入已建房间', icon: 'loading', duration: 2000 });
        wx.navigateTo({
          url: '../room/room'
        })
      }
    } catch (e) {
      console.log("not created")
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
