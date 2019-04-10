// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'attention': 0,
    'fans': 0,
    'menu_arr': [
      { content: '公开相册', src: './public/index' },
      { content: '私密相册', src: './secret/index' },
      { content: '我的收藏', src: './favors/index' },
      { content: '我的文章', src: './articles/index' }
    ],
    'user_astar_src': ''
  },

  /**
   * 查看用户的公开相册，私密相册等内容
   */
  viewer: function (event) {
    // 获取应该跳转的链接的idx
    let item_idx = event.currentTarget.id;
    wx.navigateTo({
      url: this.data.menu_arr[item_idx].src,
    })
  },

  /**
   * 上传头像和图片
   * type: 上传文件类型（头像 or 图片）
   */
  upload_pics: function (event) {
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        let header = {
          'cookie': wx.getStorageSync('cookieKey')
        };
        
        let uploadTask = wx.uploadFile({
          url: 'http://localhost:8080/' + event.currentTarget.id,
          filePath: tempFilePaths[0],
          name: 'file',
          header: header,
          formData: {
            user: 'test'
          },
          success(res) {
            console.log('success');
          }
        });
      }
    });
  },

  /**
   * 导航至上传图片的页面
   */
  navigate_pic_upload: function () {
    wx.navigateTo({
      url: '/pages/user/upload_pics/upload',
    })
  },

  /**
   * 导航至用户足迹地图的页面
   */
  navigate_map: () => {
    wx.navigateTo({
      url: '/pages/user/map/map',
    })
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {
    let cookie = wx.getStorageSync('cookieKey');

    if (!cookie) {   // 若用户不处于登录状态
      wx.redirectTo({
        url: '../login/login',
      });
    } else {    // 加载用户相关的信息
      let cookies = cookie.slice(7).split(',');
      let user = cookies[0].split('=')[1];
      let pwd = cookies[1].split('=')[1];

      let that = this;
      wx.request({
        url: 'http://localhost:8080/user',
        method: 'GET',
        data: {
          usr: user
        },
        success: function (res) {
          let astar_file_name = res.data.astar_src;
          console.log(astar_file_name);
          if (astar_file_name == null) {
            astar_file_name = 'astar_default.gif';
          } 
          that.setData({
            user_astar_src: 'http://localhost:8080/upload/' + astar_file_name
          })
        }
      })
      
      this.setData({
        user_astar_src: 'http://localhost:8080/upload/astar_default.gif'
      });
    }
  }
})