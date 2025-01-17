let db = wx.cloud.database()
let count = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeArr: [
      {
        src: "../img/dan_change.png",
        name: "单选",
      },
      {
        src: "../img/duo_change.png",
        name: "多选",
      },
      {
        src: "../img/dan_change.png",
        name: "填空",
      },
    ],
    title: "",
    contentDetail: "",
    tempContent: [],
    content: "",
    weatherChange: false,
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let args = wx.getStorageSync('args');
    count = args.username
    if (id) {
      db.collection("associtaionMath").where({ _id: id }).get().then(res => {
        let data = res.data[0]
        this.setData({
          title: data.senderMess.title,
          contentDetail: data.senderMess.contentDetail,
          tempContent: data.question,
          imgUrl: data.imgUrl,
          weatherChange: true,
          id: id
        })
        // 查询社团信息
        db.collection("associationApply").where({ count: count }).get().then(res => {
          this.setData({
            assoMess: res.data[0].hostMess
          })
        })
      })
    }
  },
  clickme() {
    this.showModal()
  },
  // 弹窗
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  // 详情页
  goAdd(e) {
    let type = e.currentTarget.dataset.item.name
    wx.navigateTo({
      url: '/pages/association/add_question/add_question?type=' + type,
    })
    this.setData({
      content: ""
    })
  },
  title(e) {
    this.setData({
      title: e.detail.value
    })
  },
  detail(e) {
    console.log(e);
    this.setData({
      contentDetail: e.detail.value
    })
  },
  // 删除
  delete(e) {
    // console.log(e);
    let index = e.currentTarget.dataset.index
    this.data.tempContent.splice(index, 1)
    this.setData({
      tempContent: this.data.tempContent
    })
  },
  // 保存
  hold(e) {
    let status = e.currentTarget.dataset.status
    // console.log(status);
    if (this.data.title == "" || this.data.detail == "") {
      wx.showToast({
        title: '完善标题和内容',
        icon: "none"
      })
    }
    else if (this.data.tempContent.length == 0) {
      wx.showToast({
        title: '请添加问题',
        icon: "none"
      })
    }
    else if (this.data.imgUrl == "") {
      wx.showToast({
        title: '添加图片',
        icon: "none"
      })
    }
    else {
      wx.showLoading({
        title: "保存中",
        mask: true,
        success: (result) => {
          let imgUrl = this.data.imgUrl
          let userInfo = wx.getStorageSync('args');
          let senderMess = {
            "title": this.data.title,
            "contentDetail": this.data.contentDetail
          }
          let question = this.data.tempContent
          // 计算图片
          wx.getImageInfo({
            src: imgUrl,
            success: (res) => {
              // let CoverHeight = res.height + 'rpx'
              let tempHeight = res.height > 500 ? 500 : tempHeight
              let CoverHeight = tempHeight + 'rpx'
              let CoverWidth = res.width
              let ShowHeight = tempHeight
              if (this.data.weatherChange == false) {
                db.collection("associtaionMath").add({
                  data: {
                    count: userInfo.username,
                    schoolName: userInfo.schoolName,
                    senderMess,
                    question,
                    imgUrl,
                    time: Date.now(),
                    sendStatus: status,
                    CoverHeight,
                    CoverWidth,
                    ShowHeight,
                    assoMess: this.data.assoMess
                  }
                }).then(res => {
                  wx.hideLoading();
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                    duration: 1500,
                    mask: false,
                    success: (result) => {
                      wx.navigateBack({
                        delta: 2
                      });
                    },
                  });
                })
              }
              else {
                db.collection("associtaionMath").where({ _id: this.data.id }).update({
                  data: {
                    count: userInfo.username,
                    schoolName: userInfo.schoolName,
                    senderMess,
                    question,
                    imgUrl,
                    time: Date.now(),
                    sendStatus: status,
                    CoverHeight,
                    CoverWidth,
                    ShowHeight,
                    assoMess: this.data.assoMess
                  }
                }).then(res => {
                  wx.hideLoading();
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                    duration: 1500,
                    mask: false,
                    success: (result) => {
                      wx.navigateBack({
                        delta: 2
                      });
                    },
                  });
                })
              }
            },
          });

        },
      });
    }
  },
  // 保存并发布
  holdSend(e) {
    this.hold(e)
  },
  // 上传图片
  addImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let tempUrl = res.tempFilePaths[0]
        wx.cloud.uploadFile({
          cloudPath: "association/" + Date.now() + ".jpg",
          filePath: tempUrl
        }).then(res => {
          // console.log(res);
          let imgUrl = res.fileID
          this.setData({
            imgUrl: imgUrl
          })
        })
      },
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 编辑
  toFixed(e) {
    // console.log(e);
    let content = e.currentTarget.dataset.item
    let type = content.type
    wx.navigateTo({
      url: '/pages/association/add_question/add_question?type=' + type + '&fiexed=' + true + '&content=' + JSON.stringify(content),
      success: (result) => {
        this.setData({
          content: ""
        })
      },
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(this.data.tempContent);
    if (this.data.content) {
      this.data.tempContent.push(this.data.content)
      this.setData({
        tempContent: this.data.tempContent
      })
    }
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
  onShareAppMessage: function () {

  }
})