const marked = require('marked')
const $ = global.$
const hljs = global.hljs
var markdownpdf = require("markdown-pdf")
var fs = require("fs")
var mkdirp = require('mkdirp')
const readline = require('readline');
const {google} = require('googleapis');
const h2p = require('html2plaintext')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  // console.log('Authorize this app by visiting this url:', authUrl);
  const popUpMsg = 'Authorize this app by visiting this url:' + authUrl;
  var code = prompt(popUpMsg, "Please fill in the url returned from the website.");
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    oAuth2Client.setCredentials(token);
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) console.error(err);
      console.log('Token stored to', TOKEN_PATH);
    });
    callback(oAuth2Client);
  });
}

function uploadFile(auth) {
  const drive = google.drive({version: 'v3', auth});
  var fileMetadata = {
    'name': 'note.pdf'
  };
  var media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream('tmp/tmp.pdf')
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('file uploaded to google drive');
    }
  });
}

function uploadToDrive() {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), uploadFile);
  });
}

module.exports = {
  init() {
    $('#upload').bind('click', () => {
        console.log("clicked")
        var id = $('#selected_note').val();
        if(id !== "-1") {
            marked.setOptions({
              gfm: true,
              tables: true,
              breaks: false,
              pedantic: false,
              sanitize: false,
              smartLists: true,
              smartypants: false,
            })
            // const preview = $('#preview')
            // const editorDom = $('#editor')
            // const text = editorDom.val()
            var html = $('#editor_new').froalaEditor("html.get");
            const text = h2p(html);
            // preview.html(marked(text))
            // console.log(text)
            mkdirp('tmp', function(err) { 
                if(err) {
                    return console.log(err);
                }
                console.log("tmp folder created")
            });
            fs.writeFile("tmp/.tmp.md", text, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
            markdownpdf().from("tmp/.tmp.md").to("tmp/tmp.pdf", function () {
              uploadToDrive();
              console.log("Done")
            })
            fs.unlink('tmp/.tmp.md', (err) => {
              if (err) throw err;
              console.log('temp file was deleted');
            });

        }
        else {
            alert("Please select a note first, then click upload button.")
        }
    });  
  }
}
