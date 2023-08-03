/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */
function channel() {
    axios({
        url:'/v1_0/channels'
    }).then(result => {
        const select = result.data.channels.map(item => 
            `<option value="${item.id}">${item.name}</option>`
        ).join('')
        document.querySelector(".form-select").innerHTML = `<option value="" selected>请选择文章频道</option>` + select
    })
} 
channel()
/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */
document.querySelector(".img-file").addEventListener("change", async e=> {
    const file = e.target.files[0]
    const fd = new FormData();
    fd.append('image', file)
    const res = await axios({
        url:'/v1_0/upload',
        method:'POST',
        data : fd
    })
    const img = res.data.url
    document.querySelector(".rounded").src = img;
    document.querySelector(".rounded").classList.add('show')
    document.querySelector(".place").classList.add('hide')
})
document.querySelector(".rounded").addEventListener("click", ()=> {
    document.querySelector(".img-file").click()
})
/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */
document.querySelector(".btn").addEventListener("click", async e => {
    if (e.target.innerHTML !=='发布') return
    const form = document.querySelector(".art-form")
    const fd = serialize(form,{hash:true, empty:true})
    delete fd.id
    fd.cover ={
        type:1,
        images: [document.querySelector(".rounded").src]
    }
    document.querySelector(".rounded").src = ''
    document.querySelector(".rounded").classList.remove('show')
    document.querySelector(".place").classList.remove('hide')
    editor.setHtml('')
    //富文本编辑器自带的清空属性
    try {
        const res = await axios({
            url:'/v1_0/mp/articles',
            method:'POST',
            data: fd
        })
        myAlert(true,'发布成功');
        form.reset()
        setTimeout( () => {
          location.href = "../content/index.html"
        },1500)
    } catch (error) {
        myAlert(false,error.response.data.message)
    }
})
/**
 * 目标4：编辑-回显文章
 *  4.1 页面跳转传参（URL 查询参数方式）
 *  4.2 发布文章页面接收参数判断（共用同一套表单）
 *  4.3 修改标题和按钮文字
 *  4.4 获取文章详情数据并回显表单
 */
;(function(){
    const paramsStr = location.search;
    const params = new URLSearchParams(paramsStr);
    params.forEach(async (value, key) => {
        if (key === 'id') {
            document.querySelector('.title span').innerHTML = '修改文章';
            const sp = document.querySelector('.title span');
            console.log(sp);
            document.querySelector(".send").innerHTML = '修改'
            const res = await axios({
                url:`/v1_0/mp/articles/${value}`
            })
            console.log(res);
            const dataobj = {
                channel_id: res.data.channel_id,
                title: res.data.title,
                rounded :res.data.cover.images[0],
                content:res.data.content,
                id:res.data.id
            }
            Object.keys(dataobj).forEach(key => {
                if (key === 'rounded') {
                    if (dataobj[key]) {
                        //此时有设置的封面
                        document.querySelector(".rounded").src = dataobj[key];
                        document.querySelector(".rounded").classList.add('show') ;
                        document.querySelector(".place").classList.add("hide") 
                    }
                } else if (key === 'content'){
                editor.setHtml(dataobj[key])
                } 
                // else {
                // document.querySelector(`[name=${key}]`).value = dataobj[key]
                // }
                else if (key === 'title'){
                    document.querySelector('.form-control').value = dataobj[key]
                } else if (key === 'channel_id'){
                    document.querySelector('.form-select').value = dataobj[key]
                }  else if (key === 'id') {
                    document.querySelector(".ipt1").value = dataobj[key]
                }
            })
        }
    })
})()
/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */
document.querySelector(".send").addEventListener("click",async e => {
    if (e.target.innerHTML !== '修改') return
    const form =document.querySelector(".art-form");
    const data = serialize(form,{hash:true,empty:true});
    try {
        const res = await axios({
            url:`/v1_0/mp/articles/${data.id}`,
            method:'PUT',
            data:{
                ...data,
                cover:{
                    type: document.querySelector(".rounded").src ? 1 : 0,
                    images : [document.querySelector(".rounded").src]
                }
            }
        })
        console.log(res);
        myAlert(true,'修改成功');
        setTimeout( () => {
          location.href = "../content/index.html"
        },1500)
    } catch(error) {
        console.log(error);
        myAlert(false,error.response.data.message)
    }

})
document.querySelector(".quit").addEventListener("click",e => {
    localStorage.removeItem("token")
    location.href = '../login/index.html';
})