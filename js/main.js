const editor = require('./editor.js')
module.exports = {
  init() {
    $(() => {
      $('#editor').bind('input click', () => { // reload
        editor.reload()
      });
      $('#save').bind('click', () => {
        alert('save');
        db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);
        const editorDom = $('#editor')
        const text = editorDom.val()
        db.transaction(function (tx) {
            sql = 'INSERT into note2 (id, title, text) VALUES (1, "test", "' + text + '")'
            alert(sql)
            tx.executeSql(sql);
        });
      });
      $('#get').bind('click', () => {
            alert('get');
            db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);
            db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM note2', [], function (tx, results) {
            var len = results.rows.length, i;
            for (i = 0; i < len; i++) {
                const editorDom = $('#editor')
                editorDom.val(results.rows.item(i).text)
                editor.reload()
                alert(results.rows.item(i).text);
            }
          });
        });
      });
    })
  }
}
