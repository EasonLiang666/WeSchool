// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    list:[
      {
        icon: "images/aboutUs.png",
        title: "关于我们",
        click: "about"
      }, {
        icon: "images/update.png",
        title: "更新日志",
        click: "journal"
      }, {
        icon: "images/login.png",
        title: "登录/注销账号",
        click: "login"
      }
<<<<<<< HEAD
    ],
    userInfo:[
      {
        icon: "images/class.png",
        title: "班级",
        littleTitle: "访客班级",
        click: "class"
      },{
        icon: "images/academy.png",
        title: "专业",
        littleTitle: "访客专业",
        click: "academy"
      }
=======
>>>>>>> 1f0eda0809a5937cafb7a3162b0db55dd478befd
    ]
  },
  onLoad() {
    
  },
  
<<<<<<< HEAD
  class(e){
    console.log(e,"班级");
  },
  academy(e){
    console.log(e,"专业");
  },
=======
>>>>>>> 1f0eda0809a5937cafb7a3162b0db55dd478befd
  about(e){
    console.log(e)
    console.log("关于我们")
  },
  journal(e){
    console.log(e)
    console.log("更新日志")
  },
  login(e){
    console.log(e)
    console.log("登录/注销账号")
  }

  
})
