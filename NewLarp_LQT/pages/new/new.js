// pages/new/new.js
var app = getApp();
Page({
  data: {
    animationData: {},
    cardInfoList: [{
      cardUrl: '../../imagesBeta/1.jpg', //or 'http://.png'
      cardInfo: {
        cardTitle: 'Mystery Express',
        cardInfoMes: ['在前往伦敦的特快列车上，神秘的乘客', '密闭的包厢内，富豪已死去多时', '你必须配合侦探洗脱嫌疑，请找出真凶']
      }
    }, {
        cardUrl: '../../imagesBeta/2.jpg',
      cardInfo: {
        cardTitle: 'Cargo Noir',
        cardInfoMes: ['在豪华游轮黑玫瑰号上，达官显贵齐聚于此', '神秘的vip咖啡厅，两名受害人', '你必须完成自己的任务，在炸弹爆炸前逃离']
      }
    }, {
        cardUrl: '../../imagesBeta/3.jpg',
      cardInfo: {
        cardTitle: 'LARP',
        cardInfoMes: ['LARP的参与者在用肢体扮演虚构人物，', '即兴诠释他们角色的说话和动作，', '参与到各种情景与谜题当中，完成任务']
      }
    }]
  },
  //事件处理函数
  slidethis: function (e) {
    console.log(e);
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
      var cardInfoList = self.data.cardInfoList;
      var slidethis = self.data.cardInfoList.shift();
      self.data.cardInfoList.push(slidethis);
      self.setData({
        cardInfoList: self.data.cardInfoList,
        animationData: {}
      });
    }, 600);
  },
  buythis: function (e) {
    console.log(e);
    app.buyDetail = this.data.cardInfoList[e.target.id];
    wx.navigateTo({
      url: '../detail/detail'
    });
  },
  onLoad: function () {
    console.log('onLoad');
    var that = this;
    //调用应用实例的方法获取全局数据
  }


})

