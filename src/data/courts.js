export const COURTS = [
  {
    id: 'c1',
    name: 'Court 1 – Centre',
    surface: 'Hard',
    indoor: false,
    lights: true,
    pricePerHour: 12,
    description: 'Main showcase court with spectator seating.',
    image: null,
  },
  {
    id: 'c2',
    name: 'Court 2 – Clay',
    surface: 'Clay',
    indoor: false,
    lights: true,
    pricePerHour: 10,
    description: 'Slow red clay surface, ideal for baseline play.',
    image: null,
  },
  {
    id: 'c3',
    name: 'Court 3 – Grass',
    surface: 'Grass',
    indoor: false,
    lights: false,
    pricePerHour: 14,
    description: 'Natural grass, available spring/summer only.',
    image: null,
  },
  {
    id: 'c4',
    name: 'Court 4 – Indoor Hard',
    surface: 'Hard',
    indoor: true,
    lights: true,
    pricePerHour: 18,
    description: 'Covered indoor court, available year-round.',
    image: null,
  },
];

export const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00',
];

export const SURFACE_COLORS = {
  Hard:  'bg-blue-100 text-blue-800',
  Clay:  'bg-orange-100 text-orange-800',
  Grass: 'bg-green-100 text-green-800',
};
