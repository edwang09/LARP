Page({
  data: {
    background: ['green', 'red', 'yellow'],
    gamelist: [],
    currentgame: {},
    gameid: '',
    gamename: '',
    gamedescription: '',
    characterlist: [],
    cluestatus: []
  },

  onLoad: function (options) {
    let that = this
    if (options.tableid) {
      wx.request({
        url: 'https://larpxiaozhushou.tk/api/table?tableid=' + options.tableid,
        success: function (res) {
          if (res.data.length != 0) {
            that.setData({
              gamename: res.data[0].gamename,
              tableid: res.data[0].tableid,
              tablepw: res.data[0].passcode,
              gameid: res.data[0].gameid
            })
            wx.request({
              url: 'https://larpxiaozhushou.tk/api/character?gameid=' + that.data.gameid,
              success: function (res) {
                console.log(res.data)
                that.setData({
                  characterlist: res.data
                })
              }
            })
          }
        }
      })
      console.log("already have " + that.data.tableid)
    } else {
      this.setData({
        gameid: options.gameid,
      })
      wx.request({
        url: 'https://larpxiaozhushou.tk/api/game?id=' + options.gameid,
        success: function (res) {
          console.log(res)
          that.setData({
            gamename: res.data[0].name,
            cluestatus: res.data[0].cluestatus,
            tableid: makeid(),
            tablepw: makepw(),
            gameid: options.gameid
          })
          //console.log(wx.getStorageSync('createtableid').length)

          wx.request({
            url: 'https://larpxiaozhushou.tk/api/table/',
            data: {
              hostid: app.globalData.userInfo.nickName,
              tableid: that.data.tableid,
              gamename: that.data.gamename,
              gameid: that.data.gameid,
              passcode: that.data.tablepw,
              vote: [],
              roundnumber: 0,
              cluestatus: that.data.cluestatus
            },
            method: "POST",
            success: function (res) {
              console.log("succeeded")
              wx.setStorage({
                key: "createtableid",
                data: that.data.tableid
              });
              wx.request({
                url: 'https://larpxiaozhushou.tk/api/character?gameid=' + that.data.gameid,
                success: function (res) {
                  console.log(res.data)
                  that.setData({
                    characterlist: res.data
                  })
                }
              })
            },
          });

        },
      });
    }
  },

  onShow: function (e) {
    let that = this
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/game/',
      success: function (res) {
        that.setData({
          gamelist: res.data
        })
      },
    });

  }
})