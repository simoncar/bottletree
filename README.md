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

------ development build -------

eas build --profile development-simulator --platform ios
eas build --profile development --platform ios
eas build --profile aab --platform android

---------- Firebase Functions ---------------

npm install firebase-functions@latest firebase-admin@latest --save
npm install -g firebase-tools

firebase emulators:start

firebase deploy --only functions

firebase deploy --only functions --project builder-403d5

import { useNavigation } from 'expo-router';

...

const navigation = useNavigation()

...
console.log(JSON.stringify(navigation.getState()))

navigation.navigate("index", { screen: "index" })

npx expo install --fix

sudo lsof -i :5000
sudo kill -9 PID

To generate an .apk, modify the eas.json by adding one of the following properties in a build profile:
apiLog
developmentClient to true (default)
distribution to internal
android.buildType to apk
android.gradleCommand to :app:assembleRelease, :app:assembleDebug or any other gradle command that produces .apk

{
"build": {
"preview": {
"android": {
"buildType": "apk"
}
},
"preview2": {
"android": {
"gradleCommand": ":app:assembleRelease"
}
},
"preview3": {
"developmentClient": true
},
"preview4": {
"distribution": "internal"
},
"production": {}
}
}
