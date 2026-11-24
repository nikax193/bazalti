import { publicUrl } from '../utils/publicUrl';

// ყველა ტექსტი და მონაცემი ერთ ადგილას — მომავალში ადვილად გადავა Firebase/Supabase-ზე.
// სურათები: ჩააგდე ფაილები public/images/ საქაღალდეში იმავე სახელებით.
// სანამ სურათი არ არის, ნაჩვენები იქნება გრადიენტი (fallback).

export const company = {
  name: 'ბაზალტი',
  fullName: 'ბაზალტი დეველოპმენტი',
  phone: '+995 32 2 00 00 00',
  email: 'info@bazalti.ge',
  address: 'ვაჟა-ფშაველას გამზ. N45, თბილისი',
  mapCoords: { lat: 41.7255, lng: 44.7469 },
};

// type: 'route' — ცალკე გვერდი; 'section' — მთავარი გვერდის სექცია (/#id)
export const navLinks = [
  { label: 'მთავარი', to: '/', type: 'route' },
  { label: 'პროექტები', to: '/#projects', type: 'section' },
  { label: 'ბინები', to: '/apartments', type: 'route' },
  { label: 'ჩვენ შესახებ', to: '/#about', type: 'section' },
  { label: 'კონტაქტი', to: '/#contact', type: 'section' },
];

export const heroSlides = [
  {
    id: 1,
    title: 'საცხოვრებელი კომპლექსი ვაკეში',
    text: 'დაბალსართულიანი, ტერასული კორპუსი მწვანე ეზოთი. 3.2 მეტრიანი ჭერი, პანორამული მინა და ხმის იზოლაცია თითოეულ ბინაში.',
    image: publicUrl('images/hero-1.jpg'),
    gradient: 'linear-gradient(135deg, #8a9a6b 0%, #4f6b4a 45%, #2b4136 100%)',
    cardLabel: 'სულ სხვა ცხოვრება',
  },
  {
    id: 2,
    title: 'ბიზნეს ცენტრი საბურთალოზე',
    text: 'თანამედროვე საოფისე სივრცეები ქალაქის ცენტრში, მიწისქვეშა პარკინგით და სახურავის ტერასით.',
    image: publicUrl('images/hero-2.jpg'),
    gradient: 'linear-gradient(135deg, #5b6f7a 0%, #34454f 50%, #1d2a31 100%)',
    cardLabel: 'სულ სხვა არქიტექტურა',
  },
  {
    id: 3,
    title: 'ეზოიანი კორპუსი დიღომში',
    text: 'ოჯახებისთვის შექმნილი სივრცე: საბავშვო მოედანი, დახურული ეზო და ბუნებასთან სიახლოვე.',
    image: publicUrl('images/hero-3.jpg'),
    gradient: 'linear-gradient(135deg, #b39a6a 0%, #7c6a45 50%, #3f3a2a 100%)',
    cardLabel: 'სულ სხვა ლანდშაფტი',
  },
];

export const aboutImage = {
  image: publicUrl('images/about.jpg'),
  alt: 'მშენებარე კორპუსი ამწით',
  gradient: 'linear-gradient(160deg, #a9b7b9 0%, #6f7d78 55%, #3a4440 100%)',
};

export const aboutStats = [
  { value: '12+', label: 'წელი ბაზარზე' },
  { value: '18', label: 'დასრულებული პროექტი' },
  { value: '1 400+', label: 'ბედნიერი ოჯახი' },
  { value: '4', label: 'პარტნიორი ბანკი' },
];

export const specialOffers = [
  {
    id: 1,
    badge: '-10%',
    title: 'ფასდაკლება სრულ გადახდაზე',
    text: 'ერთიანი გადახდისას მიიღე 10%-იანი ფასდაკლება ნებისმიერ თავისუფალ ბინაზე.',
  },
  {
    id: 2,
    badge: '0%',
    title: 'შიდა განვადება 24 თვით',
    text: 'პირველადი შენატანი 20%-დან, დარჩენილი თანხა — უპროცენტოდ, 2 წლის განმავლობაში.',
  },
  {
    id: 3,
    badge: 'საჩუქარი',
    title: 'პარკინგის ადგილი საჩუქრად',
    text: '3-ოთახიანი და უფრო დიდი ბინის შეძენისას მიწისქვეშა პარკინგი საჩუქრად.',
  },
];

