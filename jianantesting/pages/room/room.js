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
    gameinfo:{},
    display:0,
    acquiredclue:[],
    broadcast:[],
    roundnumber:0
  },
  //navigator
  one: function () {
    this.setData({
      display:1
    })
  },
  two: function () {
    this.setData({
      display: 2
    })
  },
  three: function () {
    this.setData({
      display: 3
    })
  },
  four: function () {
    this.setData({
      display: 4
    })
  },
  five: function () {
    this.setData({
      display: 5
    })
  },
  six: function () {
    this.setData({
      display: 6
    })
  },
  nextround: function () {
    let that = this
    this.setData({
      roundnumber: that.data.roundnumber +1
    })
  },
  findtruth: function () {
    wx.navigateTo({
      url: '../findtruth/findtruth',
    })
  },
  getclue: function (e) {
    let that = this;
    var locationid = e.target.id;
    var cluecount = this.data.gameinfo.cluelocation[locationid].count
    var cluenumber = Math.floor(Math.random() * cluecount)
    console.log(cluenumber)
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/clue?gameid=' + that.data.gameid + '&cluelocation=' + locationid + '&cluenumber=' + cluenumber,
      success: function (res) {
        //console.log(res.data)
        that.setData({
          acquiredclue: that.data.acquiredclue.concat(res.data[0])
        })
        console.log(that.data.acquiredclue)
      },
    })
  },





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
      url: 'https://larpxiaozhushou.tk/api/mainplot?gameid=' + that.data.gameid + '&sort=plotid',
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
