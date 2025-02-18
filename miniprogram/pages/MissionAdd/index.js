import { meId, templateId, subscribeMsgSuccess } from "../config";
Page({
  //增加消息接收与发送功能
  async handleTap() {
    const ok = await this.saveMission();
    ok && await this.sendSubscribeMessage();
  },
  //发送消息
  async sendSubscribeMessage(e) {
    // const currentId = await getOpenId();
    await new Promise(resolve => {
      wx.cloud.callFunction({
        name: 'information',
        //data是用来传给云函数event的数据，你可以把你当前页面获取消息填写到服务通知里面
        data: {
          action: 'sendSubscribeMessage',
          templateId: templateId,//这里我就直接把模板ID传给云函数了
          me: 'Test_me',
          name: 'Test_activity',
          _openid: meId//填入自己的openid
        },
        success: res => {
          console.warn('[云函数] [openapi] subscribeMessage.send 调用成功：', res);
          this.setData({
            subscribeMessageResult: JSON.stringify(res.result)
          })
          resolve(true);
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '调用失败',
          })
          console.error('[云函数] [openapi] subscribeMessage.send 调用失败：', err);
          resolve(false)
        },
      })
    });
  },
  //保存正在编辑的任务
  data: {
    title: '',
    desc: '',

    credit: 0,
    maxCredit: getApp().globalData.maxCredit,
    presetIndex: 0,
    presets: [{
      name: "无预设",
      title: "",
      desc: "",
    }, {
      name: "早睡早起",
      title: "晚上要早睡，明天早起",
      desc: "熬夜对身体很不好，还是要早点睡觉第二天才能有精神！",
    }, {
      name: "打扫房间",
      title: "清扫房间，整理整理",
      desc: "有一段时间没有打扫房间了，一屋不扫，何以扫天下？",
    }, {
      name: "健康运动",
      title: "做些运动，注意身体",
      desc: "做一些健身运动吧，跳绳，跑步，训练动作什么的。",
    }, {
      name: "请客吃饭",
      title: "请客吃点好的",
      desc: "好吃的有很多，我可以让你尝到其中之一，好好享受吧！",
    }, {
      name: "买小礼物",
      title: "整点小礼物",
      desc: "买点小礼物，像泡泡马特什么的。",
    }, {
      name: "洗碗洗碟",
      title: "这碗碟我洗了",
      desc: "有我洗碗洗碟子，有你吃饭无它事。",
    }, {
      name: "帮拿东西",
      title: "帮拿一天东西",
      desc: "有了我，你再也不需要移动了。拿外卖，拿零食，开空调，开电视，在所不辞。",
    }, {
      name: "制作饭菜",
      title: "这道美食由我完成",
      desc: "做点可口的饭菜，或者专门被指定的美食。我这个大厨，随便下，都好吃。",
    }],
    list: getApp().globalData.collectionMissionList,
  },

  //数据输入填写表单
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  onDescInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  onCreditInput(e) {
    this.setData({
      credit: e.detail.value
    })
  },
  onPresetChange(e) {
    this.setData({
      presetIndex: e.detail.value,
      title: this.data.presets[e.detail.value].title,
      desc: this.data.presets[e.detail.value].desc,
    })
  },

  //保存任务
  async saveMission() {
    // 对输入框内容进行校验
    if (this.data.title === '') {
      wx.showToast({
        title: '标题未填写',
        icon: 'error',
        duration: 2000
      })
      return false;
    }
    if (this.data.title.length > 12) {
      wx.showToast({
        title: '标题过长',
        icon: 'error',
        duration: 2000
      })
      return false
    }
    if (this.data.desc.length > 100) {
      wx.showToast({
        title: '描述过长',
        icon: 'error',
        duration: 2000
      })
      return false
    }
    if (this.data.credit <= 0) {
      wx.showToast({
        title: '一定要有积分',
        icon: 'error',
        duration: 2000
      })
      return false
    } else {
      await wx.cloud.callFunction({ name: 'addElement', data: this.data }).then(subscribeMsgSuccess);
      return true
    }
  },

  // 重置所有表单项
  resetMission() {
    this.setData({
      title: '',
      desc: '',
      credit: 0,
      presetIndex: 0,
      list: getApp().globalData.collectionMissionList,
    })
  }
})