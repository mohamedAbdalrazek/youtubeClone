"use client"
import { useAuth } from "../../context/AuthContext";
import styles from "./signInPage.module.css";
import GoogleIcon from "@/icons/GoogleIcon";

export default function SignInPage() {
    const { signInWithGoogle, loading, errorMessage } = useAuth();
    return (
        <div className={styles.signInPage}>
            <div className={styles.signInContainer}>
                <button
                    className={styles.googleButton}
                    onClick={signInWithGoogle}
                >
                    <GoogleIcon className={styles.googleIcon} />
                    <span>
                        {loading ? "Signing in..." : "Continue with Google"}
                    </span>
                </button>
                {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            </div>
        </div>
    );
}
