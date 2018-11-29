const main = require('./js/main.js')
//const menu = require('./js/menu.js')
const dbservice = require('./js/db.js')
const db = new dbservice()

const upload = require('./js/upload.js')

db.init()
main.init()
upload.init()

//menu.initMenu()