/* Correction du hook useElections - hooks/useElections.ts */
import { useState, useEffect, useCallback } from 'react';
import { ElectionsService } from '@/lib/services/ElectionsService';
import { AdministrationService } from '@/lib/services/AdministrationService';
import { ElectionDTO } from '@/lib/models/ElectionDTO';
import { CreateElectionRequest } from '@/lib/models/CreateElectionRequest';
import { UpdateElectionRequest } from '@/lib/models/UpdateElectionRequest';
import { ResultatsElectionDTO } from '@/lib/models/ResultatsElectionDTO';
import { useAuth } from '@/context/authcontext';
import { ApiError } from '@/lib/core/ApiError';

// Helper pour extraire un message d'erreur plus pertinent
const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    // Si le body contient un message, on l'utilise
    if (error.body && typeof error.body.message === 'string') {
      return error.body.message;
    }
    // Sinon, on utilise le statusText
    return `Erreur ${error.status}: ${error.statusText}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Une erreur inconnue est survenue';
};


interface UseElectionsResult {
  elections: ElectionDTO[];
  loading: boolean;
  error: string | null;
  refreshElections: () => Promise<void>;
  creerElection: (election: CreateElectionRequest) => Promise<ElectionDTO | null>;
  modifierElection: (id: string, election: UpdateElectionRequest) => Promise<ElectionDTO | null>;
  supprimerElection: (id: string) => Promise<boolean>;
  obtenirElection: (id: string) => Promise<ElectionDTO | null>;
  obtenirResultats: (id: string) => Promise<ResultatsElectionDTO | null>;
}

export const useElections = (): UseElectionsResult => {
  const [elections, setElections] = useState<ElectionDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const getAuthHeader = useCallback(() => {
    if (!token) {
      throw new Error("Vous n'êtes pas authentifié.");
    }
    return `Bearer ${token}`;
  }, [token]);

  const refreshElections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Chargement des élections...');
      
      const result = await ElectionsService.listerToutesElections();
      console.log('✅ Élections récupérées:', result?.length || 0);
      
      setElections(result || []);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des élections:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const creerElection = useCallback(async (election: CreateElectionRequest): Promise<ElectionDTO | null> => {
    console.log('➕ Création élection, données:', election);
    
    try {
      setError(null);
      const authHeader = getAuthHeader();
      const nouvelleElection = await AdministrationService.creerElection(authHeader, election);
      console.log('✅ Élection créée:', nouvelleElection);
      
      await refreshElections();
      
      return nouvelleElection;
    } catch (err) {
      console.error("❌ Erreur lors de la création de l'élection:", err);
      setError(getErrorMessage(err));
      return null;
    }
  }, [refreshElections, getAuthHeader]);

  const modifierElection = useCallback(async (id: string, election: UpdateElectionRequest): Promise<ElectionDTO | null> => {
    console.log('🔄 Modification élection, données:', election);
    
    try {
      setError(null);
      const authHeader = getAuthHeader();
      const electionModifiee = await AdministrationService.modifierElection(authHeader, id, election);
      console.log('✅ Élection modifiée:', electionModifiee);
      
      setElections(prev => prev.map(e => 
        e.externalIdElection === id ? electionModifiee : e
      ));
      
      return electionModifiee;
    } catch (err) {
      console.error("❌ Erreur lors de la modification de l'élection:", err);
      setError(getErrorMessage(err));
      return null;
    }
  }, [getAuthHeader]);

  const supprimerElection = useCallback(async (id: string): Promise<boolean> => {
    console.log('🗑️ Suppression élection, ID:', id);
    
    try {
      setError(null);
      const authHeader = getAuthHeader();
      await AdministrationService.supprimerElection(authHeader, id);
      console.log('✅ Élection supprimée');
      
      setElections(prev => prev.filter(e => e.externalIdElection !== id));
      
      return true;
    } catch (err) {
      console.error("❌ Erreur lors de la suppression de l'élection:", err);
      setError(getErrorMessage(err));
      return false;
    }
  }, [getAuthHeader]);

  const obtenirElection = useCallback(async (id: string): Promise<ElectionDTO | null> => {
    console.log('🔍 Récupération élection, ID:', id);
    
    try {
      setLoading(true);
      setError(null);
      const election = await ElectionsService.obtenirElection1(id);
      console.log('✅ Élection récupérée:', election);
      return election;
    } catch (err) {
      console.error("❌ Erreur lors de la récupération de l'élection:", err);
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenirResultats = useCallback(async (id: string): Promise<ResultatsElectionDTO | null> => {
    console.log('📊 Récupération résultats élection, ID:', id);
    
    try {
      setLoading(true);
      setError(null);
      const resultats = await ElectionsService.obtenirResultatsElection(id);
      console.log('✅ Résultats récupérés:', resultats);
      return resultats;
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des résultats:', err);
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshElections();
  }, [refreshElections]);

  return {
    elections,
    loading,
    error,
    refreshElections,
    creerElection,
    modifierElection,
    supprimerElection,
    obtenirElection,
    obtenirResultats,
  };
};
