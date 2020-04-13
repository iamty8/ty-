//app.js

var interpreter = require('./res/interpreter.js');
App({

  globalData: {
    
  },

  gotoHelp:function(section){
    wx.navigateTo({
      url: '../help/help?section=' + section,
    });
  }
})