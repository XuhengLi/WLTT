const marked = require('marked')
const $ = global.$
const hljs = global.hljs
var markdownpdf = require("markdown-pdf")
var fs = require("fs")
var mkdirp = require('mkdirp')

module.exports = {
  init() {
    $('#upload').bind('click', () => {
        console.log("clicked")
        var id = $('#selected_note').val();
        if(id !== "-1")
        {
            marked.setOptions({
              gfm: true,
              tables: true,
              breaks: false,
              pedantic: false,
              sanitize: false,
              smartLists: true,
              smartypants: false,
            })
            // const preview = $('#preview')
            const editorDom = $('#editor')
            const text = editorDom.val()
            // preview.html(marked(text))

            // console.log(text)
            mkdirp('tmp', function(err) { 
                if(err) {
                    return console.log(err);
                }
                console.log("tmp folder created")
            });

            fs.writeFile("tmp/.tmp.md", text, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            }); 
         
            markdownpdf().from("tmp/.tmp.md").to("tmp/tmp.pdf", function () {
              console.log("Done")
            })

            fs.unlink('tmp/.tmp.md', (err) => {
              if (err) throw err;
              console.log('temp file was deleted');
            });
        }
        else
        {
            alert("Please select a note first, then click upload button.")
        }
    });  
  }
}
