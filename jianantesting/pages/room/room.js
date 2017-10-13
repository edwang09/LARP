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
    roundnumber:0
  },
  //navigator
  navigate: function (e) {
    this.setData({
      display:e.target.id
    })
  },
  nextround: function () {
    let that = this
    this.setData({
      roundnumber: that.data.roundnumber +1
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
            vote: that.data.vote
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
          console.log(res.data[vote].characterid)
          content = content + that.data.gameinfo.characterlist[res.data[vote].characterid].name + ' : ' + that.data.gameinfo.characterlist[res.data[vote].vote].name + ' \ '
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





  onShow: function () {
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
    this.setData({
      user_id: wx.getStorageSync('user_id')
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
      vote: that.data.vote
    },
    method:"PUT",
    success: function (res) {
      console.log("succeeded")
    },
  });
}
})
