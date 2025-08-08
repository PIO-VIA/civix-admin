export const mockElections = [
  {
    id: '1',
    nom: 'Élection Présidentielle 2024',
    description: 'Élection présidentielle française',
    dateDebut: '2024-04-01T08:00:00Z',
    dateFin: '2024-04-01T20:00:00Z',
    statut: 'EN_COURS',
    typeElection: 'PRESIDENTIELLE',
    nombreElecteurs: 47500000,
    tauxParticipation: 68.2,
    resultat: {
      totalVotes: 32394000,
      votesBlancs: 1250000,
      votesNuls: 345000
    }
  },
  {
    id: '2',
    nom: 'Élections Municipales Paris',
    description: 'Élections municipales de la ville de Paris',
    dateDebut: '2024-03-15T08:00:00Z',
    dateFin: '2024-03-15T20:00:00Z',
    statut: 'TERMINEE',
    typeElection: 'MUNICIPALE',
    nombreElecteurs: 1650000,
    tauxParticipation: 74.5,
    resultat: {
      totalVotes: 1229250,
      votesBlancs: 89000,
      votesNuls: 23500
    }
  },
  {
    id: '3',
    nom: 'Élections Européennes 2024',
    description: 'Élections au Parlement européen',
    dateDebut: '2024-06-09T08:00:00Z',
    dateFin: '2024-06-09T20:00:00Z',
    statut: 'PROGRAMMEE',
    typeElection: 'EUROPEENNE',
    nombreElecteurs: 47800000,
    tauxParticipation: 0,
    resultat: null
  }
];

export const mockResultats = [
  {
    electionId: '1',
    candidatId: '1',
    nom: 'Marie Dupont',
    votes: 12500000,
    pourcentage: 38.6
  },
  {
    electionId: '1',
    candidatId: '2', 
    nom: 'Jean Martin',
    votes: 11200000,
    pourcentage: 34.6
  },
  {
    electionId: '1',
    candidatId: '3',
    nom: 'Sophie Bernard',
    votes: 5800000,
    pourcentage: 17.9
  }
];