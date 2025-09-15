# GitHub Copilot Instructions

This document provides essential guidance for AI coding agents to effectively contribute to the BottleTree codebase.

## Architecture Overview

This is a React Native application built with Expo, using Expo Router for file-based navigation. The backend is powered by Firebase, including Firestore, Firebase Storage, and Firebase Authentication.

- **Routing**: Handled by Expo Router. The file system in `app/` defines the routes. The main layouts are `app/_layout.tsx` (root) and `app/(app)/_layout.tsx` (main app stack).
- **Data Layer**: All interactions with Firebase are centralized in the `lib/API*.ts` files (e.g., `lib/APIpost.ts`, `lib/APIproject.ts`). This separation of concerns is critical.
- **State Management**: Global state is managed via React Context. Key providers include:
  - `SessionProvider` (`lib/ctx.tsx`): Manages user authentication sessions.
  - `UserProvider` (`lib/UserContext.tsx`): Provides global user data.
  - `ProjectProvider` (`lib/projectProvider.tsx`): Provides context for the currently selected project.
- **UI Components**: Reusable components are located in `components/`. The project uses `@expo/vector-icons` and a custom color scheme defined in `constants/Colors.ts` that supports light and dark modes.
- **Types**: Core TypeScript types are defined in `lib/types.ts`.

## Key Workflows & Commands

- **Running the app**: `npx expo start`
- **Running Firebase Emulators**: A VS Code task `Run Firebase Emulator` is available, which executes `firebase emulators:start`. The app is configured to connect to the emulators during development (see `lib/firebase.ts`).
- **Testing**: Tests are located in `__tests__/` and use Jest with React Native Testing Library.

## Firebase Usage Conventions

**IMPORTANT**: This codebase is migrating to the **modular Firebase API**. All new or modified Firebase code **must** use the modular syntax. Do not use the legacy, namespaced/chained syntax.

- **Initialization**: The modular Firebase instance `dbm` is initialized and exported from `lib/firebase.ts`. Import it for use in the API layer.
- **Modular Syntax Example**:

  ```typescript
  // Correct (Modular)
  import { dbm, doc, getDoc } from "@/lib/firebase";

  const docRef = doc(dbm, "projects", projectId);
  const docSnap = await getDoc(docRef);
  ```

  Never use inline imports, always define imports at the top of the file.

- **API Layer**: All Firestore, Storage, and Auth calls should be encapsulated within functions in the `lib/API*.ts` files. Do not perform direct Firebase calls from UI components. This keeps the data logic clean and reusable.
- **Firestore Queries**: When performing `in` queries, be mindful of the 30-element limit per query. The codebase already contains a chunking pattern for this in `lib/APIproject.ts` which should be reused if necessary.

## Code Conventions

- **Theming**: The app supports light and dark modes. Colors are defined in `constants/Colors.ts` and applied via a `ThemeProvider` in `app/(app)/_layout.tsx`. Use theme colors from the `useTheme` hook in components where possible.
- **Types**: Use the types defined in `lib/types.ts` (e.g., `IProject`, `IPost`, `IUser`).
- **State Access**: When a component needs user or project data, use the provided context hooks (`useSession`, `useContext(UserContext)`, `useContext(ProjectContext)`).
