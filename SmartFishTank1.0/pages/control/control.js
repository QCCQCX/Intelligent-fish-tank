// var msg_led_one="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"LED_ONE\",\"SIGN\":\"\"}\n" // led自动开关 打开
// var msg_led_two="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"LED_TWO\",\"SIGN\":\"\"}\n" // led自动开关 关闭
// var msg_led_three="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"LED_THREE\",\"SIGN\":\"\"}\n" // led 打开
// var msg_led_four="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"LED_FOUR\",\"SIGN\":\"\"}\n"// led 关闭

var msg_water="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"OPEN_WATER\",\"SIGN\":\"\"}\n"// led 关闭

var msg_eat_one="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"EAT_ONE\",\"SIGN\":\"\"}\n" // eat自动开关 打开
var msg_eat_two="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"EAT_TWO\",\"SIGN\":\"\"}\n" // eat自动开关 关闭
var msg_eat_three="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"EAT_THREE\",\"SIGN\":\"\"}\n" // eat打开
var msg_eat_four="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"EAT_FOUR\",\"SIGN\":\"\"}\n" // eat 关闭

var msg_eat_5="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"EAT_5\",\"SIGN\":\"\"}\n" // eat 定时3
var msg_eat_10="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"EAT_10\",\"SIGN\":\"\"}\n" // eat 定时5
var msg_eat_15="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"EAT_15\",\"SIGN\":\"\"}\n" // eat 定时10

var msg_o_one="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"O_ONE\",\"SIGN\":\"\"}\n" // o2自动开关 打开
var msg_o_two="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"O_TWO\",\"SIGN\":\"\"}\n" // o2自动开关 关闭
var msg_o_three="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"O_THREE\",\"SIGN\":\"\"}\n" // o2 打开
var msg_o_four="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"O_FOUR\",\"SIGN\":\"\"}\n" // o2 关闭

var msg_o_5="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"O_5\",\"SIGN\":\"\"}\n" // o2 定时5
var msg_o_10="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"O_10\",\"SIGN\":\"\"}\n" // o2 定时10
var msg_o_15="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"O_15\",\"SIGN\":\"\"}\n" // o2 定时15

var msg_temp_18="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"TEMP_18\",\"SIGN\":\"\"}\n" // 温度 18度
var msg_temp_20="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"TEMP_20\",\"SIGN\":\"\"}\n" // 温度 20度
var msg_temp_22="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"TEMP_22\",\"SIGN\":\"\"}\n" // 温度 22度
var msg_temp_24="{\"M\":\"say\",\"ID\":\"D28951\",\"C\":\"TEMP_24\",\"SIGN\":\"\"}\n" // 温度 24度

var socketOpenTrue=false
const app = getApp()
var money=0
var start_time=0
var username='no_login'

