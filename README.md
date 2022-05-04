# Image-Key
Install Nodejs ,Git,vs code
Install Python and must add python to environment variable. Prefer custom installation. 
Install Tensorflow or just use the following command on the command prompt
pip3 install --user --upgrade tensorflow

restart pc
Insall node-pre-gyp and node-gyp globally through npm,just use the following command on the command prompt npm i -g @mapbox/node-pre-gyp node-gyp
Install xampp
Restart your pc
Download code from github

Extract it at the directory you want (in case of file corruption, just use exact all and use the IMAGE-KEY -MAIN folder as the directory of this project)
Delete node_modules folder
Open the directory (image key main) by vs code
Open package.json
Delete both tfjs modules from the package.json

Run this following command at the terminal in vs code, this will install all these packages locally
npm i
Install back those two Tensorflow modules by this following commands 
npm i @tensorflow/tfjs-core 
npm i @tensorflow/tfjs-node
Set up the database, first change the configuration of the mysql database of xampp

Change the max_allowed_packet to a larger number, 128M will be enough for most of the case, but you can set it to any thing you want. This is about how large can the image be


Save the change and close the my.ini file



Press the start buttons for apache and MySQL, then click the Admin button for the MySQL
 
You will get to the phpMyAdmin where you manage your database, click the New button to create a new database

Create a database with a name of imagekeydb (Click Create to continue)


If you have the imagekeydb.sql, u can just import it through the phpmyadmin.
Create a table called keyimageandface (Click Go to continue)

Table with a integer field called ID, a long blob field called keyImage, and a long blob field called faceImage (Click Save button to complete)

Click the New button under imagekeydb to create a new table



Create another table named passwordtable with a integer field called ID, three text fields called Title, password, and URL.

After saving the table, the setup is done.
Open a terminal of vs code, and use the following command to start the project
npm start
It may show a few errors but none of them should affect the performance of my project.
Open a browser and go to localhost:3000
