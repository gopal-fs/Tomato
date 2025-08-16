import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../configs/firebase";


export const authContext= createContext(null)

const AuthState=(({children})=>{
    const [user,setUser]=useState('')
    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,(currentUser)=>{
            setUser(currentUser)
        })

        return ()=>unsubscribe()

    },[])

    const signOutUser = () => {
        return auth.signOut().then(() => {
          setUser(null);
        });
      };
    return (
        <authContext.Provider value={{ user, signOut: signOutUser }}>
            {children}
        </authContext.Provider>
    )
})

export default AuthState