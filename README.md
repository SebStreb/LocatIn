# LocatIn
Information System website using Node.js and MySQL.

Written by Sébastien Strebelle for the course LINGE1322 (Université Catholique de Louvain)

## Install
In order to use this website, you have to get `Node.js` and `MySQL`. Look their website (http:// ?) for installation instructions.

When Node.js and MySQL are installed, simply launch the installation process with `$ npm install`. You may have to modify the file `install.js` to add your root password for MySQL.

If you happen to get errors during the installation, you may contact me (mailto:sebastien.strebelle@student.uclouvain.be).

## Launch
When everything is installed properly, you may simply launch the server with `$ npm start`. Then you can access the website at http://localhost:3000.

## Directory
### package.json
This files sets the Node.js packages and the installation and launching scripts.
### install.js
This file sets the database up during the installation script.
### app.js
This file launches the server.
### auth.js
This file configures the connexion to the website
### database
This directory contains the table definitions and access methods of the database.
### routes
This directory contains the routing methods of the website.
### public
This directory contains the pages and stylsheets of the website.
