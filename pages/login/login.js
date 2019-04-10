Page({
  formSubmit(event) {
    let data_post = event.detail.value;

    wx.request({
      url: 'http://localhost:8080/login',
      method: "POST",
      data: {
        usr: event.detail.value.usr_name,
        pwd: event.detail.value.pwd
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let msgObj = {
          title: '',
          icon: 'info',
          duration: 2000
        };

        if (res.statusCode == 200) {
          let resCookies = res.header['Set-Cookie'];
          let re = /[a-zA-Z]+=[a-zA-Z1-9]+/g;
          let cookies = resCookies.match(re);
          let cookies_str = cookies.join(',');
          cookies_str = 'cookie=' + cookies_str;

          wx.setStorageSync('cookieKey', cookies_str); //保存Cookie到Storage
          wx.reLaunch({
            url: '../user/user',
          });
        } else if (res.statusCode == 404) {
          msgObj.title = '用户名不存在';
          wx.showToast(msgObj);
        } else if (res.statusCode == 601) {
          msgObj.title = '账户/密码错误';
          wx.showToast(msgObj);
        }
      }
    })
  },

  register() {
    wx.navigateTo({
      url: '../register/register',
    })
  }
})