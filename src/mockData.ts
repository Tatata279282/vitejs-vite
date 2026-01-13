import { Member, Activity } from './types';

export const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Александр Волков',
    avatar: 'https://picsum.photos/seed/volkov/200',
    role: 'Заместитель председателя',
    committee: 'Комитет по спорту и туризму',
    efficiency: 92,
    login: 'volkov',
    password: '123',
    bio: 'Активный участник молодежных форумов.',
    scores: {
      attendance: 98,
      mediaActivity: 85,
      projects: 95,
      communityWork: 90,
      initiative: 92,
    },
    activities: [
      {
        id: 'a1',
        date: '2023-11-15',
        title: 'Организация турнира',
        type: 'project',
        points: 15,
        status: 'verified',
        memberId: '1',
      },
      {
        id: 'p1',
        date: '2024-05-10',
        title: 'Новый Эко-проект',
        type: 'project',
        points: 20,
        status: 'pending',
        description: 'Заявка на новый проект по очистке парков.',
        memberId: '1',
      },
    ],
  },
  {
    id: '2',
    name: 'Елена Смирнова',
    avatar: 'https://picsum.photos/seed/smirnova/200',
    role: 'Член парламента',
    committee: 'Комитет по культуре',
    efficiency: 88,
    login: 'smirnova',
    password: '123',
    bio: 'Координатор образовательных программ.',
    scores: {
      attendance: 90,
      mediaActivity: 95,
      projects: 80,
      communityWork: 85,
      initiative: 90,
    },
    activities: [],
  },
];

export const ADMIN_CREDENTIALS = {
  login: 'admin',
  password: 'admin',
};