export const projects = [
  {
    id: 1,
    title: 'ვაკის საცხოვრებელი კომპლექსი',
    location: 'თბილისი, ვაკე',
    status: 'ongoing',
    deadline: '2027 წლის IV კვარტალი',
    image: publicUrl('images/project-1.jpg'),
    gradient: 'linear-gradient(160deg, #9fae7c 0%, #5c7550 55%, #2c4237 100%)',
  },
  {
    id: 2,
    title: 'საბურთალოს ბიზნეს ცენტრი',
    location: 'თბილისი, საბურთალო',
    status: 'ongoing',
    deadline: '2027 წლის II კვარტალი',
    image: publicUrl('images/project-2.jpg'),
    gradient: 'linear-gradient(160deg, #8796a0 0%, #4c5d68 55%, #26333b 100%)',
  },
  {
    id: 3,
    title: 'დიღმის ეზო',
    location: 'თბილისი, დიღომი',
    status: 'ongoing',
    deadline: '2026 წლის IV კვარტალი',
    image: publicUrl('images/project-3.jpg'),
    gradient: 'linear-gradient(160deg, #c4ad80 0%, #8c7652 55%, #45392a 100%)',
  },
  {
    id: 4,
    title: 'ბათუმის რეზიდენცია',
    location: 'ბათუმი',
    status: 'completed',
    deadline: 'ჩაბარდა 2024 წელს',
    image: publicUrl('images/project-4.jpg'),
    gradient: 'linear-gradient(160deg, #86aab0 0%, #4c7379 55%, #234044 100%)',
  },
  {
    id: 5,
    title: 'ქუთაისის ბაღები',
    location: 'ქუთაისი',
    status: 'completed',
    deadline: 'ჩაბარდა 2023 წელს',
    image: publicUrl('images/project-5.jpg'),
    gradient: 'linear-gradient(160deg, #a7b48e 0%, #6b7a57 55%, #343d2b 100%)',
  },
  {
    id: 6,
    title: 'წყნეთის ვილები',
    location: 'წყნეთი',
    status: 'completed',
    deadline: 'ჩაბარდა 2022 წელს',
    image: publicUrl('images/project-6.jpg'),
    gradient: 'linear-gradient(160deg, #b8a58f 0%, #7d6a57 55%, #3d332a 100%)',
  },
];

export const galleryImages = [
  { id: 1, alt: 'ლობი და აუზი', image: publicUrl('images/gallery-1.jpg'), gradient: 'linear-gradient(135deg, #6f6658, #2f2a24)' },
  { id: 2, alt: 'შიდა ეზო', image: publicUrl('images/gallery-2.jpg'), gradient: 'linear-gradient(135deg, #a5b38a, #4e6047)' },
  { id: 3, alt: 'ფასადი', image: publicUrl('images/gallery-3.jpg'), gradient: 'linear-gradient(135deg, #c7b07d, #6d5c3c)' },
  { id: 4, alt: 'ფიტნეს ზონა', image: publicUrl('images/gallery-4.jpg'), gradient: 'linear-gradient(135deg, #9c8c74, #463d31)' },
];

export const footerLinks = [
  [
    { label: 'ჩვენ შესახებ', href: '/#about' },
    { label: 'პროექტები', href: '/#projects' },
    { label: 'ბინების შერჩევა', href: '/apartments' },
  ],
  [
    { label: 'გალერეა', href: '/#gallery' },
    { label: 'კონტაქტი', href: '/#contact' },
    { label: 'კონფიდენციალურობის პოლიტიკა', href: '#' },
  ],
];
