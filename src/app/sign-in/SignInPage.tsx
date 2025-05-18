"use client"
import { useAuth } from "../../context/AuthContext";
import styles from "./signInPage.module.css";
import GoogleIcon from "@/icons/GoogleIcon";

export default function SignInPage() {
    const { signInWithGoogle, loading, errorMessage } = useAuth();
    
    return (
        <div className={styles.signInPage}>
            <div className={styles.signInContainer}>
                <h1>Welcome Back</h1>
                <p className={styles.signinText}>Sign in with your Google account to continue</p>
                
                <button
                    className={styles.googleButton}
                    onClick={signInWithGoogle}
                    disabled={loading}
                >
                    <GoogleIcon className={styles.googleIcon} />
                    <span>
                        {loading ? "Signing in..." : "Continue with Google"}
                    </span>
                </button>
                
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            </div>
        </div>
    );
}