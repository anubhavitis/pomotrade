import { useState } from 'react';


export enum AuthPageView {
    SignIn = "signin",
    SignUp = "signup",
    Verify = "verify",
    LoginPin = "loginpin"
}
/**
 * Hook for managing authentication page views
 * @param initialView - The initial view to display (defaults to "signin")
 * @returns Object containing current view and navigation function
 */
export const useAuthPage = (initialView: AuthPageView = AuthPageView.SignIn) => {
    const [currentView, setCurrentView] = useState(initialView);

    const navigate = (view: AuthPageView) => {
        setCurrentView(view);
    };

    return {
        currentView,
        navigate
    };
};
