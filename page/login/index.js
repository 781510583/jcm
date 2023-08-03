// 目标1：验证码登录
// 1 在 utils/request.js 配置 axios 请求基地址
// 2 收集手机号和验证码数据
// 3 基于 axios 调用验证码登录接口
// 4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
document.querySelector(".btn").addEventListener("click", function() {
  const form = document.querySelector(".login-form")
  const data = serialize(form, { hash: true, empty:true})
  axios({
    url: '/v1_0/authorizations',
    method:'POST',
    data
  }).then(result => {
    document.querySelector;
    myAlert(true,'登陆成功');
    setTimeout( () => {
      location.href = "../content/index.html"
    },1500)
    localStorage.setItem("token",result.data.token)
    // const tel = document.querySelector(".account").value;
    // console.log(tel);
    // localStorage.setItem("tele",tel)
  }).catch(error => {
    console.log(error.response.message);
    myAlert(false,error.response.data.message)
  })
})
