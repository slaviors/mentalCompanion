import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/mentalCompanion_backend/index';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [actor, setActor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [loginError, setLoginError] = useState(null);

  // PERBAIKAN: Deteksi environment dengan benar
  const isPlayground = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1';
  
  // Backend canister ID - pastikan ini benar
  const backendCanisterId = "v3x57-gaaaa-aaaab-qadmq-cai"; // Ganti jika berbeda

  useEffect(() => {
    async function initAuth() {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);
        
        const isLoggedIn = await client.isAuthenticated();
        setIsAuthenticated(isLoggedIn);
        
        if (isLoggedIn) {
          const identity = client.getIdentity();
          setIdentity(identity);
          initActor(identity);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    initAuth();
  }, []);

  useEffect(() => {
    if (actor && isAuthenticated) {
      fetchUserProfile();
    }
  }, [actor, isAuthenticated]);

  async function fetchUserProfile() {
    try {
      const result = await actor.getProfile();
      if ('ok' in result) {
        setUserProfile(result.ok);
      } else {
        // Profile doesn't exist yet
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }

  function initActor(identity) {
    const agent = new HttpAgent({ 
      identity,
      // PERBAIKAN: Set host hanya ketika di playground
      host: isPlayground ? "https://icp0.io" : undefined
    });
    
    // PERBAIKAN: Fetch root key hanya di lingkungan local
    if (!isPlayground) {
      agent.fetchRootKey().catch(err => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
        console.error(err);
      });
    }

    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: backendCanisterId,
    });
    
    setActor(actor);
    return actor;
  }

  async function login() {
    if (authClient) {
      setLoginError(null);
      
      try {
        // PERBAIKAN UTAMA: Gunakan identityProvider yang benar berdasarkan environment
        const identityProvider = isPlayground
          ? "https://identity.ic0.app"  // Gunakan mainnet II untuk playground
          : `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`;  // Local dev
        
        console.log("Environment:", isPlayground ? "Playground" : "Local");
        console.log("Using Identity Provider:", identityProvider);
        
        await authClient.login({
          identityProvider: identityProvider,
          onSuccess: async () => {
            setIsAuthenticated(true);
            const identity = authClient.getIdentity();
            setIdentity(identity);
            const actor = initActor(identity);
            setActor(actor);
          },
          onError: (error) => {
            console.error("Login failed:", error);
            setLoginError("Failed to authenticate. Please try again.");
          }
        });
      } catch (error) {
        console.error("Login error:", error);
        setLoginError("An unexpected error occurred. Please try again.");
      }
    }
  }

  async function logout() {
    if (authClient) {
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setActor(null);
      setUserProfile(null);
    }
  }

  async function createProfile(name) {
    if (!actor) return;
    
    try {
      const result = await actor.createProfile(name);
      if ('ok' in result) {
        setUserProfile(result.ok);
        return result.ok;
      }
      return null;
    } catch (error) {
      console.error("Failed to create profile:", error);
      return null;
    }
  }

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    identity,
    actor,
    userProfile,
    createProfile,
    loginError,
    isPlayground
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}