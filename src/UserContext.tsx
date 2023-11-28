import React, {createContext, useContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {db} from './util/firestore';

interface UserContextProps {
  uid: string | undefined;
  setUid: React.Dispatch<React.SetStateAction<string | undefined>>;
  isCertified: boolean;
  setIsCertified: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextProps>({
  uid: undefined,
  setUid: () => {},
  isCertified: false,
  setIsCertified: () => {},
});

export function UserProvider({children}: {children: React.ReactNode}) {
  const [uid, setUid] = useState<string | undefined>(undefined);
  const [isCertified, setIsCertified] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        setUid(user.uid);
        // 인증 여부 확인
        const userDoc = await db.collection('Users').doc(user.uid).get();
        const userData = userDoc.data();
        setIsCertified(userData?.is_certified);
      } else {
        setUid(undefined);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{uid, setUid, isCertified, setIsCertified}}>
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
