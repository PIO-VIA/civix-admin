// Export de toutes les données mock
export * from './elections';
export * from './campagnes';
export * from './candidats';
export * from './electeurs';
export * from './dashboard';

// Types communs
export interface BaseEntity {
  id: string;
  nom: string;
  statut: string;
}

export interface Statistiques {
  total: number;
  actifs: number;
  inactifs?: number;
}

export type StatusType = 'ACTIF' | 'INACTIF' | 'EN_COURS' | 'TERMINEE' | 'PROGRAMMEE' | 'VALIDE' | 'EN_ATTENTE' | 'REJETE';
export type AlertType = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

// Utilitaires
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(num);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const getStatusColor = (status: StatusType): string => {
  const colors = {
    'ACTIF': '#28A745',
    'INACTIF': '#6C757D',
    'EN_COURS': '#007BFF',
    'TERMINEE': '#28A745',
    'PROGRAMMEE': '#FFC107',
    'VALIDE': '#28A745',
    'EN_ATTENTE': '#FFC107',
    'REJETE': '#DC3545'
  };
  return colors[status] || '#6C757D';
};