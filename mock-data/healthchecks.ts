export interface HealthCheck {
  id: string;
  nom: string;
  statut: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  tempsReponse: number; // en ms
  derniereVerification: string;
  description: string;
  endpoint?: string;
  details?: {
    cpu?: number;
    memoire?: number;
    disque?: number;
    connexions?: number;
  };
}

export interface SystemHealth {
  statusGlobal: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  score: number; // 0-100
  tempsReponseTotal: number;
  servicesActifs: number;
  servicesTotal: number;
}

export const mockHealthChecks: HealthCheck[] = [
  {
    id: '1',
    nom: 'Base de Données',
    statut: 'HEALTHY',
    tempsReponse: 45,
    derniereVerification: new Date(Date.now() - 30000).toISOString(),
    description: 'Connexion à la base de données PostgreSQL',
    endpoint: 'postgresql://localhost:5432/civix',
    details: {
      connexions: 15,
      cpu: 23,
      memoire: 67
    }
  },
  {
    id: '2',
    nom: 'API Authentification',
    statut: 'HEALTHY',
    tempsReponse: 78,
    derniereVerification: new Date(Date.now() - 15000).toISOString(),
    description: 'Service d\'authentification et autorisation',
    endpoint: '/api/auth/health',
    details: {
      cpu: 12,
      memoire: 34
    }
  },
  {
    id: '3',
    nom: 'Service de Vote',
    statut: 'DEGRADED',
    tempsReponse: 340,
    derniereVerification: new Date(Date.now() - 10000).toISOString(),
    description: 'Service principal de gestion des votes',
    endpoint: '/api/votes/health',
    details: {
      cpu: 78,
      memoire: 89,
      connexions: 145
    }
  },
  {
    id: '4',
    nom: 'Cache Redis',
    statut: 'HEALTHY',
    tempsReponse: 12,
    derniereVerification: new Date(Date.now() - 25000).toISOString(),
    description: 'Cache Redis pour les sessions utilisateurs',
    endpoint: 'redis://localhost:6379',
    details: {
      memoire: 45,
      connexions: 23
    }
  },
  {
    id: '5',
    nom: 'Service Email',
    statut: 'UNHEALTHY',
    tempsReponse: 5000,
    derniereVerification: new Date(Date.now() - 120000).toISOString(),
    description: 'Service d\'envoi d\'emails et notifications',
    endpoint: '/api/email/health',
    details: {
      cpu: 95,
      memoire: 67
    }
  },
  {
    id: '6',
    nom: 'Stockage Fichiers',
    statut: 'HEALTHY',
    tempsReponse: 89,
    derniereVerification: new Date(Date.now() - 45000).toISOString(),
    description: 'Système de stockage des documents et images',
    endpoint: '/api/storage/health',
    details: {
      disque: 73,
      cpu: 15,
      memoire: 28
    }
  },
  {
    id: '7',
    nom: 'Service Rapports',
    statut: 'HEALTHY',
    tempsReponse: 156,
    derniereVerification: new Date(Date.now() - 60000).toISOString(),
    description: 'Génération des rapports et statistiques',
    endpoint: '/api/reports/health',
    details: {
      cpu: 34,
      memoire: 56
    }
  },
  {
    id: '8',
    nom: 'Load Balancer',
    statut: 'DEGRADED',
    tempsReponse: 234,
    derniereVerification: new Date(Date.now() - 20000).toISOString(),
    description: 'Répartiteur de charge nginx',
    endpoint: '/health',
    details: {
      connexions: 1250,
      cpu: 67,
      memoire: 45
    }
  }
];

export const mockSystemHealth: SystemHealth = {
  statusGlobal: 'DEGRADED',
  score: 76,
  tempsReponseTotal: 156,
  servicesActifs: 6,
  servicesTotal: 8
};

export const mockHealthHistory = [
  { timestamp: new Date(Date.now() - 3600000).toISOString(), score: 98 },
  { timestamp: new Date(Date.now() - 3000000).toISOString(), score: 95 },
  { timestamp: new Date(Date.now() - 2400000).toISOString(), score: 87 },
  { timestamp: new Date(Date.now() - 1800000).toISOString(), score: 76 },
  { timestamp: new Date(Date.now() - 1200000).toISOString(), score: 82 },
  { timestamp: new Date(Date.now() - 600000).toISOString(), score: 76 },
  { timestamp: new Date().toISOString(), score: 76 }
];

export const getHealthStatusColor = (status: string): string => {
  const colors = {
    'HEALTHY': '#28A745',
    'DEGRADED': '#FFC107', 
    'UNHEALTHY': '#DC3545'
  };
  return colors[status as keyof typeof colors] || '#6C757D';
};

export const getHealthStatusIcon = (status: string): string => {
  const icons = {
    'HEALTHY': 'checkmark-circle',
    'DEGRADED': 'warning',
    'UNHEALTHY': 'close-circle'
  };
  return icons[status as keyof typeof icons] || 'help-circle';
};

export const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}j ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const calculateAverageResponseTime = (healthChecks: HealthCheck[]): number => {
  const total = healthChecks.reduce((sum, check) => sum + check.tempsReponse, 0);
  return Math.round(total / healthChecks.length);
};