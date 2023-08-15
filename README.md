# bottletree

npx expo start
firebase emulators:start

curl -v -X DELETE "http://127.0.0.1:8080/emulator/v1/projects/firestore-emulator-example/databases/(default)/documents"

eas build -p ios --profile preview
eas build -p android --profile preview

eas build --platform ios && eas submit -p ios
eas submit -p ios

eas update --branch preview --message "Updating the app"
eas update --branch production --message "Updating the app"

npx expo start --offline
?

open "rndebugger://set-debugger-loc?host=localhost&port=19000"

---------- Firebase Functions ---------------

npm install firebase-functions@latest firebase-admin@latest --save
npm install -g firebase-tools

firebase emulators:start

firebase deploy --only functions

firebase deploy --only functions --project builder-403d5


http://127.0.0.1:5001/builder-403d5/us-central1/addmessage?text=uppercaseme


https://us-central1-builder-403d5.cloudfunctions.net/addmessage?text=uppercaseme
