//index.js
//获取应用实例
const app = getApp()

var utils=require('../../utils/utils.js')

Page({
  data: {
    lastTap:null,
    count: 0,
    array: [1],
    answer:'解将于此处显示',
    expressions:[],
    rs:[],
    mods:[],
    temp:null,
    ifLegal:1
  },
  //事件处理函数
  gotoAbout:function(){
    let that = this;
    let count = that.data.count;
    console.log(count)
    let lasttime = that.data.lastTap||new Date().getTime();
    let thistime = new Date().getTime();
    (thistime-lasttime<1000)? count+=1:count=0;
    if (count>=5) {
      wx.navigateTo({
        url: '../about/about',
      });
      console.log("About")
      count = 0;
    }
    that.setData({
      lastTap:thistime,
      count:count
    })
    //console.log(lasttime);
  },

  gotoHelp:function(){
    app.gotoHelp('eqn');
  },

  add:function(){
   var that = this;
   let array = that.data.array;
   array.push(1);
    that.setData({
      array:array
    })
  },

  delete:function(){
    var that = this;
   let array = that.data.array;
   let expressions = that.data.expressions;
   let rs = that.data.rs;
   let mods = that.data.mods;
   let len = array.length;
   
  if (expressions.length==len){
    expressions.pop();
    that.setData({
      expressions:expressions
    });
    //console.log(that.data);
  }
  if (rs.length==len){
    rs.pop();
    that.setData({
      rs:rs
    });
    //console.log(that.data);
  }
  if (mods.length==len){
    mods.pop();
    that.setData({
      mods:mods
    });
    console.log(that.data);
  }
   array.pop();
   that.setData({
    array:array
  })
  },

  inputExpression:function(e){
    console.log(e.detail.value);
    console.log(e.currentTarget.dataset.i);
    var that = this;
    let expressions = that.data.expressions;
    expressions[e.currentTarget.dataset.i] = e.detail.value;
    that.setData({
      expressions:expressions
    })
  },

  inputR:function(e){
    console.log(e.detail.value);
    var that = this;
    let rs = that.data.rs;
    rs[e.currentTarget.dataset.i] = e.detail.value;
    that.setData({
      rs:rs
    })
  },

  inputMod:function(e){
    console.log(e.detail.value);
    var that = this;
    let mods = that.data.mods;
    mods[e.currentTarget.dataset.i] = e.detail.value;
    that.setData({
      mods:mods
    })
  },

  
//功能函数
 // solveEqn转为公共方法置于utils.js
parseFormula:function (fstr){
  function parseSingleFormula(str){
    let index = str.search(/\^/);//找到^运算符的位置
    let power;
    
    //开始解析
    if (index==-1){
        //不存在^的情况
        //console.log(str);
        return str;
    }
    else{
        power = str.slice(index+1);//按^的位置分开系数未知数的积 和指数
        let multi = str.search(/\*/);
        if (multi==-1){
            //没有*的情况
            //console.log('Math.pow(x,' + power + ')')
            return 'Math.pow(x,' + power + ')';
        }
        else{
            //将x前的部分作为系数
            return str.slice(0,str.search(/x/))  + 'Math.pow(x,' + power + ')';
        }
    }
}
  fstr=fstr.replace(/ /g,'');//删除空格
  let sfstr = fstr.replace(/\-/g,"+(-1)*").split("+");//将-号替换为+(-1)*然后按+分项
  
  let eqn = [];//存放单项
  for(let i=0;i<sfstr.length;i++){
      eqn.push(parseSingleFormula(sfstr[i]));//进行单项解析并将结果放入eqn
  }
  return eqn.join("+");
},

  calculate:function(){
    console.log(this.data.expressions,this.data.rs,this.data.mods);
    var that = this;

    let expressions = this.data.expressions;
    let rs = this.data.rs;
    let mods = this.data.mods;

    for(let i=0;i<expressions.length;i++){
      expressions[i] = this.parseFormula(expressions[i]);
    }


    that.setData({
      //answer:this.solveEqn(expressions,rs,mods)
      answer:utils.solveEqn(expressions,rs,mods)
    })


  }

})
