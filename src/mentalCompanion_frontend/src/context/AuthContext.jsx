import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/backend/index';

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
    const agent = new HttpAgent({ identity });
    // When developing locally, we need to disable certificate verification
    if (process.env.NODE_ENV !== 'production') {
      agent.fetchRootKey().catch(err => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
        console.error(err);
      });
    }

    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.BACKEND_CANISTER_ID,
    });
    
    setActor(actor);
    return actor;
  }

  async function login() {
    if (authClient) {
      await authClient.login({
        identityProvider: process.env.DFX_NETWORK === 'ic' 
          ? 'https://identity.ic0.app'
          : `http://localhost:4943/?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`,
        onSuccess: async () => {
          setIsAuthenticated(true);
          const identity = authClient.getIdentity();
          setIdentity(identity);
          const actor = initActor(identity);
          setActor(actor);
        },
      });
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}