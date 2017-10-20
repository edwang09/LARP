//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    user_id:'',
    tableid:'',
    gameid: '',
    characterid: '',
    characterplot:[],
    characterinfo:{},
    mainplot:[],
    gameinfo:{},
    display:'0',
    acquiredclue:[],
    broadcast:[],
    vote:-1,
    voteresult:[],
    roundnumber:0,
    // tab切换    
    currentTab: 0,
    hostname:'',
    usernickname: '',
    globalbroadcast:[],
    actionpoint:0,
    cluestatus:[]
  },
  
  //swiper
  
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current,
    })
  }, 


  //navigator
  navigate: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
    this.setData({
      display:e.target.id
    })
  },

  nextround: function () {
    let that = this
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/table/' + that.data.table_id,
      data: {
        roundnumber: that.data.roundnumber+1
      },
      method: "PUT",
      success: function (res) {
        wx.sendSocketMessage({
          data: "refresh",
        })
      },
    })
  },

  vote: function () {
    let that = this
    wx.showActionSheet({
      itemList: that.data.gameinfo.characterlist.map(d => d.name),
      success: function (res) {
        that.setData({
          vote: res.tapIndex
        })
        wx.request({
          url: 'https://larpxiaozhushou.tk/api/user/' + that.data.user_id,
          data: {
            acquiredclue: that.data.acquiredclue,
            broadcast: that.data.broadcast,
            vote: that.data.vote,
            actionpoint: that.data.actionpoint
          },
          method: "PUT",
          success: function (res) {
            console.log("succeeded")
          },
        });
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }, 

  showresult: function () {
    var content=''
    var vote
    let that = this
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/user?tableid=' + that.data.tableid + '&select=characterid vote',
      success: function (res) {
        that.setData({
          voteresult: res.data
        })
        console.log(res.data)
        for(vote in res.data){
          console.log(res.data[vote].vote)
          if (res.data[vote].vote>-1){
            content = content + that.data.gameinfo.characterlist[res.data[vote].characterid].name + ' : ' + that.data.gameinfo.characterlist[res.data[vote].vote].name + ' \ '
          }
        }
        wx.showModal({
          title: '结果',
          content: content,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
    })
  },

  getclue: function (e) {
    let that = this;
    var locationid = e.target.id;
    var cluecount = this.data.gameinfo.cluelocation[locationid].count
    
    console.log(that.data.gameinfo.cluemethod)
    if(that.data.gameinfo.cluemethod=="return"){
      var cluenumber = Math.floor(Math.random() * cluecount)
            if (that.data.actionpoint>0){
            this.setData({
              actionpoint:that.data.actionpoint-1
            })
            wx.showModal({
              title: '线索',
              content: that.data.gameinfo.cluelocation[locationid].clues[cluenumber].content + '    你的剩余行动点：' + that.data.actionpoint,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            that.setData({
              acquiredclue: that.data.acquiredclue.concat(that.data.gameinfo.cluelocation[locationid].clues[cluenumber])
            })
            wx.request({
              url: 'https://larpxiaozhushou.tk/api/user/' + that.data.user_id,
              data: {
                acquiredclue: that.data.acquiredclue,
                broadcast: that.data.broadcast,
                vote: that.data.vote,
                actionpoint: that.data.actionpoint
              },
              method: "PUT",
              success: function () {
                console.log("succeeded")
              },
            });
            }else{
              wx.showModal({
                title: '线索',
                content: '你的剩余行动点：' + that.data.actionpoint,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
    } else if (that.data.gameinfo.cluemethod == "order"){

    } else if (that.data.gameinfo.cluemethod == "random") {
      
      
      if (that.data.actionpoint > 0) {
        that.setData({
          actionpoint: that.data.actionpoint - 1
        })
        wx.request({
          url: 'https://larpxiaozhushou.tk/api/table/' + that.data.table_id,
          success: function (res) {
            that.setData({
              cluestatus: res.data.cluestatus
            })
          },
          complete:function(){
            var remaining = that.data.cluestatus[locationid].filter(v => v).length
            var clueid
            var cluenumber = Math.floor(Math.random() * remaining)
            if (remaining > 0) {
              console.log(cluenumber)
              for (clueid in that.data.cluestatus[locationid]) {
                if (that.data.cluestatus[locationid][clueid] == true) {
                  if (clueid == cluenumber) {
                    break;
                  }
                } else {
                  cluenumber = cluenumber + 1
                  console.log(cluenumber)
                }
              }
              
              wx.showModal({
                title: '线索',
                content: that.data.gameinfo.cluelocation[locationid].clues[cluenumber].content + '    你的剩余行动点：' + that.data.actionpoint
              })
            } else {
              wx.showModal({
                title: '线索',
                content: '你毫无所获。    你的剩余行动点：' + that.data.actionpoint
              })
            }
            var newcluestatus = that.data.cluestatus
            newcluestatus[locationid][cluenumber] = false
            that.setData({
              cluestatus: newcluestatus
            })
            console.log("new clue status")
            console.log(that.data.cluestatus)
            that.setData({
              acquiredclue: that.data.acquiredclue.concat(that.data.gameinfo.cluelocation[locationid].clues[cluenumber])
            })
            wx.request({
              url: 'https://larpxiaozhushou.tk/api/user/' + that.data.user_id,
              data: {
                acquiredclue: that.data.acquiredclue,
                broadcast: that.data.broadcast,
                vote: that.data.vote,
                actionpoint: that.data.actionpoint
              },
              method: "PUT",
              success: function () {
                console.log("succeeded")
              },
            });
            wx.request({
              url: 'https://larpxiaozhushou.tk/api/table/' + that.data.table_id,
              data: {
                cluestatus: that.data.cluestatus
              },
              method: "PUT",
              success: function () {
                console.log("succeeded")
              },
            });
          }
        });
        
        
      } else {
        wx.showModal({
          title: '线索',
          content: '你的剩余行动点：' + that.data.actionpoint,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }else{
      console.log("unknown method")
    }
  },
  
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  },
  
  bindFormSubmit: function (e) {
    let that = this
    that.setData({
      broadcast: e.detail.value.textarea,
    })
    console.log(e.detail.value.textarea)
    console.log(this.data.broadcast)
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/user/' + that.data.user_id,
      data: {
        broadcast: that.data.broadcast
      },
      method: "PUT",
      success: function (res) {
        console.log("succeeded")
      }
    });
    wx.sendSocketMessage({
      data: "refresh",
    })
  },
  save: function (e) {
    let that = this
    console.log(this.data.user_id)
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/user/' + that.data.user_id,
      data: {
        acquiredclue: that.data.acquiredclue,
        broadcast: that.data.broadcast,
        vote: that.data.vote,
        actionpoint: that.data.actionpoint
      },
      method: "PUT",
      success: function (res) {
        console.log("succeeded")
      },
    });
  },
  clearinfo: function (e) {
    wx.removeStorage({
      key: 'tableid'
    })
    wx.removeStorage({
      key: 'gameid'
    })
    wx.removeStorage({
      key: 'characterid'
    })
    wx.removeStorage({
      key: 'user_id'
    })
    wx.removeStorage({
      key: 'table_id'
    })
    wx.navigateBack({
      delta:2
    })
  },
  setactionpoint: function (e) {
    var point = e.detail.value.point
    var user
    let that = this
    console.log(this.data.user_id)
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/user?tableid=' + that.data.tableid,
      success: function (res) {
        for (user in res.data) {
          wx.request({
            url: 'https://larpxiaozhushou.tk/api/user/' + res.data[user]._id,
            data: {
              actionpoint: point
            },
            method: "PUT",
            success: function (res) {
              console.log("point added")
              wx.sendSocketMessage({
                data: "setactionpoint",
              })
            },
          });
        }
      },
    });
    

  },

  onShow: function () {
    let that = this
    var content = ''
    var cast
    this.setData({
      tableid: wx.getStorageSync('tableid'),
      gameid: wx.getStorageSync('gameid'),
      characterid: wx.getStorageSync('characterid'),
      user_id: wx.getStorageSync('user_id'),
      table_id: wx.getStorageSync('table_id'),
      usernickname: app.globalData.userInfo.nickName
    });
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/table/' + that.data.table_id,
      success: function (res) {
        //console.log(res.data)
        that.setData({
          roundnumber: res.data.roundnumber,
          hostname:res.data.hostid,
          cluestatus:res.data.cluestatus
        })
      },
    });

    wx.request({
      url: 'https://larpxiaozhushou.tk/api/character?gameid=' + that.data.gameid + '&characterid=' + that.data.characterid,
      success: function (res) {
        that.setData({
          characterinfo: res.data[0],
          characterplot: res.data[0].characterplot,
        })
      },
    });
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/game?id=' + that.data.gameid,
      success: function (res) {
        that.setData({
          gameinfo: res.data[0],
          mainplot: res.data[0].mainplot,
          cluestatus: res.data[0].cluestatus
        })
      },
      complete: function(){
        wx.request({
          url: 'https://larpxiaozhushou.tk/api/user?tableid=' + that.data.tableid,
          success: function (res) {
            console.log(res.data)
            that.setData({
              globalbroadcast: res.data
            })
          },
        })
      }
    });
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/user/' + that.data.user_id,
      success: function (res) {
        that.setData({
          acquiredclue: res.data.acquiredclue,
            broadcast: res.data.broadcast,
            vote: res.data.vote,
            actionpoint: res.data.actionpoint
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
        console.log(res)
        if (that.data.tableid==that.data.tableid){
        if (res.data=="refresh"){
          var content=''
          var cast
          wx.request({
            url: 'https://larpxiaozhushou.tk/api/table/' + that.data.table_id,
            success: function (res) {
              that.setData({
                roundnumber: res.data.roundnumber,
              })
            },
          })
          wx.request({
            url: 'https://larpxiaozhushou.tk/api/user?tableid=' + that.data.tableid,
            success: function (res) {
              console.log(res.data)
              that.setData({
                globalbroadcast: res.data
              })
            },
          })
        }
        if (res.data == "setactionpoint") {
          wx.request({
            url: 'https://larpxiaozhushou.tk/api/user/' + that.data.user_id,
            success: function (res) {
              console.log(res.data)
              that.setData({
                actionpoint: res.data.actionpoint
              })
            },
          })
        }
        }
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket is off.')
    })

},
onHide: function(){
  let that= this
  console.log(this.data.user_id)
  wx.request({
    url: 'https://larpxiaozhushou.tk/api/user/' + that.data.user_id,
    data:{
      acquiredclue: that.data.acquiredclue,
      broadcast: that.data.broadcast,
      vote: that.data.vote,
      actionpoint: that.data.actionpoint
    },
    method:"PUT",
    success: function (res) {
      console.log("succeeded")
    },
  });
}
})
