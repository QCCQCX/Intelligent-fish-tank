function formatTime(newDateTime) {
    var date = new Date(newDateTime);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year + "年" + month + "月" + day + "日" + hour + "时" + minute + "分"+second+'秒'
}
var socketOpen = false
const msg = "{\"M\":\"login\",\"ID\":\"22049\",\"K\":\"8ea37c2afb\"}\n"
// var msg_led_two="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"LED_TWO\",\"SIGN\":\"\"}\n" // led自动开关 关闭
var msg_eat_two="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"EAT_TWO\",\"SIGN\":\"\"}\n" // eat自动开关 关闭
var msg_o_two="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"O_TWO\",\"SIGN\":\"\"}\n" // o2自动开关 关闭
var username='no_login'
var flag_login = false // 贝壳物联账号登录标志

wx.cloud.init({
    env: 'tyf1-8go94xva19a21e9e', //云开发环境id
    traceUser: true,
  })

Page({
    //轮播图
    data: {
        "bnrUrl": [{
        "url": "../pic/adver_1.png"
        },{
        "url": "../pic/adver_2.png"
        },{
        "url": "../pic/adver_3.png"
        }
        ]
    },

    //变量赋值
    onLoad: function () {
        var that = this;
        username='no_login'
        that.setData({
            userInfo:'',
            TEMP:0,
            WATER:0,
            O2:0,
            EAT:0,
            O2_TIME:0,
            EAT_TIME:0
        })
        wx.setStorageSync('user', null)
        wx.setStorageSync('username1', username)
        wx.setStorageSync('socketOpen1', false)
        wx.setStorageSync('socketOpenTrue1', false)
        wx.setStorageSync('gate_flag', false)

        //创建 WebSocket 连接
        wx.connectSocket({
            //socket合法域名
            url: 'wss://www.bigiot.net:8484',
            //HTTP Header , header 中不能设置 Referer
            header: {
                'content-type': 'application/json'
            },
            //请求方式
            method: "GET",
            //成功之后回调
            success: function (res) {
                console.log(res)
            },
            //失败回调
            fail: function (err) {
                console.log("connectSocket fail:")
                wx.setStorageSync('socketOpenTrue1', false)
            },
            //结束回调
            complete: function (err) {
                console.log("connectSocket complete:")
                wx.setStorageSync('socketOpenTrue1', false)
            }
        })
        //监听打开事件。
        wx.onSocketOpen(function (res) {
            console.log('WebSocket连接已打开！')
            //修改socketOpen标记
            socketOpen = true
        })
        //监听WebSocket错误
        wx.onSocketError(function (res) {
            console.log('WebSocket连接打开失败！')
        })
        //接收消息事件。
        wx.onSocketMessage(function (res) {
            if(JSON.parse(res.data).M=='update'){
                console.log('收到服务器内容：' + res.data)
                
                wx.setStorageSync('LED', JSON.parse(res.data).V[25507])
                wx.setStorageSync('TEMP', JSON.parse(res.data).V[25504])
                wx.setStorageSync('O2', JSON.parse(res.data).V[25508])
                wx.setStorageSync('EAT', JSON.parse(res.data).V[25505])
                wx.setStorageSync('WATER', JSON.parse(res.data).V[25506])

                wx.setStorageSync('socketOpenTrue1', true)

                that.setData({
                    TEMP: wx.getStorageSync('TEMP'),
                    WATER: wx.getStorageSync('WATER'),
                    O2: wx.getStorageSync('O2'),
                    EAT: wx.getStorageSync('EAT')
                })
            } else if (JSON.parse(res.data).M=='ping') {
                console.log('连接心跳：' + res.data)
                wx.sendSocketMessage({
                data: 'ping',
                });
            } else {
                console.log('收到服务器内容：' + res.data)
            }
        })
        //监听WebSocket关闭。
        wx.onSocketClose(function (res) {
            wx.setStorageSync('socketOpenTrue1', false)
            console.log('WebSocket 已关闭！')
        })
        wx.sendSocketMessage({
            // data: msg_led_two,
            data: msg_eat_two,
            data: msg_o_two,
            //成功之后回调
            success: function (res) {
            console.log(res)
            },
            //失败回调
            fail: function (err) {
            console.log("sendSocketMessage fail:")
            },
            //结束回调
            complete: function (err) {
            console.log("sendSocketMessage complete:")
            }
        })
    },

    onShow() {
        this.setData({
            userInfo: wx.getStorageSync('user'),
        })
        var that =this;
        let eat = null;
        let o2 = null;
        wx.cloud.database().collection('O2_BASE').orderBy('o2_time', 'desc').limit(1).get({
            success: function(res) {
                // res.data 是包含以上定义的两条记录的数组
                if (res.data.length>0) { 
                    o2 = res.data[0].o2_time;
                }
                that.setData({
                    O2_TIME:formatTime(o2)
                }) 
            }
        })
        wx.cloud.database().collection('EAT_BASE').orderBy('eat_time', 'desc').limit(1).get({
            success: function(res) {
                // res.data 是包含以上定义的两条记录的数组
                console.log(res.data);
                if (res.data.length>0) { 
                    eat = res.data[0].eat_time;
                }
                that.setData({
                    EAT_TIME:formatTime(eat)
                }) 
            }
        })
    },

    nologin(){
        var that = this;
        wx.showModal({
            title: "退登", // 提示的标题
            content: "确认退出登录？", // 提示的内容
            showCancel: true, // 是否显示取消按钮，默认true
            cancelText: "取消", // 取消按钮的文字，最多4个字符
            cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
            confirmText: "确认", // 确认按钮的文字，最多4个字符
            confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
            success: function (res) {
                if (res.confirm) {
                    username='no_login'
                    that.setData({
                        userInfo:''
                    })
                    wx.setStorageSync('user', null)
                    wx.setStorageSync('username1', username)
                    wx.setStorageSync('socketOpenTrue1', false)
                    wx.setStorageSync('quanxian', false)
                    //  wx.setStorageSync('admin', false)
                    wx.showToast({
                        title: "退登成功", // 提示的内容
                        icon: 'none', // 图标，默认success
                        image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                        duration: 3000, // 提示的延迟时间，默认1500
                        mask: false, // 是否显示透明蒙层，防止触摸穿透     
                    })   
                }
            }
        })
    },
    //************************************************************************** 更新状态 按键响应函数 */

    fresh_status(){
        var that=this;
        let eat = null;
        let o2 = null;

        this.setData({
            TEMP: wx.getStorageSync('TEMP'),
            WATER: wx.getStorageSync('WATER'),
            O2: wx.getStorageSync('O2'),
            EAT: wx.getStorageSync('EAT')
        })

        wx.cloud.database().collection('O2_BASE').orderBy('o2_time', 'desc').limit(1).get({
            success: function(res) {
                // res.data 是包含以上定义的两条记录的数组
                console.log(res.data);
                if (res.data.length>0) { 
                    o2 = res.data[0].o2_time;
                }
                that.setData({
                    O2_TIME:formatTime(o2)
                }) 
            }
        })
        wx.cloud.database().collection('EAT_BASE').orderBy('eat_time', 'desc').limit(1).get({
            success: function(res) {
                // res.data 是包含以上定义的两条记录的数组
                console.log(res.data);
                if (res.data.length>0) { 
                    eat = res.data[0].eat_time;
                }
                that.setData({
                    EAT_TIME:formatTime(eat)
                }) 
            }
        })
        wx.showToast({
            title: "状态已更新", // 提示的内容
            icon: 'none', // 图标，默认success
            image: "", // 自定义图标的本地路径，image 的优先级高于 icon
            duration: 3000, // 提示的延迟时间，默认1500
            mask: false, // 是否显示透明蒙层，防止触摸穿透     
        })  
    },
    go: function() {
        //**********************************************************************贝壳物联账号登录 */
        if (socketOpen && flag_login == false) {
            //发送消息
            wx.sendSocketMessage({
                data: msg,
                //成功之后回调
                success: function (res) {
                    console.log(res)
                    console.log('贝壳物联账号登录成功！')
                
                },
                //失败回调
                fail: function (err) {
                    console.log("sendSocketMessage fail:")
                },
                //结束回调
                complete: function (err) {
                    console.log("sendSocketMessage complete:")
                }
            })
            flag_login = true;
        } else if (!socketOpen) {
            wx.showToast({
                title: "物联网中间件连接失败", // 提示的内容
                icon: 'none', // 图标，默认success
                image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                duration: 3000, // 提示的延迟时间，默认1500
                mask: false, // 是否显示透明蒙层，防止触摸穿透     
            })
            //socketMsgQueue.push(msg)
        } else {
           
        }
        wx.navigateTo({
            url:'/pages/login/login'
        })
    }
})