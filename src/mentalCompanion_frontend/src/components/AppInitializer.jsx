import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AppInitializer = () => {
  const { actor, isAuthenticated, principal } = useAuth();
  const [initStatus, setInitStatus] = useState('pending');
  
  useEffect(() => {
    if (actor && isAuthenticated && principal) {
      const checkCanisterStatus = async () => {
        try {
          console.log("Checking canister status...");
          
          // Mencoba mengakses ping method (metode sederhana) untuk verifikasi canister
          const result = await actor.ping();
          console.log("Canister ping result:", result);
          
          setInitStatus('success');
        } catch (error) {
          console.error("Failed to verify canister:", error);
          setInitStatus('failed');
          
          // Log detail error untuk debugging
          if (error.message.includes("no wasm module")) {
            console.error("ERROR: Canister has no wasm module. Please ensure the backend canister is deployed correctly.");
          } else if (error.message.includes("IC0503")) {
            console.error("ERROR: Canister not found. Please check the canister ID.");
          }
        }
      };
      
      checkCanisterStatus();
    }
  }, [actor, isAuthenticated, principal]);
  
  return null; // Komponen ini tidak merender UI
};

export default AppInitializer;