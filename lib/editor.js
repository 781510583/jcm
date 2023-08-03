// 富文本编辑器
// 创建编辑器函数，创建工具栏函数
const { createEditor, createToolbar } = window.wangEditor

const editorConfig = {
    placeholder: 'Type here...',
    //编辑器变化时的回调函数
    onChange(editor) {
      const html = editor.getHtml()
      document.querySelector(".publish-content").value = html
      // 也可以同步到 <textarea>
    }
}
//编辑区设置
const editor = createEditor({
    selector: '#editor-container',
    //位置
    html: '',
    //默认内容
    config: editorConfig,
    //编辑区defalut为全部内容,simple没有编辑区
    mode: 'default', // or 'simple'
})
//工具栏配置
const toolbarConfig = {}
//创建工具栏
const toolbar = createToolbar({
    editor,
    //位置
    selector: '#toolbar-container',
    config: toolbarConfig,
    //simple简洁模式,default全部功能
    mode: 'default', // or 'simple'
})
