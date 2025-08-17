"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthentificationService } from '@/lib/services/AuthentificationService';
import { AuthResponse } from '@/lib/models/AuthResponse';
import { SessionInfoDTO } from '@/lib/models/SessionInfoDTO';
import { LoginRequest } from '@/lib/models/LoginRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureAPI, setAuthToken } from '@/lib/config/apiConfig';

interface AuthUser {
  userId: string;
  username: string;
  email: string;
  role?: string;
  avote?: boolean;
  premierConnexion?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
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

  // Configuration API au démarrage
  useEffect(() => {
    configureAPI();
  }, []);

  // Initialisation au chargement de l'app
  useEffect(() => {
    initializeAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      
      if (storedToken) {
        setToken(storedToken);
        setAuthToken(storedToken);
        await verifyAndLoadSession(storedToken);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndLoadSession = async (authToken: string) => {
    try {
      // Vérifier la validité du token et récupérer les infos de session
      const authHeader = `Bearer ${authToken}`;
      
      const [isValid, sessionInfo] = await Promise.all([
        AuthentificationService.verifierTokenAdmin(authHeader),
        AuthentificationService.getSessionAdmin(authHeader)
      ]);

      if (isValid && sessionInfo.tokenValide) {
        const userData: AuthUser = {
          userId: sessionInfo.userId || '',
          username: sessionInfo.username || '',
          email: sessionInfo.email || '',
          role: sessionInfo.role,
          avote: sessionInfo.avote
        };
        setUser(userData);
      } else {
        throw new Error('Token invalide ou session expirée');
      }
    } catch (error) {
      console.error('Erreur vérification session:', error);
      await clearAuth();
      throw error;
    }
  };

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      
      let response: AuthResponse;
        response = await AuthentificationService.loginAdministrateur(credentials);
      

      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
        
        setToken(response.token);
        setAuthToken(response.token);
        const userData: AuthUser = {
          userId: response.userId || '',
          username: response.username || '',
          email: response.email || '',
          role: response.role,
          avote: response.avote,
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
      console.log('🚪 Début de la déconnexion...');
      // Appeler l'API de déconnexion si possible
      if (token) {
        console.log('📡 Appel API de déconnexion...');
        await AuthentificationService.logout();
        console.log('✅ API déconnexion terminée');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion API:', error);
      // Continue avec la déconnexion locale même si l'API échoue
    } finally {
      console.log('🧹 Nettoyage des données locales...');
      await clearAuth();
      console.log('✅ Déconnexion complète terminée');
    }
  };

  const clearAuth = async () => {
    try {
      console.log('🗑️ Suppression du token du stockage...');
      await AsyncStorage.removeItem('token');
      console.log('✅ Token supprimé du stockage');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du token:', error);
    }
    
    console.log('🔄 Réinitialisation des états...');
    setToken(null);
    setUser(null);
    setAuthToken(null);
    console.log('✅ États réinitialisés');
  };

  const refreshSession = async () => {
    if (!token || !user) return;
    
    try {
      await verifyAndLoadSession(token);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de la session:', error);
      await clearAuth();
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