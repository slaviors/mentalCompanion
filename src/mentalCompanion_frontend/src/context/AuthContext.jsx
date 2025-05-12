import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/mentalCompanion_backend/mentalCompanion_backend.did.js";

// Buat context untuk otentikasi
const AuthContext = createContext();

// Custom hook untuk menggunakan auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [actor, setActor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [loginError, setLoginError] = useState("");

  // Menentukan apakah kita berada di environment Playground atau lokal
  const isPlayground =
    window.location.hostname !== "localhost" &&
    !window.location.hostname.includes("127.0.0.1");

  // Buat actor dengan identity yang terautentikasi
  const createActorWithIdentity = (userIdentity) => {
    // Gunakan canister ID dari environment atau gunakan ID default
    const canisterId =
      process.env.CANISTER_ID_MENTALCOMPANION_BACKEND ||
      "3l4c5-2qaaa-aaaab-qacpq-cai"; // Sesuaikan dengan canister ID backend Anda

    // Buat agent sesuai environment
    let agent;
    if (isPlayground) {
      // Untuk production/playground environment, gunakan icp0.io, BUKAN ic0.app
      agent = new HttpAgent({
        identity: userIdentity,
        host: "https://icp0.io", // PENTING: Gunakan icp0.io bukan ic0.app!
      });
    } else {
      // Untuk local development
      agent = new HttpAgent({
        identity: userIdentity,
        host: "http://localhost:4943",
      });
      // Skip verification di local development
      agent.fetchRootKey().catch((err) => {
        console.warn(
          "Unable to fetch root key. Check if your local replica is running"
        );
        console.error(err);
      });
    }

    // Buat actor untuk berinteraksi dengan canister backend
    const newActor = Actor.createActor(idlFactory, {
      agent,
      canisterId: canisterId,
    });

    return newActor;
  };

  // Inisialisasi AuthClient saat komponen dimount
  useEffect(() => {
    const initAuthClient = async () => {
      try {
        console.log("Initializing auth client...");
        const client = await AuthClient.create();
        setAuthClient(client);

        // Periksa apakah sudah terautentikasi
        const isLoggedIn = await client.isAuthenticated();
        setIsAuthenticated(isLoggedIn);
        console.log("Is authenticated:", isLoggedIn);

        if (isLoggedIn) {
          const userIdentity = client.getIdentity();
          setIdentity(userIdentity);
          const userPrincipal = userIdentity.getPrincipal();
          setPrincipal(userPrincipal);
          console.log("Authenticated as principal:", userPrincipal.toString());

          // Buat actor dengan identity yang sudah terautentikasi
          const newActor = createActorWithIdentity(userIdentity);
          setActor(newActor);

          // Coba dapatkan profil pengguna
          try {
            await fetchUserProfile(newActor);
          } catch (profileError) {
            console.warn(
              "Failed to fetch user profile, but authentication successful:",
              profileError
            );
            // Tidak perlu menampilkan error ke user karena mungkin belum membuat profil
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth client:", error);
        setLoginError(
          "Failed to initialize authentication client. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    initAuthClient();
  }, []);

  // Fungsi untuk mendapatkan profil pengguna dari backend
  const fetchUserProfile = async (actorInstance) => {
    try {
      if (!actorInstance) {
        console.warn("No actor instance provided to fetchUserProfile");
        return;
      }

      console.log("Fetching user profile...");
      const result = await actorInstance.getProfile();
      console.log("Profile result:", result);

      if ("ok" in result) {
        setUserProfile(result.ok);
      } else {
        // Tidak ada profil ditemukan, tetapi tidak perlu menampilkan error
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      // Handle error tapi jangan menampilkan error ke user
      setUserProfile(null);
      throw error; // Re-throw untuk penanganan di tempat lain jika diperlukan
    }
  };

  // Fungsi login
  const login = async () => {
    if (!authClient) {
      setLoginError(
        "Authentication client not initialized. Please refresh the page."
      );
      throw new Error("Authentication client not initialized");
    }

    setLoginError("");
    console.log("Starting login process...");

    // Tentukan provider URL berdasarkan environment
    const identityProviderUrl = isPlayground
      ? "https://identity.ic0.app" // Untuk production/playground
      : `http://localhost:4943?canisterId=${
          process.env.CANISTER_ID_INTERNET_IDENTITY ||
          "rdmx6-jaaaa-aaaaa-aaadq-cai"
        }`; // Untuk local development

    console.log("Using identity provider:", identityProviderUrl);

    // Reset authClient sebelum login
    try {
      await authClient.logout();
      const newAuthClient = await AuthClient.create();
      setAuthClient(newAuthClient);

      return new Promise((resolve, reject) => {
        newAuthClient.login({
          identityProvider: identityProviderUrl,
          onSuccess: async () => {
            console.log("Login successful");
            setIsAuthenticated(true);
            const userIdentity = newAuthClient.getIdentity();
            setIdentity(userIdentity);
            const userPrincipal = userIdentity.getPrincipal();
            setPrincipal(userPrincipal);
            console.log(
              "Authenticated as principal:",
              userPrincipal.toString()
            );

            // Buat actor dengan identity yang baru
            const newActor = createActorWithIdentity(userIdentity);
            setActor(newActor);

            // Dapatkan profil pengguna
            try {
              await fetchUserProfile(newActor);
              resolve(true);
            } catch (profileError) {
              console.warn(
                "Failed to fetch user profile after login, but authentication successful:",
                profileError
              );
              // Tidak perlu menampilkan error ke user karena mungkin belum membuat profil
              resolve(true);
            }
          },
          onError: (error) => {
            console.error("Login failed:", error);
            setLoginError("Failed to authenticate. Please try again.");
            reject(error);
          },
          maxTimeToLive: BigInt(8) * BigInt(3600000000000), // 8 jam dalam nanosekon
          windowOpenerFeatures: `toolbar=0,location=0,menubar=0,width=600,height=700,left=${
            window.screen.width / 2 - 300
          },top=${window.screen.height / 2 - 350}`,
        });
      });
    } catch (error) {
      console.error("Failed to create new auth client:", error);
      setLoginError(
        "Authentication initialization failed. Please refresh the page."
      );
      throw error;
    }
  };

  // Fungsi logout
  const logout = async () => {
    if (authClient) {
      console.log("Logging out...");
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setActor(null);
      setUserProfile(null);
      console.log("Logout complete");
    }
  };

  // Fungsi untuk membuat profil pengguna
  const createProfile = async (name) => {
    if (!actor) {
      throw new Error("Actor not initialized. Please login first.");
    }

    try {
      // Log untuk debugging
      console.log("Creating profile with name:", name);
      console.log("Actor instance:", actor);
      console.log("Using principal:", principal?.toString());

      // Tambahkan timestamp untuk memastikan request unik
      const timestamp = new Date().toISOString();
      console.log("Request timestamp:", timestamp);

      // Memanggil fungsi createProfile di backend
      const result = await actor.createProfile(name);

      if ("ok" in result) {
        // Profile berhasil dibuat, update state
        setUserProfile(result.ok);
        return true;
      } else {
        console.error("Failed to create profile:", result.err);
        return false;
      }
    } catch (error) {
      console.error("Failed to create profile:", error);
      throw error;
    }
  };

  // Menyediakan nilai context untuk komponen child
  const contextValue = {
    isAuthenticated,
    identity,
    principal,
    actor,
    isLoading,
    userProfile,
    login,
    logout,
    createProfile,
    loginError,
    isPlayground,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
