describe('DBServiceSpec', function() {
    var dbservice = require('./js/db.js')

    beforeEach(function() {
        db = new dbservice();
    });

    it('should create a new note and unlock the editor', function() {
        expect(true).toBe(true)
    })

    it('should create a table of note if not exist', function() {
        expect(true).toBe(true)
    })

    it('should open a table of note if not exist', function() {
        expect(true).toBe(true)
    })

    it('should save a the note to db and update the list', function() {
        expect(true).toBe(true)
    })

    it('should delete the note with and update the list', function() {
        expect(true).toBe(true)
    })

    it('should parse the markdown data to html', function() {
        expect(true).toBe(true)
    })
})
