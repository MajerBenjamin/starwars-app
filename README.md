# starwars-app
application that lists starwars characters

# installation guide
after cloning the project in the terminal run: npm install

then start the application with: npm run android or npm run ios

after the start there will be differenet options 
- Expo Go: Just scan the give qr code with your phonbe to install the application
- Android: Connect an android phone and the application will start on it automaticly if you allowed debbuging on the phone
- IOS: Connect an IOS phone and the application will start on it automaticly if you allowed debbuging on the phone

Having problems with the scope of the task I prepared 3 solutions they all found in app folder:
- index.tsx -> sorting and pagination based on task and include an api calling all the lists of characters
- indexTanstack.tsx -> useing Tanstack query to cahes the paged list of characters
- indexPaged.tsx -> basic pagination where each time the user reaches the end of the list we get new set of list to show them 
