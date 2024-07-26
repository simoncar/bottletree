import React, { createContext, useEffect, useState } from "react";
import { getUser } from "@/lib/APIuser";
import { useSession } from "@/lib/ctx";
import { IUser } from "@/lib/types";

// Define the shape of the context
interface UserContextType {
  user: IUser | null;
  setUser: (user: IUser) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => null,
});

const UserProvider = (props: React.PropsWithChildren) => {
  const { session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("UserProvider >> session:", session);

        const userData = await getUser(session);

        setUser({ ...userData });
      } catch (error) {
        console.error("error fetching user data in UserProvider", error);
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
