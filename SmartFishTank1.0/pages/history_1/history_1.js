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
var username
var x=0 // 跳过多少条记录
wx.cloud.init({
    env: 'tyf1-8go94xva19a21e9e', //填上你的云开发环境id
    traceUser: true,
})
Page({
    data:{
        history:[],

    },
    onLoad(){
    },

    select_history_1:function(){
        var that=this
        try{
            username =wx.getStorageSync('username1')
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
            that.setData({
            history:[]
            })
            x=0
        } else {
            wx.cloud.database().collection('EAT_BASE').skip(x).get({
                success: function(res) {
                    // res.data 是包含以上定义的两条记录的数组
                    console.log(res.data);
                    if(res.data.length>0){ 
                        let y=x;
                        for(let i=0;i<res.data.length;i++,y++){
                            that.data.history[y]=res.data[i] 
                        }
                        y=x;
                        for(let i=0;i<res.data.length;i++,y++){
                            that.data.history[y].eat_time=formatTime(res.data[i].eat_time)
                        }
                        if(res.data.length==20){
                            x+=20
                        }
                        else{
                            x=0
                        }
                    }
            
                    that.setData({
                        history:that.data.history  
                    })
                    wx.showToast({
                        title: "查询成功", // 提示的内容
                        icon: 'none', // 图标，默认success
                        image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                        duration: 3000, // 提示的延迟时间，默认1500
                        mask: false, // 是否显示透明蒙层，防止触摸穿透     
                    })
            }
            })     
            username='no_login'
        }
    }
})