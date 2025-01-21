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
    console.log("userContext XXXX user  : ", user);
    console.log("userContext XXXX sess  : ", session);

    const fetchData = async () => {
      try {
        if (!session) return;

        const id = user?.uid || session;
        console.log("userContext XXXX id  : ", id);

        const userData = await getUser(id);

        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data inside createContext:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
