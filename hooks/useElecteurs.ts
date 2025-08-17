import { useState, useEffect, useCallback } from 'react';
import { AdministrationService } from '@/lib/services/AdministrationService';
import { ElecteurDTO } from '@/lib/models/ElecteurDTO';
import { CreateElecteurAdminRequest } from '@/lib/models/CreateElecteurAdminRequest';
import { UpdateElecteurRequest } from '@/lib/models/UpdateElecteurRequest';
import { useAuth } from '@/context/authcontext';

interface UseElecteursResult {
  electeurs: ElecteurDTO[];
  loading: boolean;
  error: string | null;
  refreshElecteurs: () => Promise<void>;
  creerElecteur: (electeur: CreateElecteurAdminRequest) => Promise<ElecteurDTO | null>;
  modifierElecteur: (id: string, electeur: UpdateElecteurRequest) => Promise<ElecteurDTO | null>;
  supprimerElecteur: (id: string) => Promise<boolean>;
  obtenirElecteur: (id: string) => Promise<ElecteurDTO | null>;
  renvoyerIdentifiants: (id: string) => Promise<boolean>;
}

export const useElecteurs = (): UseElecteursResult => {
  const [electeurs, setElecteurs] = useState<ElecteurDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const getAuthHeader = useCallback(() => {
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }
    console.log('🔍 Token brut:', token);
    const bearerToken = `Bearer ${token}`;
    console.log('🔑 Bearer token:', bearerToken);
    return bearerToken;
  }, [token]);

  const refreshElecteurs = useCallback(async () => {
    console.log('🔄 refreshElecteurs - Début, token:', token ? '✅ Présent' : '❌ Absent');
    
    if (!token) {
      console.log('❌ Pas de token, arrêt du chargement');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const authHeader = getAuthHeader();
      console.log('🔑 Auth header généré:', authHeader);
      
      console.log('📡 Appel AdministrationService.listerElecteurs...');
      
      // Comparaison: Testons aussi les candidats pour voir si ils fonctionnent
      console.log('🧪 Test comparatif: Appel candidats pour vérifier que l\'auth fonctionne');
      try {
        const candidatsTest = await AdministrationService.listerCandidats(authHeader);
        console.log('✅ Candidats récupérés:', candidatsTest?.length || 0);
      } catch (candidatsErr) {
        console.log('❌ Erreur candidats:', candidatsErr);
      }
      
      // Test 1: Avec paramètres page=0, size=100
      console.log('🧪 Test 1: page=0, size=100');
      let result = await AdministrationService.listerElecteurs(authHeader, 0, 100);
      console.log('📊 Test 1 résultat:', result?.length || 0);
      
      if (!result || result.length === 0) {
        // Test 2: Sans paramètre page (undefined)
        console.log('🧪 Test 2: page=undefined, size=100');
        result = await AdministrationService.listerElecteurs(authHeader, undefined, 100);
        console.log('📊 Test 2 résultat:', result?.length || 0);
      }
      
      if (!result || result.length === 0) {
        // Test 3: Avec page=1
        console.log('🧪 Test 3: page=1, size=100');
        result = await AdministrationService.listerElecteurs(authHeader, 1, 100);
        console.log('📊 Test 3 résultat:', result?.length || 0);
      }
      
      console.log('✅ Résultat final, nombre d\'électeurs:', result?.length || 0);
      
      setElecteurs(result);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des électeurs:', err);
      console.error('❌ Type d\'erreur:', typeof err);
      console.error('❌ Message d\'erreur:', err instanceof Error ? err.message : 'Erreur inconnue');
      setError('Erreur lors du chargement des électeurs');
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeader]);

  const creerElecteur = useCallback(async (electeur: CreateElecteurAdminRequest): Promise<ElecteurDTO | null> => {
    console.log('➕ creerElecteur - Début, données:', electeur);
    
    try {
      setError(null);
      const authHeader = getAuthHeader();
      console.log('🔑 Auth header pour création:', authHeader);
      
      console.log('📡 Appel AdministrationService.creerElecteur...');
      const nouvelElecteur = await AdministrationService.creerElecteur(authHeader, electeur);
      console.log('✅ Électeur créé:', nouvelElecteur);
      
      // Rafraîchir la liste après création
      console.log('🔄 Rafraîchissement de la liste après création...');
      await refreshElecteurs();
      
      return nouvelElecteur;
    } catch (err) {
      console.error('❌ Erreur lors de la création de l\'électeur:', err);
      console.error('❌ Type d\'erreur:', typeof err);
      console.error('❌ Message d\'erreur:', err instanceof Error ? err.message : 'Erreur inconnue');
      setError('Erreur lors de la création de l\'électeur');
      return null;
    }
  }, [getAuthHeader, refreshElecteurs]);

  const modifierElecteur = useCallback(async (id: string, electeur: UpdateElecteurRequest): Promise<ElecteurDTO | null> => {
    try {
      setError(null);
      const authHeader = getAuthHeader();
      const electeurModifie = await AdministrationService.modifierElecteur(authHeader, id, electeur);
      
      // Mettre à jour la liste locale
      setElecteurs(prev => prev.map(e => 
        e.externalIdElecteur === id ? electeurModifie : e
      ));
      
      return electeurModifie;
    } catch (err) {
      console.error('Erreur lors de la modification de l\'électeur:', err);
      setError('Erreur lors de la modification de l\'électeur');
      return null;
    }
  }, [getAuthHeader]);

  const supprimerElecteur = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const authHeader = getAuthHeader();
      await AdministrationService.supprimerElecteur(authHeader, id);
      
      // Retirer de la liste locale
      setElecteurs(prev => prev.filter(e => e.externalIdElecteur !== id));
      
      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'électeur:', err);
      setError('Erreur lors de la suppression de l\'électeur');
      return false;
    }
  }, [getAuthHeader]);

  const obtenirElecteur = useCallback(async (id: string): Promise<ElecteurDTO | null> => {
    try {
      setError(null);
      const authHeader = getAuthHeader();
      const electeur = await AdministrationService.obtenirElecteur(authHeader, id);
      return electeur;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'électeur:', err);
      setError('Erreur lors de la récupération de l\'électeur');
      return null;
    }
  }, [getAuthHeader]);

  const renvoyerIdentifiants = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const authHeader = getAuthHeader();
      await AdministrationService.renvoyerIdentifiants(authHeader, id);
      return true;
    } catch (err) {
      console.error('Erreur lors du renvoi des identifiants:', err);
      setError('Erreur lors du renvoi des identifiants');
      return false;
    }
  }, [getAuthHeader]);

  // Charger les électeurs au montage du hook
  useEffect(() => {
    refreshElecteurs();
  }, [refreshElecteurs]);

  return {
    electeurs,
    loading,
    error,
    refreshElecteurs,
    creerElecteur,
    modifierElecteur,
    supprimerElecteur,
    obtenirElecteur,
    renvoyerIdentifiants,
  };
};