import request, { extend } from 'umi-request';
import { message } from 'antd'
// import { getCookie } from './cookie'
import { history } from 'umi';

// 请求拦截器
request.interceptors.request.use((url, options) => {
    // 如果接口是登录放行
    if (url === '/user/login') {
        return {
            url: `${BASE_URL}${url}`,
            options: { ...options, interceptors: true },
        };
    } else {
        if (localStorage.getItem('orderPhoto') === '' || localStorage.getItem('orderPhoto') === null) {
            message.error("TOKEN 丢失，请重新登录");
            history.push('/user/login');
            // 平阻断请求 （暂时未写）
            return {
                url: `${BASE_URL}${url}`,
                options: { ...options, interceptors: true },
            };
        } else {
            // 请求头添加token
            return {
                url: `${BASE_URL}${url}`,
                options: {
                    ...options,
                    headers: {
                        orderPhoto: localStorage.getItem('orderPhoto'),
                    },
                    interceptors: true
                },
            };
        }

    }
});
// 响应拦截器
request.interceptors.response.use(async response => {

    const data = await response.clone().json();
    // console.log(data)
    if (data.code && data.code === 401) {
        message.error(data.msg);
        history.push('/user/login');
    }
    return response;
});
// request.extend({
//   prefix: 'http://localhost:9001',
//   timeout: 1000,
//   headers: {
//     token: localStorage.getItem('orderPhoto'),
//   },
// })
export default request;
// export const requests = extend({
//   prefix: 'http://localhost:9001',
//   timeout: 1000,
//   headers: {
//     // orderPhoto: getCookie('orderPhoto'),
//     orderPhoto: localStorage.getItem('orderPhoto'),
//   },
// });
