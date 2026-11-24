// ბინების საცდელი მონაცემები. რეალურ პროექტში ეს სია მოვა JSON-დან ან Firebase/Supabase-დან.
// აქ გენერირდება დეტერმინისტულად (ყოველ ჩატვირთვაზე ერთნაირი), რომ ფილტრები და გვერდები შეამოწმო.

export const apartmentTypes = [
  { bedrooms: 0, label: 'სტუდიო', area: [38, 50], balcony: [3, 6] },
  { bedrooms: 1, label: 'ერთსაძინებლიანი', area: [55, 84], balcony: [4, 18] },
  { bedrooms: 2, label: 'ორსაძინებლიანი', area: [86, 125], balcony: [6, 22] },
  { bedrooms: 3, label: 'სამსაძინებლიანი', area: [130, 235], balcony: [12, 98] },
];

// რომელ პროექტს ეკუთვნის ბინები (id — homeData.js-ის projects სიიდან)
export const APARTMENTS_PROJECT_ID = 1;

export const blocks = ['A', 'B', 'C'];
export const floors = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const statusList = [
  { value: 'free', label: 'თავისუფალი' },
  { value: 'reserved', label: 'დაჯავშნილი' },
  { value: 'sold', label: 'გაყიდული' },
];

export const statusLabel = Object.fromEntries(statusList.map((s) => [s.value, s.label]));

export const typeLabel = Object.fromEntries(apartmentTypes.map((t) => [t.bedrooms, t.label]));

// მარტივი seed-იანი random, რომ მონაცემები არ შეიცვალოს
function createRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

const round1 = (n) => Math.round(n * 10) / 10;

function generateApartments() {
  const random = createRandom(42);
  const between = ([min, max]) => min + random() * (max - min);
  const list = [];

  blocks.forEach((block) => {
    floors.forEach((floor) => {
      for (let n = 1; n <= 2; n += 1) {
        const type = apartmentTypes[Math.floor(random() * apartmentTypes.length)];
        const balconyArea = round1(between(type.balcony));
        const livingArea = round1(between(type.area));
        const area = round1(livingArea + balconyArea);
        const pricePerSqm = 1400 + Math.round(random() * 500) + floor * 15;
        const r = random();
        const status = r < 0.62 ? 'free' : r < 0.8 ? 'reserved' : 'sold';

        list.push({
          id: `${block}-${floor}0${n}`,
          projectId: APARTMENTS_PROJECT_ID,
          block,
          floor,
          bedrooms: type.bedrooms,
          area,
          livingArea,
          balconyArea,
          price: Math.round((area * pricePerSqm) / 100) * 100,
          status,
          mirrored: random() > 0.5,
        });
      }
    });
  });

  return list;
}

export const allApartments = generateApartments();

export const areaBounds = {
  min: Math.floor(Math.min(...allApartments.map((a) => a.area))),
  max: Math.ceil(Math.max(...allApartments.map((a) => a.area))),
};
