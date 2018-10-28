
const db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);


module.exports = {
    init() {
        db.transaction(function (tx) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS note2 (id, title, text)');
        });
    },

    save() {
        const editorDom = $('#editor')
        const text = editorDom.val()
        db.transaction(function (tx) {
            sql = 'INSERT note note2 (title, text) VALUES ("test", "' + text + '")'
            tx.executeSql(sql);
        });
    },

    get() {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM note', [], function (tx, results) {
            var len = results.rows.length, i;
            for (i = 0; i < len; i++) {
              alert(results.rows.item(i).text);
            }
          });
        });
    }
}