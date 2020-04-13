var utils=require('../../utils/utils.js');
const app = getApp();
Page({
  data:{
    ifLegal:1,
    m:null,
    result:"请在输入m后点击\"求解\""
  },
  //事件处理函数
  gotoHelp:function(){
    app.gotoHelp('qr');
  },
  inM:function(e){
    this.setData({
      m:e.detail.value
    })
  },
  cal:function(){
    console.log(this.data.m)
    let temp = this.ifQr(this.data.m);
    this.setData({
      result:temp
    })
  },
  //功能函数
  ifQr:function(m){
    m = Number(m);
    let output=[];
    for(let i=1;i<m;i++){
      output.push(i*i%m);
    }
    function sortNumber(a,b)
    {
      return a - b
    }
    output.sort(sortNumber);
    for(let i=output.length-1;i>0;i--){
      if(output[i]==output[i-1]) output.splice(i,1);
    }
    if(output[0]==0) output.splice(0,1);
    return output;
  }
})