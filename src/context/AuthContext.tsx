"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    GoogleAuthProvider,
    signInWithPopup,
    User,
    onAuthStateChanged,
    onIdTokenChanged,
} from "firebase/auth";
import { auth, firestore } from "@/utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { clearUserCookies, saveUserCookies } from "@/utils/authUtils";

interface AuthContextType {
    userName: string | null;
    photoURL: string | null;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    loading: boolean;
    errorMessage: string | null;
    user: User | null;
}

const AuthContext = createContext<AuthContextType>({
    userName: null,
    photoURL: null,
    signInWithGoogle: async () => {},
    signOut: async () => {},
    loading: false,
    errorMessage: null,
    user: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userName, setUserName] = useState<string | null>(null);
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
            setLoading(true);
            if (authUser) {
                setUser(authUser);
                setUserName(authUser.displayName);
                setPhotoURL(authUser.photoURL);
                saveUserCookies(authUser);

                const userRef = doc(firestore, "users", authUser.uid);
                await setDoc(
                    userRef,
                    {
                        userName: authUser.displayName,
                        image: authUser.photoURL,
                        lastSignIn: new Date(),
                    },
                    { merge: true }
                );
                if (pathname === "/sign-in") {
                    router.push(redirect);
                }
                console.log(
                    "User signed in (onAuthStateChanged) and cookies set/updated."
                );
            } else {
                setUser(null);
                setUserName(null);
                setPhotoURL(null);
                clearUserCookies();
                console.log(
                    "User signed out (onAuthStateChanged) and cookies cleared."
                );
            }
            setLoading(false);
        });
        const unsubscribeToken = onIdTokenChanged(auth, async (authUser) => {
            if (authUser) {
                saveUserCookies(authUser); // Update token in cookie on silent refresh
                console.log("Token refreshed and cookies updated.");
            } else {
                clearUserCookies();
                console.log(
                    "Token listener cleared cookies (user signed out)."
                );
            }
        });
        return () => {
            unsubscribeAuth();
            unsubscribeToken();
        }; // Cleanup the listener
    }, [router, pathname, redirect]);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            setErrorMessage(null);
            setLoading(true);
            await signInWithPopup(auth, provider);
            // The onAuthStateChanged listener will handle the user and cookie setting
            console.log("Sign-in popup successful.");
        } catch (error) {
            console.error("Error signing in with Google:", error);
            let message = "An unexpected error occurred during Google sign-in.";
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case "auth/popup-closed-by-user":
                        message = "The sign-in popup was closed by the user.";
                        break;
                    case "auth/cancelled-popup-request":
                        message = "The sign-in popup request was cancelled.";
                        break;
                    case "auth/network-request-failed":
                        message =
                            "A network error occurred. Please check your internet connection.";
                        break;
                    case "auth/unauthorized-domain":
                        message =
                            "This domain is not authorized for authentication. Please contact the administrator.";
                        break;
                    case "auth/popup-blocked":
                        message =
                            "The sign-in popup was blocked by your browser. Please allow popups for this site.";
                        break;
                    default:
                        break;
                }
            }
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            await auth.signOut();
            router.push("/")
        } catch (error) {
            console.error("Error signing out:", error);
            setErrorMessage("Error signing out.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                userName,
                photoURL,
                signInWithGoogle,
                signOut,
                loading,
                errorMessage,
                user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
