"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthentificationService } from '@/lib/services/AuthentificationService';
import { AuthResponse } from '@/lib/models/AuthResponse';
import { SessionInfoDTO } from '@/lib/models/SessionInfoDTO';
import { LoginRequest } from '@/lib/models/LoginRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthUser {
  userId: string;
  username: string;
  email: string;
  
  premierConnexion?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialisation au chargement de l'app
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      
      if (storedToken) {
        setToken(storedToken);
        await verifyAndLoadSession(storedToken);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndLoadSession = async (authToken: string) => {
    try {
      // Vérifier la validité du token
      let isValid = false;
      let sessionInfo: SessionInfoDTO;

      
        isValid = await AuthentificationService.verifierTokenAdmin(`Bearer ${authToken}`);
        sessionInfo = await AuthentificationService.getSessionAdmin(`Bearer ${authToken}`);
      

      if (isValid && sessionInfo.tokenValide) {
        const userData = {
          userId: sessionInfo.userId || '',
          username: sessionInfo.username || '',
          email: sessionInfo.email || '',
          avote: sessionInfo.avote
        };
        setUser(userData);
      } else {
        throw new Error('Token invalide');
      }
    } catch (error) {
      console.error('Erreur vérification session:', error);
      clearAuth();
      throw error;
    }
  };

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      
      let response: AuthResponse;
        response = await AuthentificationService.loginAdministrateur(credentials);
      

      if (response.token) {

        AsyncStorage.setItem('token', response.token);
        
        setToken(response.token);
        const userData = {
          userId: response.userId || '',
          username: response.username || '',
          email: response.email || '',
          
          premierConnexion: response.premierConnexion
        };
        
        setUser(userData);

        return response;
      } else {
        throw new Error('Aucun token reçu');
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Appeler l'API de déconnexion si possible
      if (token) {
        await AuthentificationService.logout();
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      clearAuth();
    }
  };

  const clearAuth = () => {
    AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const refreshSession = async () => {
    if (!token || !user) return;
    
    try {
      await verifyAndLoadSession(token);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de la session:', error);
      clearAuth();
    }
  };

  
  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};