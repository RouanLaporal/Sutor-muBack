var NodeMediaServer = require('node-media-server');
var config = {
    rtmp:{
      port: 1935,
      chunk_size: 6000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
  
    http:{
      port: 8000, 
      allow_origin: '*'
    }
};
var nms = new NodeMediaServer(config);


module.exports =nms;