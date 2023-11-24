import React, {createContext, useContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';

// UserContext.tsx 수정
interface UserContextProps {
  uid: string | undefined;
  setUid: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const UserContext = createContext<UserContextProps>({
  uid: undefined,
  setUid: () => {},
});

export function UserProvider({children}: {children: React.ReactNode}) {
  const [uid, setUid] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(undefined);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{uid, setUid}}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserState() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('Cannot find UserProvider');
  }
  return context.uid;
}
