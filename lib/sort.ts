import * as Contacts from "expo-contacts";

export function sortContactsByName(data: Contacts.Contact[]) {
  data.sort((a, b) => {
    if (!a.firstName && b.firstName) {
      return 1;
    }
    if (a.firstName && !b.firstName) {
      return -1;
    }
    if (!a.firstName && !b.firstName) {
      if (!a.lastName && b.lastName) {
        return 1;
      }
      if (a.lastName && !b.lastName) {
        return -1;
      }
      if (!a.lastName && !b.lastName) {
        return 0;
      }
    }

    if (a.firstName > b.firstName) {
      return 1;
    }
    if (a.firstName < b.firstName) {
      return -1;
    }

    if (!a.lastName && b.lastName) {
      return 1;
    }
    if (a.lastName && !b.lastName) {
      return -1;
    }
    if (a.lastName > b.lastName) {
      return 1;
    }
    if (a.lastName < b.lastName) {
      return -1;
    }
    return 0;
  });
}
