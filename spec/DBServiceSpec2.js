describe('Another DBServiceSpec', () => {
    var dbservice = require('../js/db.js')
    beforeEach(function(done) {
        var body=document.getElementsByTagName("body")[0]
        while(body.hasChildNodes())
        {
            body.removeChild(body.firstChild);
        }
        db = new dbservice('testdb', 'testtable');
        db.init()
        var editor_dom = document.createElement("textarea")
        var title_dom = document.createElement("textarea")
        var list_dom = document.createElement("ul")
        editor_dom.id = 'editor'
        title_dom.id = 'title'
        list_dom.id = 'note-item-list'
        editor_dom.disabled = true
        title_dom.disabled = true
        body.appendChild(editor_dom)
        body.appendChild(title_dom)
        body.appendChild(list_dom)
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

    it('when click save, should update the note list', (done) =>  {
        db.new()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = Math.random().toString(36).substr(2)
        const title = title_dom.value = Math.random().toString(36).substr(2)
        db.save()
        
        db.db.transaction((tx) => {
            var li = document.getElementById('note-item-list').children[0]
            expect(li.textContent).toBe(title)
            done()
        })

    })

})
