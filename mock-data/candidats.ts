import { CandidatDTO } from '../lib/models/CandidatDTO';

export const mockCandidats: CandidatDTO[] = [
  {
    externalIdCandidat: '1',
    username: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    description: 'Ancienne ministre de l\'Économie, maire de Lyon depuis 2014.',
    photo: 'https://via.placeholder.com/100x100',
    campagnes: [
      {
        externalIdCampagne: 'camp-1',
        description: 'Campagne présidentielle 2024',
        photo: 'https://via.placeholder.com/150x50',
      },
      {
        externalIdCampagne: 'camp-2',
        description: 'Levée de fonds pour l\'éducation',
        photo: 'https://via.placeholder.com/150x50',
      },
    ],
  },
  {
    externalIdCandidat: '2',
    username: 'Jean Martin',
    email: 'jean.martin@email.com',
    description: 'Député européen depuis 2019, ancien président de région.',
    photo: 'https://via.placeholder.com/100x100',
    campagnes: [
      {
        externalIdCampagne: 'camp-3',
        description: 'Pour une Europe plus forte',
        photo: 'https://via.placeholder.com/150x50',
      },
    ],
  },
  {
    externalIdCandidat: '3',
    username: 'Sophie Bernard',
    email: 'sophie.bernard@email.com',
    description: 'Députée depuis 2017, militante écologiste reconnue.',
    photo: 'https://via.placeholder.com/100x100',
    campagnes: [
      {
        externalIdCampagne: 'camp-4',
        description: 'Transition écologique maintenant',
        photo: 'https://via.placeholder.com/150x50',
      },
    ],
  },
  {
    externalIdCandidat: '4',
    username: 'Pierre Moreau',
    email: 'pierre.moreau@email.com',
    description: 'Sénateur depuis 2014, ancien avocat.',
    photo: 'https://via.placeholder.com/100x100',
    campagnes: [],
  },
];
