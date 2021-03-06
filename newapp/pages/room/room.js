//index.js
//获取应用实例
const app = getApp()
var larp = require('../../utils/util.js')
Page({
  data: {
    updatetab: [false, false, false, false, false, false],
    tutorial: ["https://usbackendwjn704.larpxiaozhushou.tk/pic/tutorial0", "https://usbackendwjn704.larpxiaozhushou.tk/pic/tutorial1", "https://usbackendwjn704.larpxiaozhushou.tk/pic/tutorial2", "https://usbackendwjn704.larpxiaozhushou.tk/pic/tutorial3", "https://usbackendwjn704.larpxiaozhushou.tk/pic/tutorial4", "https://usbackendwjn704.larpxiaozhushou.tk/pic/tutorial5"],
    currenttutorial: -1,
    animationData: {},
    user_id: '',
    tableid: '',
    gameid: '',
    characterid: '',
    characterplot: [],
    characterinfo: {},
    mainplot: [],
    gameinfo: {},
    display: '0',
    acquiredclue: [],
    broadcast: [],
    vote: -1,
    voted: -1,
    voteresult: [],
    roundnumber: 0,
    // tab切换    
    currentTab: 0,
    hostname: '',
    usernickname: '',
    globalbroadcast: [],
    actionpoint: 0,
    cluestatus: [],
    currentclue: 0,
    picksend:null,
    touchtime: 0,
    //图片放缩
    stv: {
      offsetX: 0,
      offsetY: 0,
      zoom: false, //是否缩放状态
      distance: 0,  //两指距离
      scale: 1,  //缩放倍数
    },
    seeimage:-1
  },

  //swiper
  nexttutorial: function (e) {
    console.log(e);
    var newtab = this.data.updatetab
    newtab[e.detail.current] = false
    this.setData({
      currenttutorial: this.data.currenttutorial + 1,
      currentTab: (parseInt(e.target.id)+1)%6,
        updatetab: newtab
    })
    console.log(this.data.currentTab)
  },
  swiperH: function (e) {
    console.log(e);
    var newtab=this.data.updatetab
    newtab[e.detail.current]=false
    this.setData({
      currentTab: e.detail.current,
      updatetab: newtab
    })
  },
  swiperV: function (e) {
    console.log(e.detail.current);
    this.setData({
      currentclue: e.detail.current,
    })
  },


  touchstartCallback: function (e) {
    let that=this
    //触摸开始
    that.data.touchtime = e.timeStamp;
    console.log('touchstartCallback');
    console.log(e);
 //图片缩放
    if (e.touches.length === 1) {
      let { clientX, clientY } = e.touches[0];
      this.startX = clientX;
      this.startY = clientY;
      this.touchStartEvent = e.touches;
    } else {
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      this.setData({
        'stv.distance': distance,
        'stv.zoom': true, //缩放状态
      })
    }

  },
  touchmoveCallback: function (e) {
    //触摸移动中
    //console.log('touchmoveCallback');
    //console.log(e);

    if (e.touches.length === 1) {
      //单指移动
      if (this.data.stv.zoom) {
        //缩放状态，不处理单指
        return;
      }
      let { clientX, clientY } = e.touches[0];
      let offsetX = clientX - this.startX;
      let offsetY = clientY - this.startY;
      this.startX = clientX;
      this.startY = clientY;
      let { stv } = this.data;
      stv.offsetX += offsetX;
      stv.offsetY += offsetY;
      stv.offsetLeftX = -stv.offsetX;
      stv.offsetLeftY = -stv.offsetLeftY;
      this.setData({
        stv: stv
      });

    } else {
      //双指缩放
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      let distanceDiff = distance - this.data.stv.distance;
      let newScale = this.data.stv.scale + 0.005 * distanceDiff;
      this.setData({
        'stv.distance': distance,
        'stv.scale': newScale,
      })
    }
  },
  touchendCallback: function (e) {
    let that=this
    //触摸结束
    console.log('touchendCallback');
    console.log(e);
    if (e.touches.length === 0) {
      this.setData({
        'stv.zoom': false, //重置缩放状态
      })
      if(e.timeStamp - that.data.touchtime < 200){
        this.setData({
          seeimage: -1
        })
      }
    }
  },

  closepic: function (e){
    this.setData({
      seeimage: -1
    })
  },

  hide: function (e) {
    this.setData({
      seeimage: -1
    })
  },


  //sendClueTo
  sendclueto: function () {
    let that = this
    var tempacquiredclue =[]
    var tempuser_id
    if (this.data.characterid==this.data.picksend){
      wx.showToast({ title: '不能发给自己', icon: 'loading', duration: 1000 });
    } else if (that.data.acquiredclue[that.data.currentclue].cluenumber==-1 ){
      wx.showToast({ title: '线索已被发送', icon: 'loading', duration: 1000 });
    }else{
    //animation
    var animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease-in',
    });
    var self = this;
    this.animation = animation;
    this.animation.matrix3d(0.4, 0, 0.00, 0, 0.00, 0.4, 0.00, 0, 0, 0, 1, 0, 0, 0, 0, 1).step();
    this.animation.matrix3d(0.05, 0, 0.00, 0.0001, 0.00, 0.05, 0.00, 0, 0, 0, 1, 0, 800, 0, 0, 1).step();
    this.setData({
      animationData: this.animation.export()
    });
    
    setTimeout(function () {
      wx.request({
        url: larp.backendurl + '?type=user&tableid=' + that.data.tableid + '&characterid=' + that.data.picksend,
        success: function (res) {
          console.log(res.data[0])
          tempacquiredclue = res.data[0].acquiredclue
          tempuser_id = res.data[0]._id
        },
        complete: function () {
          console.log(tempacquiredclue)
          console.log(tempuser_id)
          wx.request({
            url: larp.backendurl + '/' + tempuser_id,
            data: {
              acquiredclue: tempacquiredclue.concat(that.data.acquiredclue[that.data.currentclue])
            },
            method: 'PUT',
            success: function (res) {
              console.log('send complete')
            },
            complete: function () {
              var newacquiredclue = that.data.acquiredclue
              newacquiredclue[that.data.currentclue] = { "content": that.data.acquiredclue[that.data.currentclue].content +"(该线索已发送给" + that.data.gameinfo.characterlist[that.data.picksend].name + ")。", "cluenumber": -1, "cluelocation": that.data.acquiredclue[that.data.currentclue].cluelocation }
              that.setData({
                acquiredclue: newacquiredclue,
                currentclue: that.data.currentclue - 1
              })
              wx.sendSocketMessage({
                data: JSON.stringify({
                  table_id: that.data.table_id, message: 'sendclue', user_id: tempuser_id
                }),
              })
              wx.request({
                url: larp.backendurl + '/' + that.data.user_id,
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
            }
          });
        }
      });
      var animation = wx.createAnimation({
        timingFunction: 'step-end',
      });
      animation.opacity(0).matrix3d(1, 0, 0.00, 0, 0.00, 1, 0.00, 0, 0, 0, 1, 0, 0, 0, 0, 1).step();
      animation.opacity(1).step();
      self.setData({
        animationData: animation.export(),
      })
    }, 1000);
    }
  },

  picksend: function (e) {
    let that = this
    this.setData({
      picksend: e.detail.value
    })
  },

  enlarge: function (e) {
    var hidden=e.target.id
    this.setData({
      seeimage: hidden
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
      display: e.target.id
    })
  },

  nextround: function () {
    let that = this
    wx.request({
      url: larp.backendurl + '?type=user&tableid=' + that.data.tableid,
      success: function (res) {
        console.log(res.data.length)
        console.log(that.data.gameinfo.playernumber)
        if (res.data.length != that.data.gameinfo.playernumber){
          wx.showToast({ title: '人数未齐', icon: 'loading', duration: 1000 });
        }else{}
        try{
          var plotname = '确认进入下一回合：“' + that.data.gameinfo.mainplot[that.data.roundnumber + 1].plotname + '” 吗?'
        }catch(e){
          console.log(e)
          var plotname = "已经是最后一回合，请点击退出房间"
        }
          wx.showModal({
            title: '进入下回合',
            content:plotname,
            success: function (res) {
              if (res.confirm) {
                wx.request({
                  url: larp.backendurl + '/' + that.data.table_id,
                  data: {
                    roundnumber: that.data.roundnumber + 1
                  },
                  method: "PUT",
                  success: function (res) {
                    larp.socketsend(that, 'refresh')
                  },
                })
              } else if (res.cancel) {
              }
            }
          })
      },
    })


  },

  vote: function () {
    let that = this
        wx.request({
          url: larp.backendurl + '/' + that.data.user_id,
          data: {
            acquiredclue: that.data.acquiredclue,
            broadcast: that.data.broadcast,
            vote: that.data.pickvote,
            actionpoint: that.data.actionpoint
          },
          method: "PUT",
          success: function (res) {
            console.log("succeeded")
          },
        });
        this.setData({
          vote: that.data.pickvote
        })
        console.log(that.data.vote)
  }, 
  pickvote: function (e) {
    let that = this
    this.setData({
      pickvote: e.detail.value
    })
  },

  showresult: function () {
    var content = ''
    var vote
    let that = this
    wx.request({
      url: larp.backendurl + '?type=user&tableid=' + that.data.tableid + '&select=characterid vote',
      success: function (res) {
        that.setData({
          voteresult: res.data
        })
        console.log(res.data)
        for (vote in res.data) {
          console.log(res.data[vote].vote)
          if (res.data[vote].vote > -1) {
            content = content + that.data.gameinfo.characterlist[res.data[vote].characterid].name + ' : ' + that.data.gameinfo.characterlist[res.data[vote].vote].name + ' \ '
          }
        }
        wx.showModal({
          title: '结果',
          content: content,
          showCancel: false
        })
      },
    })
  },

  getclue: function (e) {
    let that = this;
    var locationid = e.target.id;
    var cluecount = this.data.gameinfo.cluelocation[locationid].count

    console.log(that.data.gameinfo.cluemethod)
    if (that.data.gameinfo.cluemethod == "return") {
      var cluenumber = Math.floor(Math.random() * cluecount)
      if (that.data.actionpoint > 0) {
        this.setData({
          actionpoint: that.data.actionpoint - 1
        })
        wx.showModal({
          title: '线索',
          content: that.data.gameinfo.cluelocation[locationid].clues[cluenumber].content + '    你的剩余行动点：' + that.data.actionpoint,
          showCancel:false
        })
        that.setData({
          acquiredclue: that.data.acquiredclue.concat(that.data.gameinfo.cluelocation[locationid].clues[cluenumber]),
          updatetab: that.data.updatetab.slice(0, 2).concat([true]).concat(that.data.updatetab.slice(3, 6))
        })
        wx.request({
          url: larp.backendurl + '/' + that.data.user_id,
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
      } else {
        wx.showModal({
          title: '线索',
          content: '你的剩余行动点：' + that.data.actionpoint,
          showCancel:false
        })
      }
    } else if (that.data.gameinfo.cluemethod == "order") {

    } else if (that.data.gameinfo.cluemethod == "random") {


      if (that.data.actionpoint > 0) {
        wx.showToast({ title: '正在获取', icon: 'loading', duration: 2000 });
        that.setData({
          actionpoint: that.data.actionpoint - 1
        })
        wx.request({
          url: larp.backendurl + '/' + that.data.table_id,
          success: function (res) {
            that.setData({
              cluestatus: res.data.cluestatus
            })
          },
          complete: function () {
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
                content: that.data.gameinfo.cluelocation[locationid].clues[cluenumber].content + '    你的剩余行动点：' + that.data.actionpoint,
          showCancel: false
              })
              var newcluestatus = that.data.cluestatus
              newcluestatus[locationid][cluenumber] = false
              that.setData({
                cluestatus: newcluestatus
              })
              console.log("new clue status")
              console.log(that.data.cluestatus)
              that.setData({
                acquiredclue: that.data.acquiredclue.concat(that.data.gameinfo.cluelocation[locationid].clues[cluenumber]),
                updatetab: that.data.updatetab.slice(0, 2).concat([true]).concat(that.data.updatetab.slice(3, 6))
              })

              wx.request({
                url: larp.backendurl + '/' + that.data.table_id,
                data: {
                  cluestatus: that.data.cluestatus
                },
                method: "PUT",
                success: function () {
                  console.log("succeeded")
                },
              });
            } else {
              wx.showModal({
                title: '线索',
                content: '你毫无所获。    你的剩余行动点：' + that.data.actionpoint,
                showCancel: false
              })
            }
            wx.request({
              url: larp.backendurl + '/' + that.data.user_id,
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

          }
        });


      } else {
        wx.showModal({
          title: '线索',
          content: '你的剩余行动点：' + that.data.actionpoint,
          showCancel: false
        })
      }
    } else {
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
      url: larp.backendurl + '/' + that.data.user_id,
      data: {
        broadcast: that.data.broadcast
      },
      method: "PUT",
      success: function (res) {
        console.log("succeeded")
      }
    });
    larp.socketsend(that, 'refresh')
  },
  save: function (e) {
    let that = this
    console.log(this.data.user_id)
    wx.request({
      url: larp.backendurl + '/' + that.data.user_id,
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
    larp.cleardata()
  },
  setactionpoint: function (e) {
    var point = e.detail.value.point
    var user
    let that = this
    console.log(this.data.user_id)
    wx.request({
      url: larp.backendurl + '?type=user&tableid=' + that.data.tableid,
      success: function (res) {
        for (user in res.data) {
          wx.request({
            url: larp.backendurl + '/' + res.data[user]._id,
            data: {
              actionpoint: point
            },
            method: "PUT",
            success: function (res) {
              console.log("point added")
              larp.socketsend(that, 'setactionpoint')
            },
          });
        }
      },
    });
  },
  revote: function (e) {
    let that=this
    var user
    wx.request({
      url: larp.backendurl + '?type=user&tableid=' + that.data.tableid,
      success: function (res) {
        for (user in res.data) {
          wx.request({
            url: larp.backendurl + '/' + res.data[user]._id,
            data: {
              vote: -1
            },
            method: "PUT",
            success: function (res) {
              console.log("vote removed")
              larp.socketsend(that, 'revote')
            },
          });
        }
      },
    });
  },

  onLoad: function (options) {
    let that = this
    var content = ''
    var cast
    console.log(options)
    if(options.firsttime==0){
      that.setData({
        currenttutorial: 0        
      })
    }
    var ispaused=false
    function getsession(){
      ispaused = true
      try{
      that.setData({
      tableid: wx.getStorageSync('tableid'),
      gameid: wx.getStorageSync('gameid'),
      characterid: wx.getStorageSync('characterid'),
      user_id: wx.getStorageSync('user_id'),
      table_id: wx.getStorageSync('table_id'),
      usernickname: app.globalData.unionid
    })
    }catch(e){
      wx.reLaunch({
        url: '../index/index',
      })
    }
      ispaused = false
    }
    function waitForIt() {
      getsession()
      if (ispaused) {
        console.log("waiting")
        setTimeout(function () { waitForIt() }, 100);
      } else {

    wx.request({
      url: larp.backendurl + '/' + that.data.table_id,
      success: function (res) {
        console.log(res.satusCode)
        if (res.statusCode == 404 && that.data.table_id){
          wx.showModal({
            title: '房间不存在',
            content: '房间不存在, 请从转发链接重新进入',
            showCancel: false,
            complete: function(res) {
              wx.request({
                url: larp.backendurl + '?type=user&tableid=' + that.data.tableid,
                success: function (res) {
                  console.log(res.data)
                  for (user in res.data) {
                    wx.request({
                      url: larp.backendurl + '/' + res.data[user]._id,
                      method: 'DELETE',
                      success: function () {
                        console.log("deleted")
                      },
                    })
                  }
                },
              })
              larp.cleardata()
            }
          })

        }else{
        that.setData({
          roundnumber: res.data.roundnumber,
          hostname: res.data.hostid,
          cluestatus: res.data.cluestatus
        })
        }
      }
    });
    wx.request({
      url: larp.backendurl + '/' + that.data.user_id,
      success: function (res) {
        that.setData({
          acquiredclue: res.data.acquiredclue,
          broadcast: res.data.broadcast,
          vote: res.data.vote,
          actionpoint: res.data.actionpoint
        })
      },
    });
    wx.request({
      url: larp.backendurl + '?type=character&gameid=' + that.data.gameid + '&characterid=' + that.data.characterid,
      success: function (res) {
        that.setData({
          characterinfo: res.data[0],
          characterplot: res.data[0].characterplot,
        })
      },
    });
    wx.request({
      url: larp.backendurl + '?type=game&id=' + that.data.gameid,
      success: function (res) {
        that.setData({
          gameinfo: res.data[0],
          mainplot: res.data[0].mainplot,
          cluestatus: res.data[0].cluestatus
        })
      },
      complete: function () {
        wx.request({
          url: larp.backendurl + '?type=user&tableid=' + that.data.tableid,
          success: function (res) {
            console.log(res.data)
            that.setData({
              globalbroadcast: res.data
            })
          },
        })
      }
    });




    wx.connectSocket({
      url: 'wss://USBACKENDWJN704.larpxiaozhushou.tk',
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket is on.')
      larp.socketsend(that, 'join')
    })
    wx.onSocketMessage(function (res) {
      var recieved = JSON.parse(res.data)
      console.log(recieved)
      if (recieved.table_id == that.data.table_id) {
        
        if (recieved.message == "refresh" || recieved.message == "join") {
          wx.showToast({ title: '信息更新', icon: 'loading', duration: 1000 });
          var content = ''
          var cast
          wx.request({
            url: larp.backendurl + '/' + that.data.table_id,
            success: function (res) {
              that.setData({
                roundnumber: res.data.roundnumber,
                updatetab: [true, true, true, true, true, true]
              })
            },
          })
          wx.request({
            url: larp.backendurl + '?type=user&tableid=' + that.data.tableid,
            success: function (res) {
              console.log(res.data)
              that.setData({
                globalbroadcast: res.data
              })
            },
          })
        }else if (recieved.message == "setactionpoint") {
          wx.showToast({ title: '刷新行动点', icon: 'loading', duration: 1000 });
          wx.request({
            url: larp.backendurl + '/' + that.data.user_id,
            success: function (res) {
              console.log(res.data)
              that.setData({
                actionpoint: res.data.actionpoint
              })
            },
          })
        } else if (recieved.message == "sendclue") {
          if (recieved.user_id == that.data.user_id){
            wx.showToast({ title: '收到线索', icon: 'loading', duration: 1000 });
            wx.request({
              url: larp.backendurl + '/' + that.data.user_id,
              success: function (res) {
                console.log(res.data)
                that.setData({
                  acquiredclue: res.data.acquiredclue
                })
              },
            })
          }
        } else if (recieved.message == "revote") {
            wx.showToast({ title: '重新投票', icon: 'loading', duration: 1000 });
            wx.request({
              url: larp.backendurl + '/' + that.data.user_id,
              success: function (res) {
                console.log(res.data)
                that.setData({
                  vote: res.data.vote
                })
              },
            })
        }
      }
    })
    wx.onSocketClose(function (res) {
      wx.reLaunch({
        url: '../index/index'
      })
    })
      }}
      waitForIt()
  },
  onHide: function () {
    console.log(this.data.user_id)
    larp.databackup(this)
  }
})
