# A Tic Tac Toe Game Built With Socket.io
A game built using Socket.io
## Why Socket.io
I decided to learn how real time application works, after finishing the project i could imagine more project ideas and new solutions.
## What was used to build this project?
- Express
- Javascript
- Socket.io
- CSS
- TailwindCSS
- HTML
- OOP Concepts
## Why TailwindCSS?
Before building this project, i wanted to build better interfaces, so i decided to put some hours on CSS, then i wanted to learn a CSS lib.
## OOP?
On project planning i had some questions, "how can i process each room data individually?" so i decided to use OOP concepts to create instances, understanding auth process on previous project helped a lot.
## Next steps
While building this project i could understand why tests are important, the time developing could be faster if i had planned some tests, also noticed some types bugs so once more TS would been very useful.
- Tests
- Apllying TS
- More OOP
- Nest.js
## What did i learn on this project
- More about OOP
- More about CSS
- Socket.io
- TailwindCSS
## How it works?
When on main page the socket is connected to the server, after clicking the create room button, the server generates a Game instance and appends it to the gameInstances array, the server also writes a html file named with the socket.id from the main menu and redirects the player 1 to that page, the player keeps waiting on waiting screen until another player joins using the roomID, the game is realtime based, so each user interacts with the server and the server responds both players.
