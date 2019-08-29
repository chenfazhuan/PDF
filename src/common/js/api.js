import axios from 'axios';
import qs from 'qs';

const api = axios.create({
  timeout: 20000, // 超时时间
  responseType: 'json', // default
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  // 通过Qs.stringify转换为表单查询参数
  transformRequest: [(data) => {
    data = qs.stringify(data);
    return data;
  }],
  validateStatus: status => status === 200,
});

export default api;
