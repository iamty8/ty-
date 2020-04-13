Page({
  data:{
    section:''
  },
  //接受参数
  onLoad:function(options){
    let section = options.section;
    this.setData({
      section:section
    })
  }
})