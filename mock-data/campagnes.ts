import { CampagneDTO } from '../lib/models/CampagneDTO';

export const mockCampagnes: CampagneDTO[] = [
  {
    externalIdCampagne: '1',
    description: 'Campagne Présidentielle 2024',
    photo: 'https://via.placeholder.com/300x100',
    candidat: {
      externalIdCandidat: '1',
      username: 'Marie Dupont',
    },
  },
  {
    externalIdCampagne: '2',
    description: 'Campagne Alternative',
    photo: 'https://via.placeholder.com/300x100',
    candidat: {
      externalIdCandidat: '2',
      username: 'Jean Martin',
    },
  },
  {
    externalIdCampagne: '3',
    description: 'Campagne Écologique',
    photo: 'https://via.placeholder.com/300x100',
    candidat: {
      externalIdCandidat: '3',
      username: 'Sophie Bernard',
    },
  },
  {
    externalIdCampagne: '4',
    description: 'Sécurité et Souveraineté',
    photo: 'https://via.placeholder.com/300x100',
    candidat: {
      externalIdCandidat: '4',
      username: 'Pierre Moreau',
    },
  },
];
