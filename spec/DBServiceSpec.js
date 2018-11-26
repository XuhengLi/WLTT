describe('DBServiceSpec', () => {
    var dbservice = require('../js/db.js')

    beforeEach(function(done) {
        db = new dbservice('testdb', 'testtable');
        db.init()
        var body=document.getElementsByTagName("body")[0]
        while(body.hasChildNodes())
        {
            body.removeChild(body.firstChild);
        }
        var editor_dom = document.createElement("textarea")
        var title_dom = document.createElement("textarea")
        var list_dom = document.createElement("ul")
        editor_dom.id = 'editor'
        title_dom.id = 'title'
        list_dom.id = 'note-item-list'
        editor_dom.disabled = true
        title_dom.disabled = true
        var element=document.getElementsByTagName("body")[0]
        element.appendChild(editor_dom)
        element.appendChild(title_dom)
        element.appendChild(list_dom)
        done()
    })

    afterEach(function(done) {
        db.db.transaction((tx) => {
            console.log('afterEach')
            var sql = 'drop table testtable'
            tx.executeSql(sql, [], function (tx, results) {
            })
            done()
        })
    })

    it('should create new note in the database', (done) => {
        db.new()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            console.log('should create new note in the database')
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i
                expect(len).toBe(1)
                done()
            })
        })
    })

    it('when create new note, editor should be unlocked', (done) => {
        db.new()
        expect(document.getElementById('editor').disabled).toBe(false)
        expect(document.getElementById('title').disabled).toBe(false)
        done()
    })

    // it('when click save, should save the note to db', (done) =>  {
    //     db.new()
    //     var editor_dom = document.getElementById('editor')
    //     var title_dom = document.getElementById('title')
    //     var content = editor_dom.value = Math.random().toString(36).substr(2)
    //     var title = title_dom.value = Math.random().toString(36).substr(2)
    //     db.save()
    //     db.db.transaction((tx) => {
    //         var sql = 'select * from ' + db.table_name
    //         tx.executeSql(sql, [], function (tx, results) {
    //             var len = results.rows.length, i;
    //             expect(len).toBe(1)
    //             expect(results.rows.item(0).title).toBe(title)
    //             expect(results.rows.item(0).content).toBe(content)
    //             done()
    //         })
    //     })
    // })

    // it('should delete the note with and update the list', () =>  {
    //     expect(true).toBe(true)
    // })

    // it('should parse the markdown data to html', () => {
    //     expect(true).toBe(true)
    // })
})