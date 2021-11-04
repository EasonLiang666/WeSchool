//index.js
//获取应用实例

const db = wx.cloud.database()
const schoolLoading = db.collection('schoolLoading')

const app = getApp()
Page({
  data: {
    user: "",
    pwd: "",
    school: [],
    url: '',
    urls: []
  },

  bindPickerChange: function(e) {
    var that = this
    this.setData({
      index: e.detail.value,
      url: that.data.urls[e.detail.value]
    })
  },

  async onLoad() {
    // 注意！这个只能拉100个学校，我也希望未来我们能超过100个
    var that = this;
    var res = (await schoolLoading.where({}).get()).data
    res.forEach(e => {
      if(e.schoolName !== '空'){
        this.data.school.push(e.schoolName)
        this.data.urls.push(e.url)
      }
    })
    this.setData({res: res, school: that.data.school});
  },

  login: function (e) {
    var that = this
    if (this.data.user.length == 0 || this.data.pwd.length == 0) {
      wx.showToast({
        title: '帐号及密码不能为空',
        icon: "none"
      })
      return -1;
    }
    wx.showLoading({
      title: '刷新中',
      mask: true
    })
    var that = this;
    wx.showLoading({
      title: '登录中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'api',
      data: {
        url: 'login',
        username: that.data.user,
        password: that.data.pwd,
        school: that.data.school[that.data.index]
      },
      success: res => {
        wx.setStorage({
          key: 'data',
          data: ""
        })
        console.log(res.result)
        if (res.result.msg == "welcome") {
   
          wx.reLaunch({
            url: '/pages/index/index'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.result.msg,
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '校园网关闭或者服务器异常',
        })
      }
    })
  },
  input: function (e) {
    this.setData({
      [e.target.id]: e.detail.value
    })
  },
  // 帮助弹窗
  tapHelp: function (e) {
    if (e.target.id == 'help_model') {
      this.hideHelp();
    }
  },
  showHelp: function (e) {
    this.setData({
      'help_status': true
    });
  },
  hideHelp: function (e) {
    this.setData({
      'help_status': false
    });
  },
  copy() {
    wx.setClipboardData({
      data: this.data.url,
      success() {
        wx.showToast({
          title: '已成功复制地址，快用浏览器打开吧',
          icon: "none"
        })
      }
    })
  }

})