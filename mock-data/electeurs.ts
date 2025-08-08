export const mockElecteurs = [
  {
    id: '1',
    nom: 'Dubois',
    prenom: 'Claire',
    email: 'claire.dubois@email.com',
    telephone: '+33 6 12 34 56 78',
    dateNaissance: '1985-06-15',
    adresse: {
      rue: '25 rue de la Paix',
      ville: 'Paris',
      codePostal: '75001',
      departement: 'Paris'
    },
    statut: 'ACTIF',
    dernierVote: '2024-03-15T14:30:00Z',
    nombreVotes: 8,
    bureauVote: 'Bureau 12 - Mairie du 1er',
    genre: 'F',
    profession: 'Ingénieure'
  },
  {
    id: '2',
    nom: 'Leroy',
    prenom: 'Antoine',
    email: 'antoine.leroy@email.com',
    telephone: '+33 6 23 45 67 89',
    dateNaissance: '1978-11-22',
    adresse: {
      rue: '142 avenue des Champs',
      ville: 'Lyon',
      codePostal: '69002',
      departement: 'Rhône'
    },
    statut: 'ACTIF',
    dernierVote: '2024-03-15T16:45:00Z',
    nombreVotes: 12,
    bureauVote: 'Bureau 7 - Mairie du 2ème',
    genre: 'M',
    profession: 'Médecin'
  },
  {
    id: '3',
    nom: 'Martinez',
    prenom: 'Carmen',
    email: 'carmen.martinez@email.com',
    telephone: '+33 6 34 56 78 90',
    dateNaissance: '1992-03-08',
    adresse: {
      rue: '78 boulevard Saint-Germain',
      ville: 'Marseille',
      codePostal: '13001',
      departement: 'Bouches-du-Rhône'
    },
    statut: 'ACTIF',
    dernierVote: '2024-03-15T11:20:00Z',
    nombreVotes: 5,
    bureauVote: 'Bureau 15 - École Primaire',
    genre: 'F',
    profession: 'Professeure'
  },
  {
    id: '4',
    nom: 'Dupont',
    prenom: 'Michel',
    email: 'michel.dupont@email.com',
    telephone: '+33 6 45 67 89 01',
    dateNaissance: '1965-09-18',
    adresse: {
      rue: '33 rue Victor Hugo',
      ville: 'Toulouse',
      codePostal: '31000',
      departement: 'Haute-Garonne'
    },
    statut: 'INACTIF',
    dernierVote: '2022-04-24T09:15:00Z',
    nombreVotes: 15,
    bureauVote: 'Bureau 3 - Centre Culturel',
    genre: 'M',
    profession: 'Retraité'
  }
];

export const mockStatistiquesElecteurs = {
  totalElecteurs: 47500000,
  electeursActifs: 42350000,
  electeursInactifs: 5150000,
  nouveauxElecteurs: 285000,
  repartitionAge: {
    '18-25': 12.5,
    '26-35': 18.2,
    '36-45': 22.8,
    '46-55': 21.3,
    '56-65': 15.7,
    '65+': 9.5
  },
  repartitionGenre: {
    hommes: 48.7,
    femmes: 51.3
  },
  participationMoyenne: 68.4,
  tauxInscription: 89.2
};