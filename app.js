const main = require('./js/main.js')
//const menu = require('./js/menu.js')
const dbservice = require('./js/db.js')
const db = new dbservice()

db.init()
main.init()

//menu.initMenu()