import { DashboardAdminDTO } from '../lib/models/DashboardAdminDTO';

export const mockDashboardAdmin: DashboardAdminDTO = {
  statistiquesAdmin: {
    totalElecteurs: 47500000,
    electeursAyantVote: 32394000,
    totalCandidats: 24,
    totalCampagnes: 18,
    totalVotes: 32394000,
    tauxParticipation: 68.2,
  },
  resultatsDetailles: [
    {
      candidat: {
        externalIdCandidat: '1',
        username: 'Marie Dupont',
      },
      nombreVotes: 12500000,
      pourcentageVotes: 38.59,
      rang: 1,
    },
    {
      candidat: {
        externalIdCandidat: '2',
        username: 'Jean Martin',
      },
      nombreVotes: 11200000,
      pourcentageVotes: 34.57,
      rang: 2,
    },
    {
      candidat: {
        externalIdCandidat: '3',
        username: 'Sophie Bernard',
      },
      nombreVotes: 5800000,
      pourcentageVotes: 17.9,
      rang: 3,
    },
    {
      candidat: {
        externalIdCandidat: '4',
        username: 'Pierre Moreau',
      },
      nombreVotes: 2900000,
      pourcentageVotes: 8.95,
      rang: 4,
    },
  ],
  analyseTemporelle: [
    { periode: '8h', nombreVotes: 1250 },
    { periode: '9h', nombreVotes: 2800 },
    { periode: '10h', nombreVotes: 3650 },
    { periode: '11h', nombreVotes: 4200 },
    { periode: '12h', nombreVotes: 3100 },
    { periode: '13h', nombreVotes: 2900 },
    { periode: '14h', nombreVotes: 4800 },
    { periode: '15h', nombreVotes: 5200 },
  ],
  statistiquesCandidats: [
    {
      candidatId: '1',
      nomCandidat: 'Marie Dupont',
      nombreVotes: 12500000,
      nombreCampagnes: 2,
      pourcentageVotes: 38.59,
      rang: 1,
    },
  ],
  statistiquesCampagnes: {
    totalCampagnes: 18,
    campagnesAvecPhotos: 15,
    candidatsAvecCampagnes: 20,
    longueurMoyenneDescription: 150,
    tauxCampagnesAvecPhotos: 83.33,
  },
  alertes: [
    {
      type: 'WARNING',
      titre: 'Taux de participation faible',
      message: 'Le taux de participation est en baisse de 5% par rapport à la dernière élection',
      niveau: 'Moyen',
      horodatage: '2024-04-01T10:30:00Z',
    },
    {
      type: 'INFO',
      titre: 'Nouveau candidat enregistré',
      message: 'Paul Rousseau a soumis sa candidature pour les élections européennes',
      niveau: 'Faible',
      horodatage: '2024-04-01T08:15:00Z',
    },
  ],
  metriquesPerformance: {
    requestsPerSecond: 120,
    averageResponseTime: 127,
    errorRate: 0.1,
    throughput: '10 Mbps',
  },
  actionsRecentes: [
    {
      id: '1',
      action: 'Vote enregistré',
      utilisateur: 'Claire Dubois',
      horodatage: '2024-04-01T14:30:00Z',
      statut: 'Succès',
    },
    {
      id: '2',
      action: 'Candidature validée',
      utilisateur: 'Admin System',
      horodatage: '2024-04-01T13:20:00Z',
      statut: 'Succès',
    },
  ],
  resumeExecutif: "La participation est modérée, avec une forte mobilisation en milieu de journée. Marie Dupont mène actuellement, mais l'écart se resserre. Le système est stable.",
  derniereMiseAJour: new Date().toISOString(),
};