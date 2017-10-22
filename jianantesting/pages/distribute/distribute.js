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