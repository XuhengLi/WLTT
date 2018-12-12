module.exports = {
  init() {
    $(() => {
        // $('#editor').prop('disabled', true)
        $('#editor_new').froalaEditor('edit.off');
        $('#title').prop('disabled', true)
        $('#delete').prop('disabled', true)
        $('#save').prop('disabled', true)


        // remain the binding... no event will be triggered
        $('#editor').bind('input click', () => { // reload
            const editor = require('./editor.js')
            editor.reload()
        })

        // triggering on click event
        $('#editor_new').froalaEditor()
          .on('froalaEditor.contentChanged', function (e, editor) {
            var editor1 = require('./editor.js')
            editor1.reload()
          })

        const dbservice = require('./db.js')
        const db = new dbservice()
        db.get_notes(null, 'id,title', (res) => {db.update_note_list(res)})
    })
  }
}
