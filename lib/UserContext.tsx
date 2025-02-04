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
  const [isUserSet, setIsUserSet] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session || isUserSet) return;

        const id = user?.uid || session;

        const userData = await getUser(id);

        if (userData) {
          setUser(userData);
          setIsUserSet(true);
        }
      } catch (error) {
        console.error("Error fetching user data inside createContext:", error);
      }
    };

    fetchData();
  }, [[session, isUserSet]]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
