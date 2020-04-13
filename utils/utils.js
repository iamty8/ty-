//使用前需要在当前页面设置数据ifLegal
function solveEqn(expressions,rs,mods){
  //console.log(eqns)
  let pages = getCurrentPages();
  var that=pages[pages.length-1];
  let interpreter = require('../res/interpreter.js');

  //检查是否存在空方程
  for(var i=0;i<expressions.length;i++){
    if(expressions[i]==undefined||rs[i]==undefined||mods[i]==undefined||expressions[i]==""||rs[i]==""||mods[i]==""){
      return "请检查是否有空方程";
    }
  }
  //检查表达式是否合法
  //var ifLeagle = 1;
  for (var i=0;i<expressions.length;i++){
    interpreter.run("try{var x=0;" + expressions[i]+ ";}catch(e){console.log(\'err\',e);page.setData({ifLegal:0})};",{'page':that});
  }
  if(that.data.ifLegal==0){that.setData({ifLegal:1});return "不合法的表达式！"}
  
  
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
    //console.log(command_1+command_2);
    //let result;
    interpreter.run((command_1+command_2),{'wx':wx,'page':that});
    let result = that.data.temp;
    that.setData({
      temp:null
    })
    //console.log(that.data);
    return result;
  }
  
  //判断x是否为解
  function ifSolution_g(x){
      let a = 1;
      for(var i=0;i<expressions.length;i++){
        let t = calcu(expressions[i],x)% mods[i];
          a *= (t  == rs[i]%mods[i]||t == (rs[i]%mods[i])+parseInt(mods[i]));
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
  if(solve.length==0) return "无解！";//输出无解
  return (solve + "(mod" + lsm_n + ")");
}

module.exports={
  solveEqn:solveEqn
}