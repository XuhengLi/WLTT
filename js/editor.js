const marked = require('marked')
const $ = global.$
const hljs = global.hljs
const h2p = require('html2plaintext')

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

    // update the old editor content
    var html = $('#editor_new').froalaEditor("html.get");
    editorDom.val(html);
    const text = h2p(html);

    preview.html(marked(text))

  }
}