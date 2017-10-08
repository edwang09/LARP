//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tableid:'',
    gameid: '',
    characterid: '',
    characterplot:[],
    characterinfo:{},
    mainplot:[],
    gameinfo:{}

  },
  //事件处理函数

  onLoad: function () {
    let that = this
    this.setData({
      tableid: wx.getStorageSync('tableid')
    });
    this.setData({
      gameid: wx.getStorageSync('gameid')
    });
    this.setData({
      characterid: wx.getStorageSync('characterid')
     });
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/characterplot?gameid=' + that.data.gameid + '&characterid=' + that.data.characterid,
      success: function (res) {
        //console.log(res.data)
        that.setData({
          characterplot: res.data,
        })
      },
    });
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/character?gameid=' + that.data.gameid + '&characterid=' + that.data.characterid,
      success: function (res) {
        that.setData({
          characterinfo: res.data[0],
        })
      },
    });
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/mainplot?gameid=',
      success: function (res) {
        that.setData({
          mainplot: res.data,
        })
      },
    });
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/game?id=' + that.data.gameid,
      success: function (res) {
        that.setData({
          gameinfo: res.data[0],
        })
      },
    });

    wx.connectSocket({
      url: 'wss://larpxiaozhushou.tk',
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket is on.')

      wx.sendSocketMessage({
        data: "Hello World",
      })
    })
    wx.onSocketMessage(function (res) {
      console.log('WebSocket is working.')
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket is off.')
    })

}
})
