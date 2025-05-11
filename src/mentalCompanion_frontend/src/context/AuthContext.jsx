import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { mentalCompanion_backend } from 'declarations/mentalCompanion_backend';


export const AuthContext = createContext();


const convertToNanoSeconds = (days) => {
  return BigInt(days * 24 * 60 * 60 * 1000 * 1000 * 1000);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);


        const isAuthenticated = await client.isAuthenticated();
        if (isAuthenticated) {
          const identity = client.getIdentity();
          setIdentity(identity);
          setIsAuthenticated(true);


          try {
            const profile = await mentalCompanion_backend.getProfile();
            setUserProfile(profile.length > 0 ? profile[0] : null);
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);


  const login = async () => {
    if (!authClient) return;

    const daysToExpire = 7; // Set session to expire in 7 days

    await authClient.login({
      identityProvider: process.env.DFX_NETWORK === 'ic'
        ? 'https://identity.ic0.app'
        : `http://localhost:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`,
      maxTimeToLive: convertToNanoSeconds(daysToExpire),
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        setIdentity(identity);
        setIsAuthenticated(true);
      },
    });
  };


  const logout = async () => {
    if (!authClient) return;

    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
    setUserProfile(null);
  };


  const createProfile = async (name) => {
    if (!isAuthenticated) return;

    try {
      await mentalCompanion_backend.createProfile(name);
      const profile = await mentalCompanion_backend.getProfile();
      setUserProfile(profile.length > 0 ? profile[0] : null);
      return true;
    } catch (error) {
      console.error("Error creating profile:", error);
      return false;
    }
  };

  const value = {
    isAuthenticated,
    loading,
    identity,
    userProfile,
    login,
    logout,
    createProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};