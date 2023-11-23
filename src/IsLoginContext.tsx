import React, {createContext, useContext, useState} from 'react';

interface IsLoginContextProps {
  uid: string | undefined;
  setUid: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const IsLoginContext = createContext<IsLoginContextProps>({
  uid: undefined,
  setUid: () => {},
});

export function IsLoginProvider({children}: {children: React.ReactNode}) {
  const [uid, setUid] = useState<string | undefined>(undefined);

  return (
    <IsLoginContext.Provider value={{uid, setUid}}>
      {children}
    </IsLoginContext.Provider>
  );
}

export function useIsLoginState() {
  const context = useContext(IsLoginContext);
  if (!context) {
    throw new Error('Cannot find IsLoginProvider');
  }
  return context.uid;
}
