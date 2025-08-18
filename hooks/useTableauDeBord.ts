import { useState, useEffect, useCallback } from 'react';
import { TableauxDeBordService } from '@/lib/services/TableauxDeBordService';
import { DashboardAdminDTO } from '@/lib/models/DashboardAdminDTO';
import { useAuth } from '@/context/authcontext';

interface UseTableauDeBordResult {
  dashboardData: DashboardAdminDTO | null;
  loading: boolean;
  error: string | null;
  refreshDashboard: () => Promise<void>;
}

export const useTableauDeBord = (): UseTableauDeBordResult => {
  const [dashboardData, setDashboardData] = useState<DashboardAdminDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const refreshDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📊 Chargement du dashboard admin...');
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const result = await TableauxDeBordService.obtenirDashboardAdmin(`Bearer ${token}`);
      console.log('✅ Dashboard admin récupéré:', result);
      
      setDashboardData(result);
    } catch (err) {
      console.error('❌ Erreur lors du chargement du dashboard:', err);
      setError('Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Charger le dashboard au montage du hook
  useEffect(() => {
    if (token) {
      refreshDashboard();
    }
  }, [refreshDashboard, token]);

  return {
    dashboardData,
    loading,
    error,
    refreshDashboard,
  };
};