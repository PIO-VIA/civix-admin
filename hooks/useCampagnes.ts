import { useState, useEffect, useCallback } from 'react';
import { AdministrationService } from '@/lib/services/AdministrationService';
import { CampagnesPublicService } from '@/lib/services/CampagnesPublicService';
import { CampagneDTO } from '@/lib/models/CampagneDTO';
import { CampagneDetailDTO } from '@/lib/models/CampagneDetailDTO';
import { CreateCampagneRequest } from '@/lib/models/CreateCampagneRequest';
import { UpdateCampagneRequest } from '@/lib/models/UpdateCampagneRequest';
import { StatistiquesCampagnesDTO } from '@/lib/models/StatistiquesCampagnesDTO';
import { useAuth } from '@/context/authcontext';

interface UseCampagnesResult {
  campagnes: CampagneDTO[];
  statistiques: StatistiquesCampagnesDTO | null;
  loading: boolean;
  error: string | null;
  refreshCampagnes: () => Promise<void>;
  creerCampagne: (campagne: CreateCampagneRequest) => Promise<CampagneDTO | null>;
  modifierCampagne: (id: string, campagne: UpdateCampagneRequest) => Promise<CampagneDTO | null>;
  supprimerCampagne: (id: string) => Promise<boolean>;
  obtenirCampagne: (id: string) => Promise<CampagneDetailDTO | null>;
  obtenirStatistiques: () => Promise<void>;
}

export const useCampagnes = (): UseCampagnesResult => {
  const [campagnes, setCampagnes] = useState<CampagneDTO[]>([]);
  const [statistiques, setStatistiques] = useState<StatistiquesCampagnesDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const getAuthHeader = useCallback(() => {
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }
    return `Bearer ${token}`;
  }, [token]);

  const refreshCampagnes = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const authHeader = getAuthHeader();
      const result = await AdministrationService.listerCampagnes(authHeader);
      setCampagnes(result);
    } catch (err) {
      console.error('Erreur lors du chargement des campagnes:', err);
      setError('Erreur lors du chargement des campagnes');
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeader]);

  const obtenirStatistiques = useCallback(async () => {
    try {
      setError(null);
      const stats = await CampagnesPublicService.obtenirStatistiques2();
      setStatistiques(stats);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Erreur lors du chargement des statistiques');
    }
  }, []);

  const creerCampagne = useCallback(async (campagne: CreateCampagneRequest): Promise<CampagneDTO | null> => {
    try {
      setError(null);
      const authHeader = getAuthHeader();
      const nouvelleCampagne = await AdministrationService.creerCampagne(authHeader, campagne);
      
      // Rafraîchir la liste après création
      await refreshCampagnes();
      
      return nouvelleCampagne;
    } catch (err) {
      console.error('Erreur lors de la création de la campagne:', err);
      setError('Erreur lors de la création de la campagne');
      return null;
    }
  }, [getAuthHeader, refreshCampagnes]);

  const modifierCampagne = useCallback(async (id: string, campagne: UpdateCampagneRequest): Promise<CampagneDTO | null> => {
    try {
      setError(null);
      const authHeader = getAuthHeader();
      const campagneModifiee = await AdministrationService.modifierCampagne(authHeader, id, campagne);
      
      // Mettre à jour la liste locale
      setCampagnes(prev => prev.map(c => 
        c.externalIdCampagne === id ? campagneModifiee : c
      ));
      
      return campagneModifiee;
    } catch (err) {
      console.error('Erreur lors de la modification de la campagne:', err);
      setError('Erreur lors de la modification de la campagne');
      return null;
    }
  }, [getAuthHeader]);

  const supprimerCampagne = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const authHeader = getAuthHeader();
      await AdministrationService.supprimerCampagne(authHeader, id);
      
      // Retirer de la liste locale
      setCampagnes(prev => prev.filter(c => c.externalIdCampagne !== id));
      
      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de la campagne:', err);
      setError('Erreur lors de la suppression de la campagne');
      return false;
    }
  }, [getAuthHeader]);

  const obtenirCampagne = useCallback(async (id: string): Promise<CampagneDetailDTO | null> => {
    try {
      setError(null);
      const campagne = await CampagnesPublicService.obtenirCampagne(id);
      return campagne;
    } catch (err) {
      console.error('Erreur lors de la récupération de la campagne:', err);
      setError('Erreur lors de la récupération de la campagne');
      return null;
    }
  }, []);

  // Charger les campagnes au montage du hook
  useEffect(() => {
    refreshCampagnes();
    obtenirStatistiques();
  }, [refreshCampagnes, obtenirStatistiques]);

  return {
    campagnes,
    statistiques,
    loading,
    error,
    refreshCampagnes,
    creerCampagne,
    modifierCampagne,
    supprimerCampagne,
    obtenirCampagne,
    obtenirStatistiques,
  };
};