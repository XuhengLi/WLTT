const marked = require('marked')
const $ = global.$
const hljs = global.hljs
module.exports = {
  reload() {
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
    })
    const preview = $('#preview')
    const editorDom = $('#editor')
    const text = editorDom.val()
    // preview.html(marked(text))
    // console.log("preview marked text")
    // console.log(marked(text))
    // console.log("finish previewing")
    preview.html(marked(text))

  }
}