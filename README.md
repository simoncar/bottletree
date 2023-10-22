# bottletree

npx expo start
firebase emulators:start

curl -v -X DELETE "http://127.0.0.1:8080/emulator/v1/projects/firestore-emulator-example/databases/(default)/documents"

eas build -p ios --profile development
eas build -p android --profile preview

eas build --platform ios && eas submit -p ios
eas submit -p ios

eas update --branch preview --message "Updating the app"
eas update --branch production --message "Updating the app"

npx expo start --offline
npx expo start --dev-client

?

open "rndebugger://set-debugger-loc?host=localhost&port=19000"

------ development build -------

eas build --profile development-simulator --platform ios
eas build --profile development --platform ios

---------- Firebase Functions ---------------

npm install firebase-functions@latest firebase-admin@latest --save
npm install -g firebase-tools

firebase emulators:start

firebase deploy --only functions

firebase deploy --only functions --project builder-403d5

http://127.0.0.1:5001/builder-403d5/us-central1/addmessage?text=uppercaseme

https://us-central1-builder-403d5.cloudfunctions.net/addmessage?text=uppercaseme

node_modules/@sentry/cli/bin/sentry-cli releases \
 files <release name> \
 upload-sourcemaps \
 --dist <iOS Update ID> \
 --rewrite \
 dist/bundles/main.jsbundle dist/bundles/ios-<hash>.map

node_modules/@sentry/cli/bin/sentry-cli releases \
 files bottletree@1.0.58 \
 upload-sourcemaps \
 --dist 60 \
 --rewrite \
 dist/bundles/ios-6442b0d50efb13f3d9adfefa0a8c0d00.map --org simon-co --project bottletree

node_modules/@sentry/cli/bin/sentry-cli sourcemaps explain 27cdcfe548544edeabc0bc6ba334f282 --org simon-co --project bottletree

node_modules/@sentry/cli/bin/sentry-cli releases list --org simon-co --project bottletree

node_modules/@sentry/cli/bin/sentry-cli sourcemaps resolve \
 dist/bundles/ios-4a9209da3e36e6aa9f68a8214ba07361.map \
 -r bottletree@1.0.58 \
 --org simon-co --project bottletree -l 2295723
