export const mockCandidats = [
  {
    id: '1',
    nom: 'Marie Dupont',
    prenom: 'Marie',
    parti: 'Parti de la République',
    photo: 'https://via.placeholder.com/100x100',
    age: 52,
    profession: 'Maire de Lyon',
    email: 'marie.dupont@email.com',
    telephone: '+33 1 23 45 67 89',
    programme: 'Réforme économique et sociale',
    soutiens: 2850000,
    votes: 12500000,
    pourcentage: 38.6,
    statut: 'VALIDE',
    dateNaissance: '1972-03-15',
    lieuNaissance: 'Lyon, France',
    biographie: 'Ancienne ministre de l\'Économie, maire de Lyon depuis 2014.',
    reseauxSociaux: {
      twitter: '@marie_dupont',
      facebook: 'marie.dupont.officiel',
      instagram: 'marie_dupont_2024'
    },
    campagne: {
      budget: 15000000,
      meetings: 48,
      equipe: 125
    }
  },
  {
    id: '2',
    nom: 'Jean Martin',
    prenom: 'Jean',
    parti: 'Mouvement Démocrate',
    photo: 'https://via.placeholder.com/100x100',
    age: 47,
    profession: 'Député européen',
    email: 'jean.martin@email.com',
    telephone: '+33 1 34 56 78 90',
    programme: 'Europe forte et unie',
    soutiens: 2650000,
    votes: 11200000,
    pourcentage: 34.6,
    statut: 'VALIDE',
    dateNaissance: '1977-07-22',
    lieuNaissance: 'Marseille, France',
    biographie: 'Député européen depuis 2019, ancien président de région.',
    reseauxSociaux: {
      twitter: '@jean_martin_eu',
      facebook: 'jean.martin.europe',
      instagram: 'jean_martin_officiel'
    },
    campagne: {
      budget: 18000000,
      meetings: 52,
      equipe: 145
    }
  },
  {
    id: '3',
    nom: 'Sophie Bernard',
    prenom: 'Sophie',
    parti: 'Les Verts',
    photo: 'https://via.placeholder.com/100x100',
    age: 44,
    profession: 'Députée',
    email: 'sophie.bernard@email.com',
    telephone: '+33 1 45 67 89 01',
    programme: 'Transition écologique et justice sociale',
    soutiens: 1850000,
    votes: 5800000,
    pourcentage: 17.9,
    statut: 'VALIDE',
    dateNaissance: '1980-11-08',
    lieuNaissance: 'Toulouse, France',
    biographie: 'Députée depuis 2017, militante écologiste reconnue.',
    reseauxSociaux: {
      twitter: '@sophie_bernard',
      facebook: 'sophie.bernard.verts',
      instagram: 'sophie_bernard_ecolo'
    },
    campagne: {
      budget: 8500000,
      meetings: 31,
      equipe: 89
    }
  },
  {
    id: '4',
    nom: 'Pierre Moreau',
    prenom: 'Pierre',
    parti: 'Rassemblement National',
    photo: 'https://via.placeholder.com/100x100',
    age: 55,
    profession: 'Sénateur',
    email: 'pierre.moreau@email.com',
    telephone: '+33 1 56 78 90 12',
    programme: 'Sécurité et souveraineté',
    soutiens: 1650000,
    votes: 2900000,
    pourcentage: 8.9,
    statut: 'VALIDE',
    dateNaissance: '1969-04-12',
    lieuNaissance: 'Nice, France',
    biographie: 'Sénateur depuis 2014, ancien avocat.',
    reseauxSociaux: {
      twitter: '@pierre_moreau',
      facebook: 'pierre.moreau.rn',
      instagram: 'pierre_moreau_2024'
    },
    campagne: {
      budget: 5200000,
      meetings: 28,
      equipe: 67
    }
  }
];

export const mockStatistiquesCandidat = {
  totalCandidats: 12,
  candidatsValides: 8,
  candidatsEnAttente: 3,
  candidatsRejects: 1,
  moyenneAge: 48.7,
  repartitionGenre: {
    hommes: 58,
    femmes: 42
  }
};