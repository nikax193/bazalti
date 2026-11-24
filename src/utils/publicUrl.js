// public/ საქაღალდის ფაილების მისამართი, რომელიც build-ის შემდეგაც სწორია —
// როგორც დომენის ძირში (site.ge/), ისე ქვესაქაღალდეში (site.ge/bazalti/) ან "homepage": "."-ით.
// dev-ში PUBLIC_URL ცარიელია → "/images/hero-1.jpg"
export function publicUrl(path) {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
