class dbservice {
    constructor(dbname='mydb') {
        global.$ = require('jquery');
        var openDatabase = require('websql');
        this.db = openDatabase(dbname, '1.0', 'my first database', 2 * 1024 * 1024)
        this.table_name = 'note'
    }

    init() {
        console.log('init db')
        var table_name = this.table_name
        this.db.transaction(function (tx) {
            var sql = 'create table if not exists '+ table_name +
                      '(id varchar(36) not NULL,' +
                      'title varchar(255) default NULL,' +
                      'content text default NULL,' +
                      'createtime datetime not NULL default(datetime()),' +
                      'modifytime datetime not NULL default(datetime()),' +
                      'primary key (id))'
            console.log(sql)
            tx.executeSql(sql)
        });
        console.log(this.db)

        $('#new').bind('click', () => {
            this.new()
        });

        $('#save').bind('click', () => {
            this.save()
        });

        $('#delete').bind('click', () => {
            this.delete_notes(window.cur_noteid)
        });
    }

    new() {
        var table_name = this.table_name
        const uuidv1 = require('uuid/v1');
        var uuid = uuidv1()
        window.cur_noteid = uuid
        this.db.transaction(function (tx) {
            var sql = 'insert into '+ table_name +
                      '(id, title) values ("' + uuid + '", "untitled")'
            console.log(sql)
            tx.executeSql(sql, [], function(tx, result) {
                console.log(result.insertId);
            }, function(tx, error) {
                console.log(error);
            })
        })
        $('#editor').prop('disabled', false)
        $('#title').prop('disabled', false)
        $('#editor').val('')
        $('#title').val('untitled')
        $('#preview').empty()
        var condition = 'id="' + uuid + '"'
        this.get_notes(condition, 'id,title', (res) => { this.update_note_list(res) })
    }

    save() {
        console.log('save');
        const editorDom = $('#editor')
        const content = editorDom.val()
        console.log(this.db)
        var title = $('#title').val()
        this.db.transaction((tx) => {
            var sql = 'update '+ this.table_name +
                      ' set title = "' + title + '", content = "' + content + '"' +
                      'where id="' + window.cur_noteid + '"'
            console.log(sql);
            tx.executeSql(sql, [], function(tx, result) {
                console.log('update success');
            }, function(tx, error) {
                console.log(error);
            })
        });
        var condition = 'id="' + window.cur_noteid + '"'
        this.get_notes(condition, 'id,title', (res) => {
            $('li[noteid="'+ res.id +'"]').text(res.title)
        })
    }

    get_notes(condition, fields, fun) {
        console.log('get_notes')
        this.db.transaction((tx) => {
            var sql = 'select '+ fields +' from ' + this.table_name
            if (condition)
                sql += ' where ' + condition
            console.log(sql)
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length, i;
                for (i = 0; i < len; i++) {
                    fun(results.rows.item(i))
                }
            })
        })
    }

    delete_notes(noteid) {
        this.db.transaction((tx) => {
            var sql = 'delete from ' + this.table_name + ' where id = "' + noteid + '"'
            console.log(sql)
            tx.executeSql(sql, [], function (tx, results) {
                console.log(results)
                $('li[noteid="'+ window.cur_noteid +'"]').remove()
                $('#editor').prop('disabled', true)
                $('#editor').val('')
                $('#title').prop('disabled', true)
                $('#title').val('')
                $('#preview').empty()
            }, function (tx, error) {
                console.log(error)
            })
        })
    }


    set_content(res) {
        if (res) {
            const editorDom = $('#editor')
            const titleDom = $('#title')
            const editor = require('./editor.js')
            console.log(res)
            editorDom.val(res.content)
            titleDom.val(res.title)
            editor.reload()
            console.log(res.content);
            editorDom.prop('disabled', false)
            titleDom.prop('disabled', false)
        }
    }

    update_note_list(res) {
        var title = res.title
        var id = res.id
        var li = '<li class="note-entry" href="#" noteid="'+id+'">' + title + '</li>'
        console.log(li)
        $('#note-item-list').append(li)
        $('li[noteid="'+ id +'"]').bind('click', () => {
            this.save()
            var condition = 'id="'+ id +'"'
            var fields = 'content,title'
            this.get_notes(condition, fields, (res) => {
                console.log(res)
                this.set_content(res)
                window.cur_noteid = id
            })
        })
    }
}
module.exports = dbservice