Page({
  data:{
    key:"",
    encrypted:"",
    decrypted:"",
    last:null
  },

  //事件处理函数
  keyIn:function(e){
    let that = this;
    
    that.setData({
      key:e.detail.value
    })//一定要先更新key的值
    let key = this.data.key;
    let encrypted = that.data.encrypted;
    let decrypted = that.data.decrypted;
    let last = that.data.last;
    //console.log(key=="")

    if(last=="d"){
      if((key==""||key==null||key==undefined)&&last!=null) 
      {
        that.setData({
          decrypted:"Key Required!"
        })
      }
      else{
        that.setData({
          decrypted:that.vigTrans(encrypted,key,"d")
        })
      }
    }
    if(last=="e"){
      if((key==""||key==null||key==undefined)&&last!=null) 
      {
        that.setData({
          encrypted:"Key Required!"
        })
      }
      else{
        that.setData({
          encrypted:that.vigTrans(decrypted,key,"e")
        })
      }
    }
    
    
  },

  enIn:function(e){
    let that=this;
    let key = that.data.key;
    let encrypted = e.detail.value;
    let decrypted = that.vigTrans(encrypted,key,"d");
    that.setData({
      encrypted:encrypted,
      decrypted:decrypted,
      last:"d"
    })
  },

  deIn:function(e){
    let that=this;
    let key = that.data.key;
    let decrypted = e.detail.value;
    let encrypted = that.vigTrans(decrypted,key,"e")
    that.setData({
      decrypted:decrypted,
      encrypted:encrypted,
      last:"e"
    })
  },

  //功能函数

  vigTrans:function(str,key,de){
    if (key==''||key==undefined) return "Key Required!";//空key检测
    if (str==''||str==undefined) return "Text Required!";//空操作文本检测
    if (de==undefined||!(de=="d"||de=="e")) return "Function Required!"//空功能参数检测
    //str = str.replace(/ /g,"");
    //key = key.replace(/ /g,"");
    str = str.toUpperCase();//小写转大写
    key = key.toUpperCase();
    let encrypted = [];//结果数组
    let charSet = [];//文本字母到同余类的映射
    let keySet = [];//密钥字母到同余类的映射

    //将字符转换为同余类
    for(let i=0;i<str.length;i++){
        charSet.push(str[i].charCodeAt()-65);
    }
    for(let i=0;i<key.length;i++){
        keySet.push(key[i].charCodeAt()-65);
    }

    let keyLength = key.length;//保存密钥长度避免重复运算
    let sym;//加密和解密的符号差
    let spaces = 0;//要跳过的文本中的空格数
    (de == "d") ?  (sym = -1):(sym=1);//判断加密解密
    for(let i=0;i<charSet.length;i++){
        if(charSet[i]==" ".charCodeAt()-65){
            spaces += 1;
            encrypted.push(" ");
            continue;
        }
        let temp = (sym*keySet[(i-spaces)%keyLength]+charSet[i])%26;//利用同模运算加密解密
        //console.log(temp)
        if (temp<0) temp+= 26;//将负数结果转为正数
        encrypted.push(String.fromCharCode(temp + 65))
    }
    return encrypted.join("");
  }
})