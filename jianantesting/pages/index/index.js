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
        wx.request({
          url: 'https://larpxiaozhushou.tk/api/user?usernickname=' + app.globalData.userInfo.nickName,
          success: function (res) {
            //console.log('../room/room?usernickname=' + res.data[0].usernickname)
            /*if (res.data.length != 0) {
              wx.navigateTo({
                url: '../room/room?usernickname=' + res.data[0].usernickname
              })
            } else {*/
              wx.navigateTo({
                url: '../join/join'
              })
            //}
          }
        })
      }
    } catch (e) {
      console.log("not created")
    }

  },
  create: function () {
        wx.request({
          url: 'https://larpxiaozhushou.tk/api/table?hostid=' + app.globalData.userInfo.nickName,
          success:function(res){
            console.log(res.data)
            if(res.data.length!=0){
              wx.navigateTo({
                url: '../create/create?tableid=' + res.data[0].tableid
              })
            }else{
              //wx.showToast({ title: '进入超市', icon: 'loading', duration: 2000 });
              wx.navigateTo({
                url: '../shop/shop'
              })
            }
          }
        })
     
  },
  onShow: function () {
    wx.hideShareMenu()
  },

/**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
