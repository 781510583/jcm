/**
 * 目标1：获取文章列表并展示
 *  1.1 准备查询参数对象
 *  1.2 获取文章列表数据
 *  1.3 展示到指定的标签结构中
 */
var totalcount = 0
const listobj = {
    status: '',//文章状态1待审核 2审核通过
    channerl_id: '', //文章ID
    page: 1, //当前页码
    per_page: 3//每页显示条数
}
function list() {
    axios({
        url:'/v1_0/mp/articles',
        params:listobj
    }).then(result => {
        totalcount = result.data.total_count
        document.querySelector(".total-count").innerHTML = `共${totalcount}条`
        const ts = result.data.results.map(item => 
        `   <tr>
                <td>
                    <img src="${item.cover.type === 0 ?`../../img/default.jpg`:item.cover.images[0]}" alt="">
                </td>
                <td>${item.title}</td>
                <td>
                ${item.status === 1 ?`<span class="badge text-bg-primary">待审核</span>` : `<span class="badge text-bg-success">审核通过</span>`}
                    
                    
                </td>
                <td>
                    <span>${item.pubdate}</span>
                </td>
                <td>
                    <span>${item.read_count}</span>
                </td>
                <td>
                    <span>${item.comment_count}</span>
                </td>
                <td>
                    <span>${item.like_count}</span>
                </td>
                <td data-id="${item.id}">
                    <i class="bi bi-pencil-square edit"></i>
                    <i class="bi bi-trash3 del"></i>
                </td>
            </tr>
            `).join('')
            document.querySelector(".align-middle").innerHTML = ts
    })
}
list()
/**
 * 目标2：筛选文章列表
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
 */
document.querySelectorAll(".form-check-input").forEach(radio => {
    radio.addEventListener("change",e => {
        listobj.status = e.target.value
    })
})
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
document.querySelector(".form-select").addEventListener("change",e=> {
    listobj.channel_id = e.target.value
})
document.querySelector(".sel-btn").addEventListener("click",function() {
    list()
})
/**
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */
document.querySelector(".next").addEventListener("click",() => {
    if (listobj.page < Math.ceil(totalcount / listobj.per_page)) {
        listobj.page ++;
        list()
        document.querySelector(".page-now").innerHTML = `第${listobj.page}页`
    }
})
document.querySelector(".last").addEventListener("click",() => {
    if (listobj.page > 1) {
        listobj.page --;
        list()
        document.querySelector(".page-now").innerHTML = `第${listobj.page}页`
    }
})
// axios({
//     url:'/v1_0/mp/articles'
// }).then(result => {
//     const totalcount = result.data.results.length;
//     document.querySelector(".total-count").innerHTML = `共${totalcount}条`
// })
/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */
document.querySelector(".art-list").addEventListener("click",e => {
    if (e.target.classList.contains('del')) {
        const idd = e.target.parentNode.dataset.id
        axios({
            url:`/v1_0/mp/articles/${idd}`,
            method:'DELETE',
        }).then(result => {
            list()
            if ((totalcount - 1) % 3 == 0 && listobj.page == Math.ceil(totalcount / listobj.per_page)) {
                if (totalcount > listobj.per_page) {
                    listobj.page -= 1;
                    list()
                    document.querySelector(".page-now").innerHTML = `第${listobj.page}页`
                }
            } else {
            }
        })
    }
})
// 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去
document.querySelector(".art-list").addEventListener("click",async e=> {
    if (e.target.classList.contains("edit")) {
        const artid = e.target.parentNode.dataset.id;
        location.href = `../publish/index.html?id=${artid}`
    }
})
document.querySelector(".quit").addEventListener("click",e => {
    localStorage.removeItem("token")
    location.href = '../login/index.html';
})