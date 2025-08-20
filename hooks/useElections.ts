/* Correction du hook useElections - hooks/useElections.ts */
import { useState, useEffect, useCallback } from 'react';
import { ElectionsService } from '@/lib/services/ElectionsService';
import { ElectionDTO } from '@/lib/models/ElectionDTO';
import { CreateElectionRequest } from '@/lib/models/CreateElectionRequest';
import { UpdateElectionRequest } from '@/lib/models/UpdateElectionRequest';
import { ResultatsElectionDTO } from '@/lib/models/ResultatsElectionDTO';
import { useAuth } from '@/context/authcontext';

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
  const { token } = useAuth(); // ✅ AJOUTÉ

  // ✅ AJOUTÉ - Fonction pour obtenir le header d'authentification
  const getAuthHeader = useCallback(() => {
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }
    return `Bearer ${token}`;
  }, [token]);

  const refreshElections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Chargement des élections...');
      
      // Utiliser listerToutesElections pour avoir toutes les élections
      const result = await ElectionsService.listerToutesElections();
      console.log('✅ Élections récupérées:', result?.length || 0);
      
      setElections(result || []);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des élections:', err);
      setError('Erreur lors du chargement des élections');
    } finally {
      setLoading(false);
    }
  }, []);

  const creerElection = useCallback(async (election: CreateElectionRequest): Promise<ElectionDTO | null> => {
    console.log('➕ Création élection, données:', election);
    
    try {
      setError(null);
      const authHeader = getAuthHeader(); // ✅ AJOUTÉ
      const nouvelleElection = await ElectionsService.creerElection(authHeader, election); // ✅ MODIFIÉ
      console.log('✅ Élection créée:', nouvelleElection);
      
      // Rafraîchir la liste après création
      await refreshElections();
      
      return nouvelleElection;
    } catch (err) {
      console.error('❌ Erreur lors de la création de l\'élection:', err);
      setError('Erreur lors de la création de l\'élection');
      return null;
    }
  }, [refreshElections, getAuthHeader]); // ✅ AJOUTÉ getAuthHeader

  const modifierElection = useCallback(async (id: string, election: UpdateElectionRequest): Promise<ElectionDTO | null> => {
    console.log('🔄 Modification élection, données:', election);
    
    try {
      setError(null);
      const authHeader = getAuthHeader(); // ✅ AJOUTÉ
      const electionModifiee = await ElectionsService.modifierElection(authHeader, id, election); // ✅ MODIFIÉ
      console.log('✅ Élection modifiée:', electionModifiee);
      
      // Mettre à jour la liste locale
      setElections(prev => prev.map(e => 
        e.externalIdElection === id ? electionModifiee : e
      ));
      
      return electionModifiee;
    } catch (err) {
      console.error('❌ Erreur lors de la modification de l\'élection:', err);
      setError('Erreur lors de la modification de l\'élection');
      return null;
    }
  }, [getAuthHeader]); // ✅ AJOUTÉ getAuthHeader

  const supprimerElection = useCallback(async (id: string): Promise<boolean> => {
    console.log('🗑️ Suppression élection, ID:', id);
    
    try {
      setError(null);
      const authHeader = getAuthHeader(); // ✅ AJOUTÉ
      await ElectionsService.supprimerElection(authHeader, id); // ✅ MODIFIÉ
      console.log('✅ Élection supprimée');
      
      // Retirer de la liste locale
      setElections(prev => prev.filter(e => e.externalIdElection !== id));
      
      return true;
    } catch (err) {
      console.error('❌ Erreur lors de la suppression de l\'élection:', err);
      setError('Erreur lors de la suppression de l\'élection');
      return false;
    }
  }, [getAuthHeader]); // ✅ AJOUTÉ getAuthHeader

  const obtenirElection = useCallback(async (id: string): Promise<ElectionDTO | null> => {
    console.log('🔍 Récupération élection, ID:', id);
    
    try {
      setError(null);
      const election = await ElectionsService.obtenirElection(id);
      console.log('✅ Élection récupérée:', election);
      return election;
    } catch (err) {
      console.error('❌ Erreur lors de la récupération de l\'élection:', err);
      setError('Erreur lors de la récupération de l\'élection');
      return null;
    }
  }, []);

  const obtenirResultats = useCallback(async (id: string): Promise<ResultatsElectionDTO | null> => {
    console.log('📊 Récupération résultats élection, ID:', id);
    
    try {
      setError(null);
      const resultats = await ElectionsService.obtenirResultatsElection(id);
      console.log('✅ Résultats récupérés:', resultats);
      return resultats;
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des résultats:', err);
      setError('Erreur lors de la récupération des résultats');
      return null;
    }
  }, []);

  // Charger les élections au montage du hook
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