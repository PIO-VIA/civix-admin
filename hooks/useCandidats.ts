import { useState, useEffect, useCallback } from 'react';
import { AdministrationService } from '@/lib/services/AdministrationService';
import { CandidatsPublicService } from '@/lib/services/CandidatsPublicService';
import { CandidatDTO } from '@/lib/models/CandidatDTO';
import { CandidatDetailDTO } from '@/lib/models/CandidatDetailDTO';
import { CreateCandidatRequest } from '@/lib/models/CreateCandidatRequest';
import { UpdateCandidatRequest } from '@/lib/models/UpdateCandidatRequest';
import { StatistiquesCandidatDTO } from '@/lib/models/StatistiquesCandidatDTO';
import { useAuth } from '@/context/authcontext';

interface UseCandidatsResult {
  candidats: CandidatDTO[];
  statistiques: StatistiquesCandidatDTO[] | null;
  loading: boolean;
  error: string | null;
  refreshCandidats: () => Promise<void>;
  creerCandidat: (candidat: CreateCandidatRequest) => Promise<CandidatDTO | null>;
  modifierCandidat: (id: string, candidat: UpdateCandidatRequest) => Promise<CandidatDTO | null>;
  supprimerCandidat: (id: string) => Promise<boolean>;
  obtenirCandidat: (id: string) => Promise<CandidatDetailDTO | null>;
  obtenirStatistiques: () => Promise<void>;
}

export const useCandidats = (): UseCandidatsResult => {
  const [candidats, setCandidats] = useState<CandidatDTO[]>([]);
  const [statistiques, setStatistiques] = useState<StatistiquesCandidatDTO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const getAuthHeader = useCallback(() => {
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }
    return `Bearer ${token}`;
  }, [token]);

  const refreshCandidats = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const authHeader = getAuthHeader();
      const result = await AdministrationService.listerCandidats(authHeader);
      setCandidats(result);
    } catch (err) {
      console.error('Erreur lors du chargement des candidats:', err);
      setError('Erreur lors du chargement des candidats');
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeader]);

  const obtenirStatistiques = useCallback(async () => {
    try {
      setError(null);
      const stats = await CandidatsPublicService.obtenirStatistiques1();
      setStatistiques(stats);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Erreur lors du chargement des statistiques');
    }
  }, []);

  const creerCandidat = useCallback(async (candidat: CreateCandidatRequest): Promise<CandidatDTO | null> => {
    try {
      setError(null);
      const authHeader = getAuthHeader();
      const nouveauCandidat = await AdministrationService.creerCandidat(authHeader, candidat);
      
      // Rafraîchir la liste après création
      await refreshCandidats();
      
      return nouveauCandidat;
    } catch (err) {
      console.error('Erreur lors de la création du candidat:', err);
      setError('Erreur lors de la création du candidat');
      return null;
    }
  }, [getAuthHeader, refreshCandidats]);

  const modifierCandidat = useCallback(async (id: string, candidat: UpdateCandidatRequest): Promise<CandidatDTO | null> => {
    try {
      setError(null);
      const authHeader = getAuthHeader();
      const candidatModifie = await AdministrationService.modifierCandidat(authHeader, id, candidat);
      
      // Mettre à jour la liste locale
      setCandidats(prev => prev.map(c => 
        c.externalIdCandidat === id ? candidatModifie : c
      ));
      
      return candidatModifie;
    } catch (err) {
      console.error('Erreur lors de la modification du candidat:', err);
      setError('Erreur lors de la modification du candidat');
      return null;
    }
  }, [getAuthHeader]);

  const supprimerCandidat = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const authHeader = getAuthHeader();
      await AdministrationService.supprimerCandidat(authHeader, id);
      
      // Retirer de la liste locale
      setCandidats(prev => prev.filter(c => c.externalIdCandidat !== id));
      
      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression du candidat:', err);
      setError('Erreur lors de la suppression du candidat');
      return false;
    }
  }, [getAuthHeader]);

  const obtenirCandidat = useCallback(async (id: string): Promise<CandidatDetailDTO | null> => {
    try {
      setError(null);
      const candidat = await CandidatsPublicService.obtenirCandidat(id);
      return candidat;
    } catch (err) {
      console.error('Erreur lors de la récupération du candidat:', err);
      setError('Erreur lors de la récupération du candidat');
      return null;
    }
  }, []);

  // Charger les candidats au montage du hook
  useEffect(() => {
    refreshCandidats();
    obtenirStatistiques();
  }, [refreshCandidats, obtenirStatistiques]);

  return {
    candidats,
    statistiques,
    loading,
    error,
    refreshCandidats,
    creerCandidat,
    modifierCandidat,
    supprimerCandidat,
    obtenirCandidat,
    obtenirStatistiques,
  };
};