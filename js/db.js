String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

class dbservice {
    constructor(dbname='mydb', table_name='note') {
        this.db = openDatabase(dbname, '1.0', 'my first database', 2 * 1024 * 1024)
        this.table_name = table_name
    }

    init() {
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

        $('#new').bind('click', () => {
            this.new()
        })

        $('#save').bind('click', () => {
            this.save()
        })

        $('#delete').bind('click', () => {
            this.delete_notes(window.cur_noteid)
        })
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
            }, function(tx, error) {
            })
        })

        // both not editable
        $('#editor_new').froalaEditor('edit.on');
        $('#editor').prop('disabled', false)

        $('#title').prop('disabled', false)
        $('#delete').prop('disabled', false)
        $('#save').prop('disabled', false)

        // both content = ""
        $('#editor').val('')
        $('#editor_new').froalaEditor('html.set', "");

        $('#title').val('untitled')
        $('#preview').empty()
        var condition = 'id="' + uuid + '"'
        this.get_notes(condition, 'id,title', (res) => { this.update_note_list(res) })
    }

    save() {
        console.log('save');
        const editorDom = $('#editor')
        // const content = editorDom.val()

        // update the editor content from new editor
        const content = $('#editor_new').froalaEditor("html.get")
        editorDom.val(content)

        var title = $('#title').val()
        this.db.transaction((tx) => {
            var sql = 'update '+ this.table_name +
                      ' set title = \'' + title.replaceAll("'", "''") + '\', content = \''
                      + content.replaceAll("'", "''") + '\'' + ' where id="'
                      + window.cur_noteid + '"'
            console.log(sql);
            tx.executeSql(sql, [], function(tx, result) {
                console.log('update success');
            }, function(tx, error) {
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

                // editor not editable
                $('#editor').prop('disabled', true)
                $('#editor_new').froalaEditor('edit.off');

                // editor content. = ""
                $('#editor_new').froalaEditor('html.set', "");
                $('#editor').val('')

                $('#title').prop('disabled', true)
                $('#title').val('')
                $('#preview').empty()
                $('#delete').prop('disabled', true)
                $('#save').prop('disabled', true)
            }, function (tx, error) {
            })
        })
    }


    set_content(res) {
        if (res) {
            const editorDom = $('#editor')
            const titleDom = $('#title')
            const deleteBtnDom = $('#delete')
            const saveBtnDom = $('#save')
            const editor = require('./editor.js')

            // set content
            editorDom.val(res.content)
            $('#editor_new').froalaEditor('html.set', res.content);

            titleDom.val(res.title)
            editor.reload()

            // both editable
            editorDom.prop('disabled', false)
            $('#editor_new').froalaEditor('edit.on');
            
            titleDom.prop('disabled', false)
            deleteBtnDom.prop('disabled', false)
            saveBtnDom.prop('disabled', false)
        }
    }

    update_note_list(res) {
        var title = res.title
        var id = res.id
        var li = '<li class="note-entry" href="#" noteid="'+id+'">' + title + '</li>'
        $('#note-item-list').append(li)
        $('li[noteid="'+ id +'"]').bind('click', () => {
            $('#selected_note').val(id)
            $('#editor_new').froalaEditor('edit.on');
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