import { User } from "firebase/auth";
import { destroyCookie, setCookie } from "nookies";
const COOKIE_MAX_AGE = 2 * 60 * 60; // 10 days

export const saveUserCookies =
    async (user: User) => {
        const idToken = await user.getIdToken();
        setCookie(null, "token", idToken, {
            maxAge: COOKIE_MAX_AGE,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        setCookie(null, "userName", user.displayName || "", {
            maxAge: COOKIE_MAX_AGE,
            path: "/",
        });
        setCookie(null, "photoURL", user.photoURL || "", {
            maxAge: COOKIE_MAX_AGE,
            path: "/",
        });
    }

export const clearUserCookies = () => {
    destroyCookie(null, "token", { path: "/" });
    destroyCookie(null, "userName", { path: "/" });
    destroyCookie(null, "photoURL", { path: "/" });
};
