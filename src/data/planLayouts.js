// ოთახების განლაგება გეგმარებისთვის (ერთეულები: 280 × 160 შიდა ბადე).
// ამავე ფაილიდან გამოითვლება თითოეული ოთახის ფართი — ასე გეგმა და ცხრილი ერთმანეთს ემთხვევა.

export const PLAN_W = 280;
export const PLAN_H = 160;

const layouts = {
  0: [
    { x: 0, y: 0, w: 180, h: 160, type: 'living' },
    { x: 180, y: 0, w: 100, h: 70, type: 'bath' },
    { x: 180, y: 70, w: 100, h: 90, type: 'hall' },
  ],
  1: [
    { x: 0, y: 0, w: 160, h: 160, type: 'living' },
    { x: 160, y: 0, w: 120, h: 100, type: 'bed' },
    { x: 160, y: 100, w: 70, h: 60, type: 'bath' },
    { x: 230, y: 100, w: 50, h: 60, type: 'hall' },
  ],
  2: [
    { x: 0, y: 0, w: 90, h: 100, type: 'bed' },
    { x: 0, y: 100, w: 90, h: 60, type: 'bath' },
    { x: 90, y: 0, w: 110, h: 160, type: 'living' },
    { x: 200, y: 0, w: 80, h: 100, type: 'bed' },
    { x: 200, y: 100, w: 80, h: 60, type: 'hall' },
  ],
  3: [
    { x: 0, y: 0, w: 80, h: 90, type: 'bed' },
    { x: 0, y: 90, w: 80, h: 70, type: 'bed' },
    { x: 80, y: 0, w: 120, h: 160, type: 'living' },
    { x: 200, y: 0, w: 80, h: 90, type: 'bed' },
    { x: 200, y: 90, w: 45, h: 70, type: 'bath' },
    { x: 245, y: 90, w: 35, h: 70, type: 'bath' },
  ],
};

const names = {
  living: { name: 'საერთო ოთახი', short: 'მისაღები' },
  bed: { name: 'საძინებელი', short: 'საძინებელი' },
  bath: { name: 'სააბაზანო', short: 'სვ. წერტილი' },
  hall: { name: 'დერეფანი', short: 'დერეფანი' },
};

// აბრუნებს ოთახების სიას: სახელი, ფართი (მ²) და კოორდინატები გეგმისთვის
export function getRooms({ bedrooms, livingArea, mirrored = false }) {
  const layout = layouts[bedrooms] ?? layouts[1];
  const totalUnits = layout.reduce((sum, r) => sum + r.w * r.h, 0);
  const counters = {};
  const totals = layout.reduce((acc, r) => ({ ...acc, [r.type]: (acc[r.type] ?? 0) + 1 }), {});

  return layout.map((room, index) => {
    counters[room.type] = (counters[room.type] ?? 0) + 1;
    const numbered = totals[room.type] > 1 ? ` ${counters[room.type]}` : '';
    return {
      key: `${room.type}-${index}`,
      type: room.type,
      name: names[room.type].name + numbered,
      short: names[room.type].short,
      area: Math.round(((room.w * room.h) / totalUnits) * livingArea * 10) / 10,
      x: mirrored ? PLAN_W - room.x - room.w : room.x,
      y: room.y,
      w: room.w,
      h: room.h,
    };
  });
}
