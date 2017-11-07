// pages/create/create.js
const app = getApp()
function makepw() {
  return Math.floor(Math.random() * (10000));
};
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
Page({
  /*
   * 页面的初始数据
   */
  data: {
    gameid: '',
    gamename: '',
    tableid:'',
    tablepw:'',
    gamedescription:'',
    characterlist:[],
    cluestatus:[]
  },

  goBack: function () {
  /**
   * 待完善
   */
    wx.navigateBack({
      delta: 2
    })
  },

  deleteroom: function (e) {
    var that=this
    var user
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/table?tableid=' + that.data.tableid,
      success: function (res) {
        if(res.data.length!=0){
        wx.request({
          url: 'https://larpxiaozhushou.tk/api/table/' + res.data[0]._id,
          method:'DELETE',
        })
        }
      }
    })
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/user?tableid=' + that.data.tableid,
      success: function (res) {
        console.log(res.data)
        for(user in res.data){
        wx.request({
          url: 'https://larpxiaozhushou.tk/api/user/' + res.data[user]._id,
          method: 'DELETE',
          success: function () {
            console.log("deleted")
          },
          
        })
        }
      },

    })
    wx.removeStorage({
      key: 'createtableid',
      success: function (res) {
        console.log("storage removed")
      }
    })
    console.log('deleted')
    wx.reLaunch({
      url: '../index/index'
    })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    let that = this
    if(options.tableid){

      console.log("enter created room")
      wx.request({
        url: 'https://larpxiaozhushou.tk/api/table?tableid=' + options.tableid,
        success: function (res) {
          console.log(res.data)
          if(res.data.length!=0){
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
      console.log("already have "+ that.data.tableid)
    }else{
      this.setData({
        gameid: options.gameid,
      })
      wx.request({
      url: 'https://larpxiaozhushou.tk/api/game?id=' + options.gameid,
      success: function (res) {
        console.log(res)
        that.setData({
          gamename:res.data[0].name,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let that = this
    //console.log(res)
    if (res.target.id == 'info') {
      // 来自页面内转发按钮
      console.log("pages/distribute/distribute?tableid=" + that.data.tableid + "&gameid=" + that.data.gameid + "&type=table")
    return {
      title: '游戏及人介绍',
      imageUrl: '/icon/detect_shop.png',
      path: 'pages/distribute/distribute?tableid=' + that.data.tableid + '&gameid=' + that.data.gameid + '&type=table',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }}else{
      // 来自页面内转发按钮
      return {
        title: '人物码: ' + that.data.characterlist[res.target.id].charactername,
      imageUrl: '/icon/detect_shop.png',
      path: 'pages/distribute/distribute?id=' + res.target.id + '&tableid=' + that.data.tableid + '&gameid=' + that.data.gameid + '&type=character',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
}
})