//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    characterlist: [],
    charactername:'',
    characterid:0,
    characterpw: '',
    characterpasscode: '',
    hasgame: false,
    tableid:'temprary',
    tablepw:'123123',
    gameid:'',
    gamename:'',
    description:''

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }, 
  roomidInput: function (e) {
    this.setData({

      tableid: e.detail.value
    })
  }, 
  passwordInput: function (e) {
    this.setData({
      tablepw: e.detail.value
    })
  },
  passcodeChange: function (e) {
    this.setData({
      characterpasscode: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      charactername: this.data.characterlist[e.detail.value].name,
      characterid: this.data.characterlist[e.detail.value].id,
      characterpw: this.data.characterlist[e.detail.value].passcode,
    })
  },
  enterroom: function () {
    let that = this;
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/table?tableid=' + this.data.tableid+'&passcode=' + this.data.tablepw,
      success: function(res) {
        console.log(res.data);
        that.setData({
          gameid: res.data[0].gameid,
          gamename: res.data[0].gamename
        })
        },
        complete: function(){
          console.log(that.data.gameid);
          wx.request({
            url: 'https://larpxiaozhushou.tk/api/game?id=' + that.data.gameid ,
              success: function (res) {
                  console.log(res.data)
                  that.setData({
                    description: res.data[0].descripion, 
                    characterlist: res.data[0].characterlist,
                    hasgame: true
                  })
                },
              });
      }
    });
    
  },
  choosecharacter: function () {
    //console.log(this.data.characterpasscode);
    //console.log(this.data.characterpw);
    wx.setStorage({
      key: "tableid",
      data: this.data.tableid
    });
    wx.setStorage({
      key: "gameid",
      data: this.data.gameid
    });
    wx.setStorage({
      key: "characterid",
      data: this.data.characterid
    });
    if (this.data.characterpasscode == this.data.characterpw){
      wx.navigateTo({
        url: '../room/room'
      })
    }

  },
  onLoad: function () {
    
    /*
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
    })*/




    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
