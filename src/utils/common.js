import http from '@utils/http';
import { urls } from '@utils/api';
import { createHashHistory } from 'history'; // 是hash路由 history路由 自己根据需求来定
const history = createHashHistory();
import $ from 'jquery';
import store from '../store/index.js';
import { setUserInfo } from '@store/actions';
export default {
  /* 退出登录 */
  loginOut() {
    sessionStorage.removeItem('sToken');
    localStorage.removeItem('userInfo');
    store.dispatch(setUserInfo(null));
    history.push('/login');
  },

  // 处理文件名
  dealUrl(url) {
    let newUrl = decodeURI(url);
    let t = newUrl.split('?')[0].split('/');
    let n = t[t.length - 1].split('_');
    return n[n.length - 1];
  },

  // 图片上传
  handleUpload(files) {
    if (!files) return;
    // let type = files.type; // 文件的类型，判断是否是图片
    // let size = files.size; // 文件的大小，判断图片的大小
    let imgUrl = '';
    return new Promise((resolve, reject) => {
      // if ('image/jpeg, image/png, image/jpg'.indexOf(type) == -1) {
      //   app.$message.warning('请上传jpg、png、jpeg格式的音频');
      //   imgUrl = null;
      //   reject(imgUrl);
      // }
      // if (size > 5242880) {
      //   this.$message.warning('请选择5M以内的图片');
      //   imgUrl = null;
      //   reject(imgUrl);
      // }

      // let objectName = 'paper/' + new Date().getTime() + files.name;
      // let params = {
      //   objectName: objectName
      // };
      imgUrl = `paper/${new Date().getTime()}_` + files.name;
      // 获取签名
      http.get(urls.GETOSSSIGNATURE).then(res => {
        if (res) {
          var ossData = new FormData();
          ossData.append('OSSAccessKeyId', res.body.OSSAccessKeyId);
          ossData.append('policy', res.body.policy);
          ossData.append('Signature', res.body.Signature);
          ossData.append('key', imgUrl);
          ossData.append('file', files);
          $.ajax({
            url: res.body.action,
            type: 'POST',
            data: ossData,
            dataType: 'xml', // 这里加个对返回内容的类型指定
            processData: false, // 不需要进行序列化处理
            async: true, // 发送同步请求
            contentType: false, // 避免服务器不能正常解析文件
            filename: 'file',
            success: function(ret) {
              resolve(imgUrl);
            },
            error: function(xhr) {
              imgUrl = null;
              reject(imgUrl);
              console.log('错误提示： ' + xhr.status + ' ' + xhr.statusText);
            }
          });
        } else {
          imgUrl = null;
          reject(imgUrl);
        }
      });
    });
  }
};
