const marked = require('marked')
const $ = global.$
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
    console.log(marked(text))
    preview.html(marked(text))
  }
}