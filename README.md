# ბაზალტი — სამშენებლო კომპანიის ციფრული შოურუმი

სუფთა React (JavaScript), Create React App (react-scripts). გარე ბიბლიოთეკები არ გამოიყენება — მხოლოდ react და react-dom. თითოეულ კომპონენტს თავისი საქაღალდე და თავისი CSS Module აქვს.

## გაშვება
```bash
npm install
npm start        # http://localhost:3000
npm run build    # მზა ვერსია build/ საქაღალდეში
```

## სტრუქტურა
```
public/
├── index.html       HTML შაბლონი (<div id="root">)
├── images/          სურათები
src/
├── index.js         შესასვლელი ფაილი (ReactDOM.createRoot)
├── App.jsx          მარშრუტები: /, /apartments, /apartments/:id
├── router/Router.jsx  საკუთარი როუტერი: Link, NavLink, useNavigate, useSearchParams (History API)
├── layouts/MainLayout/  Header + გვერდი + Footer (ყველა გვერდზე)
├── styles/            variables.css (ფერები, ფონტები), global.css (ღილაკები, container)
├── data/homeData.js   მთავარი გვერდის ტექსტები, პროექტები
├── data/planLayouts.js ოთახების განლაგება + ფართების გამოთვლა (getRooms)
├── data/plan3d.js     3D მოდელის გეომეტრია გეგმიდან: კედლები, კარები, ავეჯი, აივანი
├── hooks/useFavorites.js რჩეული ბინები (localStorage)
├── data/apartments.js ბინების მონაცემები (ბლოკი, სართული, ფართი, აივანი, ფასი, სტატუსი)
├── pages/Home/        Home.jsx + Home.module.css
├── pages/ApartmentDetail/ ბინის გვერდი: 2D გეგმა / 3D მოდელი / სართულის სქემა, ოთახები, PDF, მსგავსი ბინები
├── pages/Apartments/  ბინების ძებნა: Apartments.jsx, useApartmentFilters.js (ფილტრები URL-ში)
└── components/
    ├── Header/          ნავიგაცია, მობილური მენიუ, ენის ღილაკი
    ├── Hero/            სლაიდერი (ავტომატური), გვერდითი ბარათები
    ├── QuickSearch/     სწრაფი ძიება: სართული, ოთახები, ფართი, სტატუსი
    ├── AboutPreview/    მოკლე ინფო + სტატისტიკა
    ├── SpecialOffers/   სპეციალური შეთავაზებები
    ├── ProjectsSlider/  მიმდინარე / დასრულებული პროექტები
    ├── Gallery/         გალერეა + lightbox
    ├── ContactSection/  ფორმა ვალიდაციით + რუკა (OpenStreetMap)
    ├── Footer/
    ├── FloorPlan/        2D გეგმარება SVG-ში (ტიპის მიხედვით)
    ├── Apartment3D/      ბინის 3D მოდელი (CSS 3D, ბიბლიოთეკების გარეშე)
    ├── ApartmentCard/    ბინის ბარათი გრიდში (დაწკაპება → ბინის გვერდი)
    ├── ApartmentInfo/    ბინის გვერდის მარცხენა ბარათი
    ├── FloorSchema/      სართულის სქემა
    ├── InquiryForm/      მოთხოვნის ფორმა ბინაზე
    ├── ApartmentFilters/ ფილტრების ზოლი + სორტირება
    ├── FilterDropdown/   ჩამოსაშლელი ფილტრის ღილაკი
    ├── ApartmentsTable/  "სიით" ხედი
    ├── Pagination/
    ├── Breadcrumbs/
    ├── ScrollManager/    გვერდის შეცვლისას scroll / #სექციაზე გადასვლა
    ├── ImageBox/        სურათი lazy load-ით, fade-in-ით და გრადიენტის fallback-ით
    ├── LazySection/     სექცია იხატება მხოლოდ ეკრანთან მიახლოებისას (React.lazy + IntersectionObserver)
    └── SectionTitle/    სექციის სათაური
```

სურათები: `public/images/` (იხ. იქ README.txt).

## Lazy load (მთავარი გვერდი)
- **სურათები** — `ImageBox` `<img>`-ს ქმნის მხოლოდ მაშინ, როცა ბლოკი ეკრანს ~300px-ით უახლოვდება
  (IntersectionObserver), ჩატვირთვისას სურათი რბილად ჩნდება გრადიენტის თავზე.
- **Hero** — პირველი სლაიდი იტვირთება მაშინვე (`priority`, `<link rel="preload">` index.html-ში);
  დანარჩენი სლაიდები — მხოლოდ პირველის ჩატვირთვის შემდეგ.
- **სექციები** — SpecialOffers, ProjectsSlider, Gallery, ContactSection ცალკე JS ფაილებად (chunk) იყოფა
  და იხატება ეკრანთან მიახლოებისას (`LazySection`). ბრაუზერის თავისუფალ დროს მათი კოდი წინასწარ იტვირთება.
