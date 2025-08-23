import { useState, useEffect, useCallback } from 'react';
import { SystMeService } from '@/lib/services/SystMeService';
import { HealthCheckDTO } from '@/lib/models/HealthCheckDTO';
import { ApiError } from '@/lib/core/ApiError';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.body && typeof error.body.message === 'string') {
      return error.body.message;
    }
    return `Erreur ${error.status}: ${error.statusText}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Une erreur inconnue est survenue';
};

interface UseHealthCheckResult {
  healthCheckData: HealthCheckDTO | null;
  loading: boolean;
  error: string | null;
  refreshHealthCheck: () => Promise<void>;
}

export const useHealthChecks = (): UseHealthCheckResult => {
  const [healthCheckData, setHealthCheckData] = useState<HealthCheckDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshHealthCheck = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Chargement du health check...');
      
      const result = await SystMeService.healthCheck();
      console.log('✅ Health check récupéré:', result);
      
      setHealthCheckData(result);
    } catch (err) {
      console.error('❌ Erreur lors du chargement du health check:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshHealthCheck();
  }, [refreshHealthCheck]);

  return {
    healthCheckData,
    loading,
    error,
    refreshHealthCheck,
  };
};
