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

  },
})
