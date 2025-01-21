import React, { createContext, useEffect, useState } from "react";
import { getUser } from "@/lib/APIuser";
import { useSession } from "@/lib/ctx";
import { IUser } from "@/lib/types";

interface UserContextType {
  user: IUser | null;
  setUser: (newUser: IUser) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: (newUser: IUser) => {},
});

const UserProvider = (props: React.PropsWithChildren) => {
  const { session } = useSession();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    console.log("UserProvider (userContext) XXXX 111 : session", user, session);

    const fetchData = async () => {
      console.log("UserProvider (userContext) XXXX 222 : session", session);
      try {
        if (user?.uid) {
          const userData = await getUser(user?.uid);
          console.log("createContext: UserProviderUIDUID SET >>>", userData);
          setUser({ ...userData });
        } else {
          if (session) {
            const userData = await getUser(session);
            if (userData != null) {
              console.log("createContext: UserProvider4444 SET >>>", userData);

              setUser({ ...userData });
            } else {
              console.log("createContext: UserProvider5555 SET >>>", userData);
            }
          }
        }
        console.log("UserProvider (userContext) XXXX 333: session", session);
      } catch (error) {
        console.error(
          "XXXX error fetching user data in UserProvider",
          error,
          session,
        );
      }
    };

    fetchData();
  }, []);

  //   useEffect(() => {
  //     console.log("UserProvider (userContext) XXXX 111 : session", user, session);

  //     const fetchData = async () => {
  //       console.log("UserProvider (userContext) XXXX 222 : session", session);
  //       try {
  //         if (user?.uid) {
  //           const userData = await getUser(user?.uid);
  //           console.log("createContext: UserProviderUIDUID SET >>>", userData);
  //           setUser({ ...userData });
  //         } else {
  //           if (session) {
  //             const userData = await getUser(session);
  //             if (userData != null) {
  //               console.log("createContext: UserProvider4444 SET >>>", userData);

  //               setUser({ ...userData });
  //             } else {
  //               console.log("createContext: UserProvider5555 SET >>>", userData);
  //             }
  //           }
  //         }
  //         console.log("UserProvider (userContext) XXXX 333: session", session);
  //       } catch (error) {
  //         console.error(
  //           "XXXX error fetching user data in UserProvider",
  //           error,
  //           session,
  //         );
  //       }
  //     };

  //     fetchData();
  //   }, [session]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
