// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  formSubmit(event) {
    let post_value = event.detail.value;
    let usr_name = post_value.usr_name;
    let pwd = post_value.pwd;
    let pwd_confirm = post_value.confirm_pwd;

    let msgObj = {
      title: '',
      icon: 'warn',
      duration: 2000
    };

    if (pwd_confirm != pwd) {
      msgObj.title = '密码不一致';
      wx.showToast(msgObj);
    } else if (usr_name == '')  {
      msgObj.title = '用户名为空';
      wx.showToast(msgObj);
    } else if (pwd == '') {
      msgObj.title = '密码为空';
      wx.showToast(msgObj);
    } else {
      wx.request({
        url: 'http://localhost:8080/register',
        method: "POST",
        data: {
          usr: usr_name,
          pwd: pwd,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          let msgObj = {
            title: '',
            icon: 'success',
            duration: 2000
          }
          // 如果用户注册成功
          if (res.statusCode == 200) {
            msgObj.title = '注册成功';
            wx.showToast();

            wx.navigateTo({
              url: '../user/user',
            })
          } else if (res.statusCode == 500) {
            msgObj.title = '服务器内部错误';
            wx.showToast(msgObj);
          } else if (res.statusCode == 602) {
            msgObj.title = '用户名已存在';
            wx.showToast(msgObj);
          }
        }
      })
    }
  }
})