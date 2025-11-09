// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import {
    type User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const register = async (
        email: string,
        password: string,
        displayName: string
    ) => {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Crear documento de usuario en Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email,
            displayName,
            createdAt: serverTimestamp(),
        });

        return userCredential;
    };

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        // Crear/actualizar documento de usuario
        await setDoc(
            doc(db, "users", result.user.uid),
            {
                email: result.user.email,
                displayName: result.user.displayName,
                createdAt: serverTimestamp(),
            },
            { merge: true }
        );

        return result;
    };

    const logout = () => signOut(auth);

    return { user, loading, register, login, loginWithGoogle, logout };
};
