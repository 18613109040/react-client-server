export const staticHost = "";
export const php = "//weixin.gstzy.cn:8080"; //灰度期间使用的host
export const phpHost = "//wx.gstzy.cn";
export const rootPath = '/old/';
//运营管理后台
const _base = "//admin.gstzy.cn";
const _picHost = "//www.gstzy.cn";

let __host = {
  php: `${staticHost}/api/`,
  dr_img: `${_base}/data/upload/`,  //图片服务器
  picHost :`${_picHost}` // 图片服务器地址(运营后台)
};
switch (process.env.NODE_ENV) {
  case "stg":  //用于22服务器
    __host = Object.assign({}, __host, {
      cplus: `${staticHost}/apic/120.76.216.68/`,   // 后台预发布环境
      oldHost : `${staticHost}/api/chat-stg.gstzy.cn/`,        // 健康咨询 线上环境
      // mHost : `${staticHost}/api/admin-stg.gstzy.cn/`,  //运营管理后台
      mHost : `${staticHost}/api/admin-stg.gstzy.cn/`,  //运营管理后台
      feelbackHost : `${staticHost}/api/api-stg.gstzy.cn/`,//反馈
      cas:`${staticHost}/api/cas-stg.gstzy.cn/`,    //cas系统
      sHost : `${staticHost}/api/salary.gstzy.cn/`,   //医生业绩
      sRapHost : `${staticHost}/api/rap.gstzy.dev/`,   //医生业绩rap
    });
    break;
  case "dev":  //用于51服务器
    __host = Object.assign({}, __host, {
      cplus: `${staticHost}/apic/120.25.154.225/`,
      oldHost : `${staticHost}/api/chat-dev.gstzy.cn/`,
      // mHost : `${staticHost}/api/admin-stg.gstzy.cn/`,  //运营管理后台
      mHost : `${staticHost}/api/admin-dev.gstzy.cn/`,  //运营管理后台
      feelbackHost : `${staticHost}/api/api-stg.gstzy.cn/`,//反馈
      cas:`${staticHost}/api/cas-dev.gstzy.cn/`,    //cas系统
      sHost : `${staticHost}/api/salary.gstzy.cn/`,   //医生业绩
      sRapHost : `${staticHost}/api/rap.gstzy.dev/`,   //医生业绩rap
    });
    break;
  case "production":
  default:   // 生产环境
    __host = Object.assign({}, __host, {
      cplus: `${staticHost}/apic/cgi.gstzy.cn/`,
      oldHost : `${staticHost}/api/chat.gstzy.cn/`,
      mHost : `${staticHost}/api/admin.gstzy.cn/`,  //运营管理后台
      feelbackHost : `${staticHost}/api/api.gstzy.cn/`,//反馈
      cas:`${staticHost}/api/cas-dev.gstzy.cn/`,    //cas系统
       sHost : `${staticHost}/api/salary.gstzy.cn/`,   //医生业绩
      sRapHost : `${staticHost}/api/rap.gstzy.dev/`,   //医生业绩rap
    })

}

export const host = __host;
