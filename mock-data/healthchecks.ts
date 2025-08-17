import { HealthCheckDTO } from '../lib/models/HealthCheckDTO';
import { HealthStatusDTO } from '../lib/models/HealthStatusDTO';

export const mockHealthCheck: HealthCheckDTO = {
  status: 'DEGRADED',
  timestamp: new Date().toISOString(),
  application: 'Civix Mobile App',
  version: '1.0.0',
  uptime: '2 days, 4 hours, 32 minutes',
  services: {
    'Base de Données': {
      healthy: true,
      message: 'Connexion à la base de données PostgreSQL',
      responseTime: 45,
    },
    'API Authentification': {
      healthy: true,
      message: "Service d'authentification et autorisation",
      responseTime: 78,
    },
    'Service de Vote': {
      healthy: false,
      message: 'Service principal de gestion des votes',
      responseTime: 340,
    },
    'Cache Redis': {
      healthy: true,
      message: 'Cache Redis pour les sessions utilisateurs',
      responseTime: 12,
    },
    'Service Email': {
      healthy: false,
      message: "Service d'envoi d'emails et notifications",
      responseTime: 5000,
    },
    'Stockage Fichiers': {
      healthy: true,
      message: 'Système de stockage des documents et images',
      responseTime: 89,
    },
    'Service Rapports': {
      healthy: true,
      message: 'Génération des rapports et statistiques',
      responseTime: 156,
    },
    'Load Balancer': {
      healthy: false,
      message: 'Répartiteur de charge nginx',
      responseTime: 234,
    },
  },
};
