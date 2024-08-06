# bottletree

npx expo start
firebase emulators:start

eas build -p ios --profile development
eas build -p android --profile preview

eas build --platform ios && eas submit -p ios
eas submit -p ios

eas update --branch preview --message "Updating the app"
eas update --branch production --message "Updating the app"

npx expo start --offline
npx expo start --dev-client
yarn test

------ development build -------

eas build --profile development-simulator --platform ios
eas build --profile development --platform ios
eas build --profile aab --platform android

---------- Firebase Functions ---------------

npm install firebase-functions@latest firebase-admin@latest --save
npm install -g firebase-tools

firebase deploy --only functions
firebase deploy --only functions --project builder-403d5

npx expo install --fix

sudo lsof -i :5000
sudo kill -9 PID
