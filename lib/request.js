// axios 公共配置
// 基地址
axios.defaults.baseURL = 'http://geek.itheima.net'
//请求拦截器
axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token")
    token && (config.headers.Authorization = `Bearer ${token}`)
    return config;
},function(error) {
    return Promise.reject (error);
})
//响应拦截器 进入content界面,身份验证失败后,做出响应,跳转回登陆界面
axios.interceptors.response.use(function (response) {
    const result = response.data
    return result;
    return response;
},function(error) {
    console.dir(error);
    if (error?.response?.status === 401) {
        alert("身份验证过期")
        localStorage.clear();
        location.href = '../login/index.html'
    }
    return Promise.reject (error);
})