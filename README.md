# bottletree

npx expo start
firebase emulators:start

curl -v -X DELETE "http://127.0.0.1:8080/emulator/v1/projects/firestore-emulator-example/databases/(default)/documents"


eas build -p ios --profile preview
eas build -p android --profile preview

eas build --platform ios
eas submit -p ios