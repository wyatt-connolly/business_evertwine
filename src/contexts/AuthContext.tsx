"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  signOut,
  updateProfile,
  UserCredential,
  ConfirmationResult,
} from "firebase/auth";
import { auth, googleProvider, createRecaptchaVerifier } from "@/lib/firebase";
import { LoadingPage } from "@/components/LoadingSpinner";
import { BusinessUser } from "@/types";
import {
  getBusinessUser,
  createBusinessUser,
  updateBusinessUser,
} from "@/lib/firestore";

interface AuthContextType {
  user: User | null;
  businessProfile: BusinessUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>;
  confirmPhoneSignIn: (
    confirmationResult: ConfirmationResult,
    code: string
  ) => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateBusinessProfile: (profileData: Partial<BusinessUser>) => Promise<void>;
  createBusinessProfile: (
    profileData: Omit<
      BusinessUser,
      "user_id" | "user_type" | "email" | "created_at" | "updated_at"
    >
  ) => Promise<void>;
  isBusinessProfileComplete: () => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessUser | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Load business profile when user signs in
        try {
          let profile = await getBusinessUser(user.uid);

          // If no business profile exists, create a default one
          if (!profile) {
            console.log(
              "No business profile found, creating default profile..."
            );
            const defaultProfileData = {
              business_name: "", // Start with empty business name
              contact_email: user.email || "",
              bio: "",
              photo_url: "", // Start with empty photo URL
              address: "",
              location: {
                latitude: 37.7749, // Default to San Francisco
                longitude: -122.4194,
              },
              notification_promotion_updates: true,
              notification_customer_interactions: true,
              notification_marketing_updates: false,
              notification_account_alerts: true,
            };

            await createBusinessUser({
              ...defaultProfileData,
              user_id: user.uid,
              user_type: "business_website" as const,
              email: user.email || "",
              auth_provider:
                user.providerData[0]?.providerId === "google.com"
                  ? ("google" as const)
                  : user.providerData[0]?.providerId === "phone"
                  ? ("phone" as const)
                  : ("email" as const),
            });

            // Load the newly created profile
            profile = await getBusinessUser(user.uid);
          }

          setBusinessProfile(profile);
        } catch (error) {
          console.error("Error loading/creating business profile:", error);
          setBusinessProfile(null);
        }
      } else {
        setBusinessProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName && result.user) {
      await updateProfile(result.user, {
        displayName: displayName,
      });
    }

    return result;
  };

  const signInWithGoogle = async () => {
    return signInWithPopup(auth, googleProvider);
  };

  const signInWithPhone = async (phoneNumber: string) => {
    const recaptchaVerifier = createRecaptchaVerifier("recaptcha-container");
    return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };

  const confirmPhoneSignIn = async (
    confirmationResult: ConfirmationResult,
    code: string
  ) => {
    return confirmationResult.confirm(code);
  };

  const logout = async () => {
    setBusinessProfile(null);
    return signOut(auth);
  };

  const createBusinessProfile = async (
    profileData: Omit<
      BusinessUser,
      "user_id" | "user_type" | "email" | "created_at" | "updated_at"
    >
  ) => {
    if (!user) throw new Error("User must be authenticated");

    const businessUserData = {
      ...profileData,
      user_id: user.uid,
      user_type: "business_website" as const,
      email: user.email || "",
      auth_provider:
        user.providerData[0]?.providerId === "google.com"
          ? ("google" as const)
          : user.providerData[0]?.providerId === "phone"
          ? ("phone" as const)
          : ("email" as const),
    };

    await createBusinessUser(businessUserData);
    const newProfile = await getBusinessUser(user.uid);
    setBusinessProfile(newProfile);
  };

  const updateBusinessProfile = async (updates: Partial<BusinessUser>) => {
    if (!user) throw new Error("User must be authenticated");

    console.log("Updating business profile with:", updates);
    await updateBusinessUser(user.uid, updates);
    const updatedProfile = await getBusinessUser(user.uid);
    console.log("Updated profile from database:", updatedProfile);
    setBusinessProfile(updatedProfile);
  };

  const isBusinessProfileComplete = () => {
    if (!businessProfile) return false;

    // Check if essential business fields are filled
    return !!(
      businessProfile.business_name &&
      businessProfile.business_name.trim() !== "" && // Not empty
      businessProfile.contact_email &&
      businessProfile.address &&
      businessProfile.bio
    );
  };

  const value = {
    user,
    businessProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithPhone,
    confirmPhoneSignIn,
    logout,
    createBusinessProfile,
    updateBusinessProfile,
    isBusinessProfileComplete,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
};
