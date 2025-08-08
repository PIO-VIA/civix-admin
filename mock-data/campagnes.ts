export const mockCampagnes = [
  {
    id: '1',
    nom: 'Campagne Présidentielle 2024',
    candidatId: '1',
    candidatNom: 'Marie Dupont',
    electionId: '1',
    budget: 15000000,
    budgetUtilise: 12500000,
    dateDebut: '2024-01-15T00:00:00Z',
    dateFin: '2024-03-31T23:59:59Z',
    statut: 'ACTIVE',
    objectifs: [
      { nom: 'Meetings publics', progres: 85, total: 50 },
      { nom: 'Spots TV/Radio', progres: 92, total: 100 },
      { nom: 'Réseaux sociaux', progres: 78, total: 200 }
    ],
    equipe: 125,
    evenements: 48,
    couleurTheme: '#FF6B6B'
  },
  {
    id: '2',
    nom: 'Campagne Alternative',
    candidatId: '2',
    candidatNom: 'Jean Martin',
    electionId: '1',
    budget: 18000000,
    budgetUtilise: 15200000,
    dateDebut: '2024-01-10T00:00:00Z',
    dateFin: '2024-03-31T23:59:59Z',
    statut: 'ACTIVE',
    objectifs: [
      { nom: 'Meetings publics', progres: 76, total: 45 },
      { nom: 'Spots TV/Radio', progres: 88, total: 95 },
      { nom: 'Réseaux sociaux', progres: 95, total: 180 }
    ],
    equipe: 145,
    evenements: 52,
    couleurTheme: '#4ECDC4'
  },
  {
    id: '3',
    nom: 'Campagne Écologique',
    candidatId: '3',
    candidatNom: 'Sophie Bernard',
    electionId: '1',
    budget: 8500000,
    budgetUtilise: 6200000,
    dateDebut: '2024-02-01T00:00:00Z',
    dateFin: '2024-03-31T23:59:59Z',
    statut: 'ACTIVE',
    objectifs: [
      { nom: 'Meetings publics', progres: 65, total: 35 },
      { nom: 'Spots TV/Radio', progres: 72, total: 60 },
      { nom: 'Réseaux sociaux', progres: 89, total: 150 }
    ],
    equipe: 89,
    evenements: 31,
    couleurTheme: '#45B7D1'
  }
];

export const mockStatistiquesCampagnes = {
  totalCampagnes: 12,
  campagnesActives: 8,
  budgetTotal: 125000000,
  budgetUtilise: 98500000,
  tauxReussite: 73.2,
  performanceMoyenne: 78.5
};