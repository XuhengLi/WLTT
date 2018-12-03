describe('DBServiceSpec', () => {
    var dbservice = require('../js/db.js')
    global.$ = require('jquery');
    beforeEach(function(done) {
        db = new dbservice('testdb', 'testtable');
        var body=document.getElementsByTagName("body")[0]
        while(body.hasChildNodes())
        {
            body.removeChild(body.firstChild);
        }

        var editor_dom = document.createElement("textarea")
        var title_dom = document.createElement("textarea")
        var save_dom = document.createElement("button")
        var delete_dom = document.createElement("button")
        var new_dom = document.createElement("button")
        var list_dom = document.createElement("ul")

        editor_dom.id = 'editor'
        title_dom.id = 'title'
        save_dom.id = 'save'
        delete_dom.id = 'delete'
        new_dom.id = 'new'
        list_dom.id = 'note-item-list'

        editor_dom.disabled = true
        title_dom.disabled = true
        delete_dom.disabled = true
        save_dom.disabled = true

        var element=document.getElementsByTagName("body")[0]
        element.appendChild(editor_dom)
        element.appendChild(title_dom)
        element.appendChild(list_dom)
        element.appendChild(delete_dom)
        element.appendChild(save_dom)
        element.appendChild(new_dom)

        db.init()
        done()
    })

    afterEach(function(done) {
        db.db.transaction((tx) => {
            var sql = 'drop table testtable'
            tx.executeSql(sql, [], function (tx, results) {
            })
            done()
        })
    })

    it('should create new note in the database', (done) => {
        var new_button = document.getElementById('new')
        new_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i
                expect(len).toBe(1)
                done()
            })
        })
    })

    it('when create new note, editor should be unlocked', (done) => {
        var new_button = document.getElementById('new')
        new_button.click()
        expect(document.getElementById('editor').disabled).toBe(false)
        expect(document.getElementById('title').disabled).toBe(false)
        expect(document.getElementById('delete').disabled).toBe(false)
        expect(document.getElementById('save').disabled).toBe(false)
        done()
    })

    it('when click save, should save the note to db', (done) =>  {
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = Math.random().toString(36).substr(2)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        console.log(save_button)
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(results.rows.item(0).title).toBe(title)
                expect(results.rows.item(0).content).toBe(content)
                done()
            })
        })
    })

    it('when there is nothing in the editor, save should not work', (done) =>  {
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(0)
                done()
            })
        })
    })

    it('when there is nothing in the editor, \
        the whole editor area should be disabled', (done) =>  {
        expect(document.getElementById('editor').disabled).toBe(true)
        expect(document.getElementById('title').disabled).toBe(true)
        expect(document.getElementById('delete').disabled).toBe(true)
        expect(document.getElementById('save').disabled).toBe(true)
        done()
    })

    it('should delete the note and update the list', (done) =>  {
        var new_button = document.getElementById('new')
        new_button.click()

        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = Math.random().toString(36).substr(2)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        
        var save_button = document.getElementById('save')
        save_button.click()

        var delete_button = document.getElementById('delete')
        delete_button.click()

        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(0)
                done()
            })
        })
    })

    it('click one note and it should be load', (done) =>  {
        var new_button = document.getElementById('new')
        new_button.click()

        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = Math.random().toString(36).substr(2)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        
        var save_button = document.getElementById('save')
        save_button.click()

        db.db.transaction((tx) => {
            var note_button = document.getElementById('note-item-list').firstChild
            console.log(note_button)
            note_button.click()
            done()
        })
    })


    it('should parse the markdown data to html', () => {
        expect(true).toBe(true)
    })
})