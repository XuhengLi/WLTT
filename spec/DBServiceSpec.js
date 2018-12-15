describe('DBServiceSpec', () => {
    var dbservice = require('../js/db.js')
    global.$ = require('jquery');

    require('../node_modules/froala-editor/js/froala_editor.min.js')($);
    const h2p = require('html2plaintext')
    beforeEach(function(done) {
        db = new dbservice('testdb', 'testtable');
        var body=document.getElementsByTagName("body")[0]
        while(body.hasChildNodes())
        {
            body.removeChild(body.firstChild);
        }

        var editor_dom = document.createElement("textarea")
        var new_editor_dom = document.createElement("textarea")
        var title_dom = document.createElement("textarea")
        var save_dom = document.createElement("button")
        var delete_dom = document.createElement("button")
        var new_dom = document.createElement("button")
        var list_dom = document.createElement("ul")

        editor_dom.id = 'editor'
        new_editor_dom.id = 'editor_new'
        new_editor_dom.className = 'scrollabletextbox md-textarea form-control'
        new_editor_dom.name = 'note'
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
        element.appendChild(new_editor_dom)
        element.appendChild(title_dom)
        element.appendChild(list_dom)
        element.appendChild(delete_dom)
        element.appendChild(save_dom)
        element.appendChild(new_dom)
        $('#editor_new').froalaEditor({
        heightMax: 600,
        toolbarButtons: ['fontFamily', '|', 'fontSize', '|', 'paragraphFormat', '|', 'bold', 'italic', 'underline', 'undo', 'redo', 'codeView'],
        fontFamilySelection: true,
        fontSizeSelection: true,
        paragraphFormatSelection: true,
        })

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

    // Test 1
    // Equivalent Partition 1
    // Test Case Set 1.1.1
    it('when click save, should save the note to db \
       (The note content editor is empty)', (done) => {
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(results.rows.item(0).title).toBe(title)
                expect(h2p(results.rows.item(0).content)).toBe('')
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       (The note content editor has 1 lower character(i.e character ’a’))',
       (done) => {
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'a'
        $('#editor_new').froalaEditor('html.set', content);
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(results.rows.item(0).title).toBe('untitled')
                expect(h2p(results.rows.item(0).content)).toBe(content)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       (The note content editor has 1 upper character(i.e character ’A’))',
       (done) => {
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'A'
        $('#editor_new').froalaEditor('html.set', content);
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(results.rows.item(0).title).toBe('untitled')
                expect(h2p(results.rows.item(0).content)).toBe(content)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The note content editor has 1 symbol(i.e comma)',
       (done) => {
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = ','
        $('#editor_new').froalaEditor('html.set', content);
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(results.rows.item(0).title).toBe('untitled')
                expect(h2p(results.rows.item(0).content)).toBe(content)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       (The note content editor has 9,999 characters)',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        editor_dom.maxLength = 35
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = Math.random().toString(34).substr(2)
        $('#editor_new').froalaEditor('html.set', content);
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       (The note content editor has 10,000 characters)',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        editor_dom.maxLength = 35
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = Math.random().toString(35).substr(2)
        $('#editor_new').froalaEditor('html.set', content);
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       (The note content editor has 10,001 characters)',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        editor_dom.maxLength = 35
        $('#editor_new').froalaEditor({charCounterMax: 35})
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = Math.random().toString(36).substr(2)
        $('#editor_new').froalaEditor('html.set', content);
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content.substring(0, 35))
                done()
            })
        })
    })

    // Test Case Set 1.1.2
    it('when click save, should save the note to db \
       (The title editor is empty)', (done) => {
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var content = editor_dom.value = Math.random().toString(36).substr(2)
        $('#editor_new').froalaEditor('html.set', content)
        var title_dom = document.getElementById('title')
        var title = title_dom.value = ''
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe('')
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       (The title editor has 1 lower character(i.e character ’a’))', (done) => {
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = Math.random().toString(36).substr(2)
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = 'a'
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       (The title editor has 1 upper character(i.e character ’A’))', (done) => {
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = Math.random().toString(36).substr(2)
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = 'A'
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The title editor has 1 symbol(i.e comma)', (done) => {
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = Math.random().toString(36).substr(2)
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = ','
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The title editor has 99 characters',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        title_dom.maxLength = 35
        var content = editor_dom.value = 'A'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(34).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The title editor has 100 characters',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        title_dom.maxLength = 35
        var content = editor_dom.value = 'A'
        var title = title_dom.value = Math.random().toString(35).substr(2)
        $('#editor_new').froalaEditor('html.set', content)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The title editor has 101 characters',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        title_dom.maxLength = 35
        var content = editor_dom.value = 'A'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(results.rows.item(0).title).toBe(title.substring(0, 35))
                expect(h2p(results.rows.item(0).content)).toBe(content)
                done()
            })
        })
    })

    // Test Case Set 1.1.3
    // We found this set of tests is meaningless, so we delete these tests.

    // Equivalence Partition 2
    // Test Set 1.2.1
    it('when click save, should save the note to db \
       The quote sign is at the beginning of the test \
       All of the quote quote signs are in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = '"A"'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The single quote  sign is at the beginning of the test \
       All of the single quote signs are in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = '\'A\''
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The back quote  sign is at the beginning of the test \
       All of the bacck quote signs are in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = '`A`'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The quote sign is at the beginning of the test \
       All of the quote quote signs are not in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = '"A'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The single quote  sign is at the beginning of the test \
       All of the single quote signs are not in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = '\'A\''
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The back quote  sign is at the beginning of the test \
       All of the bacck quote signs are not in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = '`A`'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The quote sign is at the middle of the test \
       All of the quote quote signs are in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'a"A"b'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The single quote  sign is at the middle of the test \
       All of the single quote signs are in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'a\'A\'b'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The back quote  sign is at the middle of the test \
       All of the bacck quote signs are in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'a`A`b'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The quote sign is at the middle of the test \
       All of the quote quote signs are not in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'a"A'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(results.rows.item(0).title).toBe(title)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The single quote  sign is at the beginning of the test \
       All of the single quote signs are not in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'a\'A'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The back quote  sign is at the beginning of the test \
       All of the bacck quote signs are not in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'a`A'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })


    it('when click save, should save the note to db \
       The quote sign is at the end of the test \
       All of the quote quote signs are in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'a"A"'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The single quote  sign is at the end of the test \
       All of the single quote signs are in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'a\'A\''
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The back quote  sign is at the end of the test \
       All of the bacck quote signs are in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'a`A`'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The quote sign is at the end of the test \
       All of the quote quote signs are not in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'A"'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The single quote  sign is at the end of the test \
       All of the single quote signs are not in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'A\''
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       The back quote  sign is at the end of the test \
       All of the bacck quote signs are not in pairs.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'A`'
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    it('when click save, should save the note to db \
       There is a complete and valid SQL statement in the note content.',
       (done) => {
        // For test purpose, we temporarliy set editor's max length to be 35
        var new_button = document.getElementById('new')
        new_button.click()
        var editor_dom = document.getElementById('editor')
        var title_dom = document.getElementById('title')
        var content = editor_dom.value = 'Select * from ' + db.table_name + 
                                         ';' + 'Select * from ' + db.table_name
        $('#editor_new').froalaEditor('html.set', content)
        var title = title_dom.value = Math.random().toString(36).substr(2)
        var save_button = document.getElementById('save')
        save_button.click()
        db.db.transaction((tx) => {
            var sql = 'select * from ' + db.table_name
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                expect(len).toBe(1)
                expect(h2p(results.rows.item(0).content)).toBe(content)
                expect(results.rows.item(0).title).toBe(title)
                done()
            })
        })
    })

    // Equivalence Partition 3
    // Test Set 1.3.1
    // Some of the test cases in the document have already been coverd by some
    // of the previous test and some miscellaneous test caes
    it('should delete the note and update the list', (done) => {
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

    // Test Set 1.3.2
    it('should delete the note and update the list \
       (When the title is empty, delete the note.)', (done) => {
        var new_button = document.getElementById('new')
        new_button.click()

        var editor_dom = document.getElementById('editor')
        var content = editor_dom.value = Math.random().toString(36).substr(2)
        
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

    it('when there is nothing in the editor, save should not work', (done) => {
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
        the whole editor area should be disabled', (done) => {
        expect(document.getElementById('editor').disabled).toBe(true)
        expect(document.getElementById('title').disabled).toBe(true)
        expect(document.getElementById('delete').disabled).toBe(true)
        expect(document.getElementById('save').disabled).toBe(true)
        done()
    })

    it('click one note and it should be load', (done) => {
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


    // it('should parse the markdown data to html', () => {
    //     expect(true).toBe(true)
    // })
})