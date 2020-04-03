//index.js
//获取应用实例
const app = getApp()
//import interpreter from "../../res/interpreter.js";
var interpreter = require('../../res/interpreter.js');

Page({
  data: {
    array: [1],
    answer:'解将于此处显示',
    expressions:[],
    rs:[],
    mods:[],
    temp:null
  },
  //事件处理函数
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

  //getID:function(e){
  //  console.log(this.data.expressions);
  //},
  /**Eqn:function(expression,r,m){
    var that = this;
    this.Eqn.this.expression = expression;//以字符串传入解析后的方程表达式
    this.Eqn.this.r=r;//余数
    this.Eqn.this.mod=m;//模数
    this.calculateValue = function(x){
      return interpreter.run((expression),{'wx':wx,'page':this})
    };
    this.calculate = function(x){return interpreter.run((this.calculateValue(x)+ '%' + this.mod),{'wx':wx,'page':this});};//计算输入x时方程的同余值
    this.ifSolution = function(x){return this.calculate(x)==this.r%this.mod;};//判断x是否为方程的解
},**/

 solveEqn:function(expressions,rs,mods){
  //console.log(eqns)
  var that=this;
  
  let solve = [];


  //先求最大公约数
  function gcd(a,b){
      return (b==0)?a:gcd(b,a%b);
  }

  //再求最小公倍数
  function lsm(a,b){
      return a*b/gcd(a,b);
  }

  //模数两两求最小公倍数
  //以得到所有模数的最小公倍数
  var lsm_n = 1;
  for(var i=0;i<mods.length;i++){
      lsm_n = lsm(mods[i],lsm_n);
  }

  function calcu(expression,x){
    let command_1 = "(function() {var x=" + x + ";" + "var result= " + expression + ";" + "page.setData({temp:result});";
    let command_2 =  "return " + expression + ";})()";
    console.log(command_1+command_2);
    //let result;
    interpreter.run((command_1+command_2),{'wx':wx,'page':that});
    let result = that.data.temp;
    that.setData({
      temp:null
    })
    console.log(that.data);
    //console.log("result: " + result[0]);
    return result;
  }
  
  //判断x是否为解
  function ifSolution_g(x){
      let a = 1;
      for(var i=0;i<expressions.length;i++){
          a *= (calcu(expressions[i],x) % mods[i] == rs[i]%mods[i]);
          //a *= eqns[i].ifSolution(x);
      }
      return a;
  }

  //遍历所有的x
  for(var i=0;i<lsm_n;i++){
      if(ifSolution_g(i))
      {
          solve.push(i);
      }
  }
  return (solve + "(mod" + lsm_n + ")");
},

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
            //console.log(str.slice(0,str.search(/x/)+1) + '*' + 'Math.pow(x,' + power + ')');
            return str.slice(0,str.search(/x/)+1) + '*' + 'Math.pow(x,' + power + ')';
        }
    }
}
  fstr=fstr.replace(/ /g,'');//删除空格
  let sfstr = fstr.replace(/\-/g,"+(-1)*").split("+");//将-号替换为+(-1)*然后按+分项
  
  let eqn = [];//存放单项
  for(let i=0;i<sfstr.length;i++){
      eqn.push(parseSingleFormula(sfstr[i]));//进行单项解析并将结果放入eqn
  }
  //console.log(eqn.join("+"));
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

    console.log(this.solveEqn(expressions,rs,mods));
    console.log(this.data.temp);

    that.setData({
      answer:this.solveEqn(expressions,rs,mods)
    })


  }

})
