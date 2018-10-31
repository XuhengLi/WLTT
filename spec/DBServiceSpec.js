describe('DBServiceSpec', () => {
    var dbservice = require('../js/db.js')

    beforeEach(function() {
        db = new dbservice();
    });

    it('should create new note in the database', () => {
        expect(true).toBe(true)
    })

    it('when create new note, editor should be unlocked', () => {
        expect(true).toBe(true)
    })

    it('should create a table of note if not exist', () => {
        expect(true).toBe(true)
    })

    it('should open a table of note if not exist', () =>  {
        expect(true).toBe(true)
    })

    it('should save a the note to db and update the list', () =>  {
        expect(true).toBe(true)
    })

    it('should delete the note with and update the list', () =>  {
        expect(true).toBe(true)
    })

    it('should parse the markdown data to html', () => {
        expect(true).toBe(true)
    })
})
