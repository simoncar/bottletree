# bottletree

///////////////////////////////////////////
npx expo install expo@latest --fix
npx sentry-expo-upload-sourcemaps dist

firebase emulators:start

eas build -p ios --profile development
eas build -p android --profile preview

eas build --platform ios && eas submit -p ios
eas submit -p ios

eas update --branch preview --message "Updating the app"
eas update --branch production --message "Updating the app"

npx expo start --offline
npx expo start --dev-client
npx expo start --host localhost -c

yarn test

------ development build -------

npx expo install expo@latest --fix

eas build --profile development-simulator --platform ios
eas build --profile development --platform ios
eas build --profile aab --platform android

---------- Firebase Functions ---------------

npm install firebase-functions@latest firebase-admin@latest --save
npm install -g firebase-tools

firebase deploy --only functions
firebase deploy --only functions --project builder-403d5p
firebase deploy --only firestore:rules

npx expo install --fix

sudo lsof -i :5000
sudo kill -9 PID

npx expo-doctor

#F9D96B

TODO:
Org Slug: simon-co
project name: bottletree
DSN: https://4cc712a1ef2d35c86d74ca35e9aa8bed@o4505363191955456.ingest.us.sentry.io/4506092928827392

npx sentry-expo-upload-sourcemaps dist

git log --pretty=format:"[%ad] %s" --date=short > commit_messages.txt

///////////////////////////////////////////
npx expo install expo@latest --fix
npx sentry-expo-upload-sourcemaps dist


 - May result in mixed architectures in rubygems (eg: ffi_c.bundle files may be x86_64 with an arm64 interpreter)
[INSTALL_PODS] [!] Run "env /usr/bin/arch -arm64 /bin/bash --login" then try again.
[INSTALL_PODS] [!] React-Core-prebuilt has added 1 script phase. Please inspect befor