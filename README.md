# mdNote
[![Build Status](https://travis-ci.com/XuhengLi/WLTT.svg?branch=master)](https://travis-ci.com/XuhengLi/WLTT)
Marddown note taking application created by WLTT for COMS4156 - Advanced Software Engineering.
#Setting up and Running

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
#Testing
We use Travis CI + Karma + Jasmine for CI and use git-hook and Karma + Jasmine for pre-commit test.
Test Scripts can be found in ./spec/DBServiceSpec.js and there is a copy of pre-commit hook named ./pre-commit.sh.
The pre-commit test log is saved as ./karma.log.
The Travis CI config file is ./.travis.yml and the Karma config file is ./my.conf.js.
``` bash
# Running the test
npm test 
```

Git guide: [Git guide for WLTT](https://github.com/XuhengLi/WLTT/wiki/Git-Guide-for-WLTT)