Page({
    data: {
        array: ['间隔5秒每次', '间隔10秒每次', '间隔15秒每次'],
        array_temp: [ '18℃', '20℃', '22℃', '24℃'],
        index_1: 0,
        index_2: 0,
        index_3: 0,
      },
    onLoad(option){
        var that =this
        try{
            username =wx.getStorageSync('username1')
            socketOpenTrue =wx.getStorageSync('socketOpenTrue1')
        }
        catch(e){
            console.log('parting页面取缓存数据失败')
        }

    },
    onShow() {
        var that=this
        try{
            username =wx.getStorageSync('username1')
            socketOpenTrue =wx.getStorageSync('socketOpenTrue1')
        }
        catch(e){
            console.log('parting页面取缓存数据失败')
        }
        if(username=='no_login'){                           
            that.setData({
                quanxian: false
            })
        } else if (username=='加浓美式'){
            if (socketOpenTrue) {
                that.setData({
                    quanxian: true
                })
            } else {
                that.setData({
                    quanxian: false
                })
            } 
        } else {
            that.setData({
                quanxian: false
            })
        }
    },

    /**********************************************************************************  switch控制  ********** */
    // switchChange_LED:function(e) {
    //     var that = this;
    //     if (e.detail.value) {
    //         //发送消息
    //         wx.sendSocketMessage({
    //             data: msg_led_one,

    //             //成功之后回调
    //             success: function (res) {
    //             console.log(res)
    //             },
    //             //失败回调
    //             fail: function (err) {
    //             console.log("sendSocketMessage fail:")
    //             },

    //             //结束回调
    //             complete: function (err) {
    //             console.log("sendSocketMessage complete:")
    //             }
    //         })
    //         that.setData({
    //             led_switch: true
    //         })
    //     } else {
    //         //发送消息
    //         wx.sendSocketMessage({
    //             data: msg_led_two,

    //             //成功之后回调
    //             success: function (res) {
    //             console.log(res)
    //             },
    //             //失败回调
    //             fail: function (err) {
    //             console.log("sendSocketMessage fail:")
    //             },

    //             //结束回调
    //             complete: function (err) {
    //             console.log("sendSocketMessage complete:")
    //             }
    //         })
    //         that.setData({
    //             led_switch: false
    //         })
    //     }
    // },

    switchChange_EAT:function(e) {
        var that = this;
        if (e.detail.value) {
            //发送消息
            wx.sendSocketMessage({
                data: msg_eat_one,
                
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
            that.setData({
                eat_switch: true
            })
        } else {
            //发送消息
            wx.sendSocketMessage({
                data: msg_eat_two,

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
            that.setData({
                eat_switch: false
            })
        }
        
    },

    switchChange_O2:function(e) {
        var that = this;
        if (e.detail.value) {
            wx.sendSocketMessage({
                data: msg_o_one,

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
            that.setData({
                o2_switch: true
            })
        } else {
            wx.sendSocketMessage({
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
            that.setData({
                o2_switch: false
            })
        }
        
    },


/*****************************************************投喂多项选择器 */
    bindPickerChange_1: function(e) {
        this.setData({
            index_1: e.detail.value
        })
        if (e.detail.value == 0) {
            //发送消息
            wx.sendSocketMessage({
                data: msg_eat_5,

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
        } else if (e.detail.value == 1) {
            wx.sendSocketMessage({
                data: msg_eat_10,

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
        } else if (e.detail.value == 2) {
            wx.sendSocketMessage({
                data: msg_eat_15,

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
        } else {}
    },
/*****************************************************打氧多项选择器 */
    bindPickerChange_2: function(e) {
        this.setData({
            index_2: e.detail.value
        })
        if (e.detail.value == 0) {
            //发送消息
            wx.sendSocketMessage({
                data: msg_o_5,

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
        } else if (e.detail.value == 1) {
            wx.sendSocketMessage({
                data: msg_o_10,

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
        } else if (e.detail.value == 2) {
            wx.sendSocketMessage({
                data: msg_o_15,

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
        } else {}
    },
/*****************************************************温度多项选择器 */
    bindPickerChange_3: function(e) {
        this.setData({
            index_3: e.detail.value
        })
        if (e.detail.value == 0) {
            //发送消息
            wx.sendSocketMessage({
                data: msg_temp_18,

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
        } else if (e.detail.value == 1) {
            wx.sendSocketMessage({
                data: msg_temp_20,

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
        } else if (e.detail.value == 2) {
            wx.sendSocketMessage({
                data: msg_temp_22,

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
        } else if (e.detail.value == 3) {
            wx.sendSocketMessage({
                data: msg_temp_24,

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
        }
    },
/**********************************************************************************  按键控制  ********** */

    controlFunction:function(type) {
        var that=this
        var type = type.currentTarget.dataset.type;
        try{
        socketOpenTrue =wx.getStorageSync('socketOpenTrue1')
        }
        catch(e){
        console.log('parting页面取缓存数据失败')
        }  
        // if (type == "led_open") {
        //     //发送消息
        //     wx.sendSocketMessage({
        //         data: msg_led_three,

        //         //成功之后回调
        //         success: function (res) {
        //         console.log(res)
        //         },
        //         //失败回调
        //         fail: function (err) {
        //         console.log("sendSocketMessage fail:")
        //         },

        //         //结束回调
        //         complete: function (err) {
        //         console.log("sendSocketMessage complete:")
        //         }
        //     })

        // } else if (type == "led_close") {
        //     //发送消息
        //     wx.sendSocketMessage({
        //         data: msg_led_four,

        //         //成功之后回调
        //         success: function (res) {
        //         console.log(res)
        //         },
        //         //失败回调
        //         fail: function (err) {
        //         console.log("sendSocketMessage fail:")
        //         },

        //         //结束回调
        //         complete: function (err) {
        //         console.log("sendSocketMessage complete:")
        //         }
        //     })
        // } else 
        if (type == "eat_open") {
            //发送消息
            wx.sendSocketMessage({
                data: msg_eat_three,

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
            wx.cloud.database().collection('EAT_BASE').add({
                // data 字段表示需新增的 JSON 数据
                data: { 
                    eat_time:new Date().getTime(),
                }
            })
        } else if (type == "eat_close") {
            //发送消息
            wx.sendSocketMessage({
                data: msg_eat_four,

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
        } else if (type == "o2_open") {
            //发送消息
            wx.sendSocketMessage({
                data: msg_o_three,

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
            wx.cloud.database().collection('O2_BASE').add({
                // data 字段表示需新增的 JSON 数据
                data: { 
                    o2_time:new Date().getTime(),
                }
            })
        } else if (type == "o2_close") {
            //发送消息
            wx.sendSocketMessage({
                data: msg_o_four,

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
        } else if (type == "water_open") {
            //发送消息
            wx.sendSocketMessage({
                data: msg_water,

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
        } else {
            // 什么都不做
        }
        
    },
    /************************************************************** 开始控制 按键响应函数 */
    startControl:function() {
        var that=this
        try{
            username =wx.getStorageSync('username1')
            socketOpenTrue =wx.getStorageSync('socketOpenTrue1')
        }
        catch(e){
            console.log('parting页面取缓存数据失败')
        }
        if(username=='no_login'){                           
                wx.showToast({
                    title: "请先登录", // 提示的内容
                    icon: 'none', // 图标，默认success
                    image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                    duration: 3000, // 提示的延迟时间，默认1500
                    mask: false, // 是否显示透明蒙层，防止触摸穿透      
                })
        } else {
            if (!socketOpenTrue) {
                wx.showToast({
                    title: "硬件连接失败", // 提示的内容
                    icon: 'none', // 图标，默认success
                    image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                    duration: 3000, // 提示的延迟时间，默认1500
                    mask: false, // 是否显示透明蒙层，防止触摸穿透      
                })
            } else {
                wx.showToast({
                    title: "当前用户暂无权限", // 提示的内容
                    icon: 'none', // 图标，默认success
                    image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                    duration: 3000, // 提示的延迟时间，默认1500
                    mask: false, // 是否显示透明蒙层，防止触摸穿透     
                })  
            }
        }
    }
})