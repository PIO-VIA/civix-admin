export const mockDashboardData = {
  statistiquesGenerales: {
    totalElections: 12,
    electionsActives: 3,
    totalElecteurs: 47500000,
    tauxParticipation: 68.2,
    totalCandidats: 24,
    totalCampagnes: 18
  },
  
  alertes: [
    {
      id: '1',
      type: 'WARNING',
      titre: 'Taux de participation faible',
      message: 'Le taux de participation est en baisse de 5% par rapport à la dernière élection',
      timestamp: '2024-04-01T10:30:00Z',
      lu: false
    },
    {
      id: '2',
      type: 'INFO',
      titre: 'Nouveau candidat enregistré',
      message: 'Paul Rousseau a soumis sa candidature pour les élections européennes',
      timestamp: '2024-04-01T08:15:00Z',
      lu: false
    },
    {
      id: '3',
      type: 'ERROR',
      titre: 'Problème technique bureau 15',
      message: 'Dysfonctionnement signalé sur les machines à voter du bureau 15',
      timestamp: '2024-04-01T12:45:00Z',
      lu: true
    }
  ],

  activitesRecentes: [
    {
      id: '1',
      action: 'Vote enregistré',
      utilisateur: 'Claire Dubois',
      timestamp: '2024-04-01T14:30:00Z',
      details: 'Élection Présidentielle 2024 - Bureau 12'
    },
    {
      id: '2',
      action: 'Candidature validée',
      utilisateur: 'Admin System',
      timestamp: '2024-04-01T13:20:00Z',
      details: 'Marie Dupont - Élection Présidentielle'
    },
    {
      id: '3',
      action: 'Campagne créée',
      utilisateur: 'Jean Martin',
      timestamp: '2024-04-01T11:45:00Z',
      details: 'Campagne Alternative - Budget: 18M€'
    },
    {
      id: '4',
      action: 'Bureau ouvert',
      utilisateur: 'Responsable Bureau',
      timestamp: '2024-04-01T08:00:00Z',
      details: 'Bureau 7 - Mairie du 2ème arrondissement'
    }
  ],

  metriques: {
    votesParlHeure: [
      { heure: '8h', votes: 1250 },
      { heure: '9h', votes: 2800 },
      { heure: '10h', votes: 3650 },
      { heure: '11h', votes: 4200 },
      { heure: '12h', votes: 3100 },
      { heure: '13h', votes: 2900 },
      { heure: '14h', votes: 4800 },
      { heure: '15h', votes: 5200 }
    ],
    repartitionVotes: [
      { candidat: 'Marie Dupont', votes: 12500000, couleur: '#FF6B6B' },
      { candidat: 'Jean Martin', votes: 11200000, couleur: '#4ECDC4' },
      { candidat: 'Sophie Bernard', votes: 5800000, couleur: '#45B7D1' },
      { candidat: 'Pierre Moreau', votes: 2900000, couleur: '#FFA07A' }
    ]
  },

  performanceSysteme: {
    tempsReponse: 127, // ms
    disponibilite: 99.8, // %
    chargeServeur: 45, // %
    connexionsActives: 15420
  }
};