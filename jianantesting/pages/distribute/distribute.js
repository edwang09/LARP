const app = getApp()
var larp = require('../../utils/util.js')
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
    gameinfo:{},
    characterid:-1,
    gameid:null
  },

  enterroom: function () {
    let that = this
    try{
          wx.showToast({ title: '读取房间', icon: 'loading', duration: 2000 });
          wx.request({
            url: larp.backendurl + '?type=user&tableid=' + that.data.tableid + '&characterid=' + that.data.characterid,
            success: function (res) {
              console.log(res.data.length);
              if (res.data.length == 0) {
                wx.request({
                  url: larp.backendurl,
                  data: {
                    type: "user",
                    tableid: that.data.tableid,
                    gameid: that.data.gameid,
                    characterid: that.data.characterid,
                    usernickname: app.globalData.userInfo.nickName,
                    actionpoint: 0,
                    vote: -1
                  },
                  method: "POST",
                  success: function (res) {
                    console.log(res.data)
                  },
                  complete: function (res) {
                    wx.setStorage({
                      key: "tableid",
                      data: that.data.tableid
                    });
                    wx.setStorage({
                      key: "gameid",
                      data: that.data.gameid
                    });
                    wx.setStorage({
                      key: "characterid",
                      data: that.data.characterid
                    });
                    wx.setStorage({
                      key: "user_id",
                      data: res.data._id
                    });
                    wx.setStorage({
                      key: "table_id",
                      data: that.data.table_id
                    });
                    wx.navigateTo({
                      url: '../room/room?firsttime=0',
                    })
                  }
                });
              } else if (res.data[0].usernickname == app.globalData.userInfo.nickName) {
                wx.showToast({ title: '读取房间', icon: 'loading', duration: 2000 });
                wx.setStorage({
                  key: "tableid",
                  data: that.data.tableid
                });
                wx.setStorage({
                  key: "gameid",
                  data: that.data.gameid
                });
                wx.setStorage({
                  key: "characterid",
                  data: that.data.characterid
                });
                wx.setStorage({
                  key: "user_id",
                  data: res.data[0]._id
                });
                wx.setStorage({
                  key: "table_id",
                  data: that.data.table_id
                });
                wx.navigateTo({
                  url: '../room/room',
                })
              } else {
                wx.showToast({ title: '请确认你的角色', duration: 1000 })
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            }
          });
    } catch (e) {
      wx.showToast({ title: '稍等一下', icon: 'loading', duration: 1000 });
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.hideShareMenu({})
    if(options.type=='table'){
      this.setData({
        displaytype: options.type
      })
      wx.request({
        url: larp.backendurl + '?type=character&gameid=' + options.gameid,
        success: function (res) {
          that.setData({
            characterlist: res.data,
            gameid: options.gameid
          })
        }
      })
      wx.request({
        url: larp.backendurl + '?type=game&id=' + options.gameid,
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
        url: larp.backendurl + '?type=character&gameid=' + options.gameid + '&characterid=' + options.id,
        success: function (res) {
          that.setData({
            character: res.data[0],
            characterid: options.id
          })
        }
      })
      console.log(options.gameid)
      wx.request({
        url: larp.backendurl + '?type=game&id=' + options.gameid,
        success: function (res) {
          that.setData({
            gamename: res.data[0].name,
            gameid: options.gameid
          })
        }
      })
      console.log(options.tableid)
      wx.request({
        url: larp.backendurl + '?type=table&tableid=' + options.tableid,
        success: function (res) {
          that.setData({
            table_id: res.data[0]._id
          })
        }
      })


    }
    }
})