- `/#projects`, `/#contact` და სხვა ბმულები ისევ მუშაობს — `ScrollManager` ელოდება lazy სექციებს და მერე ასქროლავს.

## Deploy
ეს SPA-ია, ამიტომ ჰოსტინგზე ყველა მისამართი index.html-ზე უნდა გადამისამართდეს
(Netlify-სთვის უკვე დამატებულია `public/_redirects`; ლოკალურად: `npx serve -s build`).

## 3D ვიზუალი (ბინის გვერდი → „3D“)
- მოდელი იგება იმავე გეგმიდან, რაც 2D-ში (`planLayouts.js`), ამიტომ ოთახები და ფართები ზუსტად ემთხვევა;
  სარკისებრი ბინებიც (mirrored) სწორად ჩანს.
- კედლები და კარები ავტომატურად გამოითვლება (`plan3d.js`): ყველა ოთახს კარი აქვს ლოგიკურ მეზობელთან,
  შესასვლელი — დერეფნის გარე კედელზე, აივნის მხარეს — პანორამული მინა.
- მართვა: მაუსით/თითით გადატრიალება, ისრები და +/− კლავიატურაზე, ღილაკები — მობრუნება, მიახლოება, „ზემოდან“.
- ოთახზე მიტანისას ჩანს სახელი და ფართი.
- გამოიყენება მხოლოდ CSS 3D transforms — three.js და სხვა ბიბლიოთეკები არ არის. კომპონენტი ცალკე ფაილად
  (chunk, ~5 KB) იტვირთება მხოლოდ „3D“ ღილაკზე (მაუსის მიტანისას — წინასწარ).
- ავეჯის შეცვლა: `furniture()` ფუნქცია `src/data/plan3d.js`-ში.

## ბინა → პროექტი
ყველა ბინას აქვს `projectId` (`src/data/apartments.js`, `APARTMENTS_PROJECT_ID`), რომელიც მიუთითებს
`homeData.js`-ის `projects` სიაზე. ბინის გვერდზე და PDF-ში პროექტის სახელი ჩანს breadcrumb-ში
(მთავარი › ბინები › პროექტი › ბინა), სათაურის ქვეშ და „გაიგე მეტი“ ბლოკში; ჩაბარების ვადაც პროექტიდან მოდის.
სხვა პროექტის ბინების დამატებისას ბინას უბრალოდ შესაბამისი `projectId` მიეცი.

## Build და ატვირთვა (deploy)
```
npm run build
```
`build/` საქაღალდის შიგთავსი აიტვირთება ჰოსტინგზე.

- **დომენის ძირში** (`site.ge/`) — არაფრის შეცვლა არ არის საჭირო.
- **ქვესაქაღალდეში** (`site.ge/bazalti/`) — `package.json`-ში ჩაწერე `"homepage": "https://site.ge/bazalti"`
  და გაუშვი build თავიდან. სურათები (`publicUrl()`, `src/utils/publicUrl.js`) და ნავიგაცია (`src/router/Router.jsx`)
  ამ მისამართს ავტომატურად იყენებს.
- **გვერდის განახლება (F5)** `/apartments`-ზე: Apache-სთვის `build/`-ში უკვე დევს `.htaccess`, Netlify-სთვის — `_redirects`.
  ლოკალურად შესამოწმებლად: `npx serve -s build`.
- `build/index.html`-ის პირდაპირ გახსნა (ორჯერ დაკლიკებით, `file://`) არ იმუშავებს — საჭიროა სერვერი.
- public/-ში ახალი სურათის დამატებისას მისამართი ჩაწერე `publicUrl('images/...')`-ით და არა `'/images/...'`-ით.

## GitHub Pages
ატვირთვა ავტომატურია — `.github/workflows/deploy.yml`.

1. შექმენი რეპო GitHub-ზე (მაგ. `bazalti`) და ატვირთე პროექტი `main` ბრენჩში
   (`node_modules` და `build` არ იტვირთება — `.gitignore`).
2. რეპოში: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. **Actions** ტაბში გაეშვება „Deploy to GitHub Pages“ (1–2 წუთი). დასრულების შემდეგ საიტი იქნება:
   `https://შენი-username.github.io/bazalti/`
4. ყოველი შემდეგი `git push` საიტს თავად განაახლებს.

- საიტის მისამართს (`/რეპოს-სახელი/`) workflow თავად ადგენს — `homepage` package.json-ში საჭირო არ არის.
- შიდა გვერდებზე F5 რომ მუშაობდეს, build ქმნის `404.html`-ს (`postbuild` სკრიპტი) — GitHub Pages მას აბრუნებს
  და საიტი სწორ გვერდს ხსნის.
