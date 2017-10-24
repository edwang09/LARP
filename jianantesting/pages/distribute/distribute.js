Page({

  /**
   * 页面的初始数据
   */
  data: {
    displaytype: '',
    gamename: 'gamename',
    tableid:'',
    tablepw:'',
    character:'',
    characterlist:[],
    gameinfo:{}
  },

  enterroom: function () {
    let that = this
    try {
      var tableid = wx.getStorageSync('tableid')
      var gameid = wx.getStorageSync('gameid')
      var characterid = wx.getStorageSync('characterid')
      var user_id = wx.getStorageSync('user_id')
      var table_id = wx.getStorageSync('table_id')
      console.log(tableid + gameid + characterid + user_id + table_id)
      if (tableid && gameid && characterid != null && user_id && table_id) {
        wx.showToast({ title: 'room', duration: 1000 })
        //wx.showToast({ title: '进入已建房间', icon: 'loading', duration: 2000 });
        wx.navigateTo({
          url: '../room/room'
        })
      } else {
        wx.showToast({ title: 'join', duration: 1000 })
        wx.navigateTo({
          url: '../join/join?tableid=' + that.data.tableid + '&tablepw=' + that.data.tablepw + '&characterid=' + that.data.character.charactername + '&characterpasscode=' + that.data.character.token
        })
      }
    } catch (e) {
      console.log("not created")
      wx.showToast({ title: 'join', duration: 1000 })
      wx.navigateTo({
        url: '../join/join?tableid=' + that.data.tableid + '&tablepw=' + that.data.tablepw + '&characterid=' + that.data.character.charactername + '&characterpasscode=' + that.data.character.token
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if(options.type=='table'){
      this.setData({
        displaytype: options.type
      })
      wx.request({
        url: 'https://larpxiaozhushou.tk/api/character?gameid=' + options.gameid,
        success: function (res) {
          that.setData({
            characterlist: res.data
          })
        }
      })
      wx.request({
        url: 'https://larpxiaozhushou.tk/api/game?id=' + options.gameid,
        success: function (res) {
          that.setData({
            gameinfo: res.data[0],
            gamename:res.data[0].name
          })
        }
      })


    }else{
      this.setData({
        displaytype: options.type
      })
      console.log(options.id)
      wx.request({
        url: 'https://larpxiaozhushou.tk/api/character?gameid=' + options.gameid + '&characterid=' + options.id,
        success: function (res) {
          that.setData({
            character: res.data[0]
          })
        }
      })
      console.log(options.gameid)
      wx.request({
        url: 'https://larpxiaozhushou.tk/api/game?id=' + options.gameid,
        success: function (res) {
          that.setData({
            gamename: res.data[0].name
          })
        }
      })
      console.log(options.tableid)
      wx.request({
        url: 'https://larpxiaozhushou.tk/api/table?tableid=' + options.tableid,
        success: function (res) {
          that.setData({
            tableid: res.data[0].tableid,
            tablepw: res.data[0].passcode
          })
        }
      })


    }
    }
})