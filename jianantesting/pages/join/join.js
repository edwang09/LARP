//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    table_id:'',
    characterlist: [],
    charactername:'',
    characterid:-1,
    characterpw: 'fakepassword',
    characterpasscode: '',
    hasgame: false,
    tableid:'',
    tablepw:'',
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
    wx.showToast({ title: '读取房间', icon: 'loading', duration: 2000 });
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/table?tableid=' + this.data.tableid+'&passcode=' + this.data.tablepw,
      success: function(res) {
          if(res.data.length!=0){
            that.setData({
              gameid: res.data[0].gameid,
              gamename: res.data[0].gamename,
              table_id: res.data[0]._id
            })
          }
        },
        complete: function(){
          if (that.data.gameid != '') {
          wx.request({
            url: 'https://larpxiaozhushou.tk/api/game?id=' + that.data.gameid ,
              success: function (res) {
                  console.log(res.data)
                  that.setData({
                    description: res.data[0].descripion, 
                    characterlist: res.data[0].characterlist,
                    hasgame: true
                  })
                  if (that.data.characterid!=-1){
                    that.setData({
                      charactername: res.data[0].characterlist[that.data.characterid].name,
                      characterpw: res.data[0].characterlist[that.data.characterid].passcode
                  })
                  }
                },
              });
          wx.showToast({ title: '进入成功', duration: 1000 })
          }else{
            wx.showToast({ title: '输入有误', icon:'loading', duration: 1000 })
          }
      }
    });
    
  },
  choosecharacter: function () {
    let that = this
    if (this.data.characterpasscode == this.data.characterpw){
      wx.showToast({ title: '读取房间', icon: 'loading', duration: 2000 });
      wx.request({
        url: 'https://larpxiaozhushou.tk/api/user?tableid=' + that.data.tableid + '&characterid=' + that.data.characterid,
        success: function (res) {
          console.log(res.data.length);
          if (res.data.length == 0) {
            wx.request({
              url: 'https://larpxiaozhushou.tk/api/user',
              data: {
                tableid: that.data.tableid,
                gameid: that.data.gameid,
                characterid: that.data.characterid,
                usernickname: app.globalData.userInfo.nickName,
                actionpoint:0,
                vote:-1
              },
              method: "POST",
              success: function (res) {
                console.log(res.data)
              },
              complete: function(res){
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
                  url: '../room/room',
                })
              }
            });
          } else if(res.data[0].usernickname == app.globalData.userInfo.nickName){
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
          }else{
            wx.showToast({ title: '输入有误', duration: 1000 })
          }
        }
      });
    }else{
      wx.showToast({ title: '输入有误', duration: 1000 })
    }

  },
  onLoad: function (options) {
    if (options.tableid != null && options.tablepw!=null) {
      this.setData({
        tableid: options.tableid,
        tablepw: options.tablepw,
        characterid: options.characterid,
        characterpasscode: options.characterpasscode
      })
    }
  },
})
//if(this.data.tableid=='temprary' && this.data.tablepw=='123123'){ wx.showToast({ title: '读取房间', icon: 'success', duration: 2000 }) } else{ wx.showToast({ title: '输入有误', icon: 'success', duration: 2000 }) }