# mdNote
[![Build Status](https://travis-ci.com/XuhengLi/WLTT.svg?branch=master)](https://travis-ci.com/XuhengLi/WLTT)
Marddown note taking application created by WLTT for COMS4156 - Advanced Software Engineering.
# Setting up and Running

We are going to need to install npm as a dependency manager for our application.
To install npm on Mac, make sure Homebrew is installed (or any other preferred package manager) and run brew install npm.
Go to the directory you want to download the app to and then run:
```
git clone https://github.com/XuhengLi/WLTT.git
```
Then enter repository root by
``` bash
cd WLTT
```
### Install and update dependencies
``` bash
npm install 
```
### Running the app
``` bash
cd /path/to/your/app
/path/to/nw .
```
# Testing
We use Travis CI + Karma + Jasmine for CI and use git-hook and Karma + Jasmine for pre-commit test.
Test Scripts can be found in ./spec/DBServiceSpec.js and there is a copy of pre-commit hook named ./pre-commit.sh.
The pre-commit test log is saved as ./karma.log.
The Travis CI config file is ./.travis.yml and the Karma config file is ./my.conf.js.
``` bash
# Running the test
npm test 
```
# Operating
The UI of our app is shown below.
![alt text](/imgs/overall.png)
### Create a new note
Click on the Create button on the left side of the app to create a new note.
### Save a modifed note
Click the Save button on the left corner of the editing field to save the note. The previous saved notes will be displayed in the "All Available Notes" section as shown in the picture.
### Delete an existing note
Select a previously saved note by clicking a note in the "All Available Notes" section. Then click the Delete button on the right corner of the editing field.
### Preview the note in real time and add markdown information to notes
Select a previously saved note by clicking a note in the "All Available Notes" section or create a new note. ![alt text](/imgs/preview.gif) As shown in the graph, the input text with markdown information will be displayed in the right side.
### Adjust the size of sections in the application
![alt text](/imgs/resize.gif) As shown in the picture, users can drag the boundary of the text box to adjust the size of each section in the app.
### Add gramma by clicking buttons
![alt text](/imgs/addGramma.png) As shown in the picture, users can click on the buttons in above the editor to adjust gramma.
### Synchronize Views
![alt text](/imgs/syncView.gif) As shown in the picture, as users scroll on one text box, the other one will scroll to synchronize the view.
### Upload to Google Drive
![alt text](/imgs/upload1.png) As shown in the picture, select an existing note from "All Available Notes" section and click Upload.
A window will give the user a link to authenticate the Google account. Copy the given link following the instruction to a browser and authenticate the account as shown in the following picture.![alt text](/imgs/upload2.png)
Google will return a code as below.![alt text](/imgs/upload3.png)
Copy the codes back to the app and click OK button.![alt text](/imgs/upload4.png)
This will upload a pdf version of the selected note to Google Drive.

Git guide: [Git guide for WLTT](https://github.com/XuhengLi/WLTT/wiki/Git-Guide-for-WLTT)
