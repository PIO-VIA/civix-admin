import { ElecteurDTO } from '../lib/models/ElecteurDTO';

export const mockElecteurs: ElecteurDTO[] = [
  {
    externalIdElecteur: '1',
    username: 'Claire Dubois',
    email: 'claire.dubois@email.com',
    empreinteDigitale: 'empreinte-digitale-1-xyz',
    avote: true,
  },
  {
    externalIdElecteur: '2',
    username: 'Antoine Leroy',
    email: 'antoine.leroy@email.com',
    empreinteDigitale: 'empreinte-digitale-2-abc',
    avote: true,
  },
  {
    externalIdElecteur: '3',
    username: 'Carmen Martinez',
    email: 'carmen.martinez@email.com',
    empreinteDigitale: 'empreinte-digitale-3-def',
    avote: true,
  },
  {
    externalIdElecteur: '4',
    username: 'Michel Dupont',
    email: 'michel.dupont@email.com',
    empreinteDigitale: 'empreinte-digitale-4-ghi',
    avote: false,
  },
  {
    externalIdElecteur: '5',
    username: 'Aisha Diallo',
    email: 'aisha.diallo@email.com',
    empreinteDigitale: 'empreinte-digitale-5-jkl',
    avote: false,
  },
];
