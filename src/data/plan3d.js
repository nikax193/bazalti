// 3D მოდელის გეომეტრია ბინის გეგმიდან (planLayouts.js-ის ოთახებიდან).
// ყველაფერი იმავე ერთეულებშია, რაც 2D გეგმაში (280 × 160 ბადე), z — სიმაღლე.
// აბრუნებს "ყუთებს" (box): { x, y, z, w, d, h, color, top } — კედლები, ავეჯი;
// და მინის პანელებს (panes).

import { PLAN_W, PLAN_H } from './planLayouts';

export const BALCONY_D = 32;
export const WALL_H = 44; // ჭრილის სიმაღლე ("სათამაშო სახლის" ხედი)
const OUTER_T = 6;
const INNER_T = 3;
const DOOR = 22;

const WALL = '#f3efe7';
const WALL_TOP = '#2a3632';

// --- დამხმარე: ინტერვალები ---
function union(list) {
  const sorted = [...list].sort((a, b) => a[0] - b[0]);
  const out = [];
  sorted.forEach(([a, b]) => {
    const last = out[out.length - 1];
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else out.push([a, b]);
  });
  return out;
}

function subtract(intervals, gaps) {
  let result = intervals;
  gaps.forEach(([ga, gb]) => {
    result = result.flatMap(([a, b]) => {
      if (gb <= a || ga >= b) return [[a, b]];
      const parts = [];
      if (ga > a) parts.push([a, ga]);
      if (gb < b) parts.push([gb, b]);
      return parts;
    });
  });
  return result.filter(([a, b]) => b - a > 0.5);
}

// ორი ოთახის საერთო კედელი (თუ აქვთ)
function sharedEdge(a, b) {
  const ox = [Math.max(a.x, b.x), Math.min(a.x + a.w, b.x + b.w)];
  const oy = [Math.max(a.y, b.y), Math.min(a.y + a.h, b.y + b.h)];
  if (a.y + a.h === b.y || b.y + b.h === a.y) {
    const at = a.y + a.h === b.y ? b.y : a.y;
    if (ox[1] - ox[0] > 0) return { orient: 'h', at, range: ox };
  }
  if (a.x + a.w === b.x || b.x + b.w === a.x) {
    const at = a.x + a.w === b.x ? b.x : a.x;
    if (oy[1] - oy[0] > 0) return { orient: 'v', at, range: oy };
  }
  return null;
}

const priority = {
  hall: ['living', 'bed', 'bath'],
  bed: ['hall', 'living', 'bed'],
  bath: ['hall', 'living', 'bed', 'bath'],
  living: ['hall'],
};

// კარები: ყველა ოთახს — კარი ყველაზე ლოგიკურ მეზობელთან + შესასვლელი კარი
function planDoors(rooms) {
  const doors = [];
  const linked = new Set();
  const pairKey = (a, b) => [a.key, b.key].sort().join('|');

  const connect = (a, b) => {
    const key = pairKey(a, b);
    if (linked.has(key)) return true;
    const edge = sharedEdge(a, b);
    if (!edge || edge.range[1] - edge.range[0] < DOOR + 8) return false;
    const mid = (edge.range[0] + edge.range[1]) / 2;
    doors.push({ orient: edge.orient, at: edge.at, range: [mid - DOOR / 2, mid + DOOR / 2] });
    linked.add(key);
    return true;
  };

  rooms.forEach((room) => {
    const prefs = priority[room.type] ?? [];
    prefs.some((type) => rooms.some((other) => other !== room && other.type === type && connect(room, other)));
  });

  // შესასვლელი: დერეფნის (ან მისაღების) გარე კედელზე, არა აივნის მხარეს
  const entryRoom = rooms.find((r) => r.type === 'hall') ?? rooms.find((r) => r.type === 'living');
  let entrance = null;
  if (entryRoom) {
    const r = entryRoom;
    const options = [
      r.x + r.w === PLAN_W && { orient: 'v', at: PLAN_W, mid: r.y + r.h / 2, len: r.h },
      r.x === 0 && { orient: 'v', at: 0, mid: r.y + r.h / 2, len: r.h },
      r.y === 0 && { orient: 'h', at: 0, mid: r.x + r.w / 2, len: r.w },
    ].filter((o) => o && o.len >= DOOR + 8);
    if (options.length) {
      const o = options[0];
      entrance = { orient: o.orient, at: o.at, range: [o.mid - DOOR / 2, o.mid + DOOR / 2] };
      doors.push(entrance);
    }
  }

  // ყველა ოთახი უნდა იყოს მისაწვდომი შესასვლელიდან
  const reachable = new Set(entryRoom ? [entryRoom.key] : [rooms[0]?.key]);
  const isLinkedToReachable = (a) => rooms.some((b) => reachable.has(b.key) && linked.has(pairKey(a, b)));
  const linkToReachable = (a) => rooms.some((b) => reachable.has(b.key) && connect(a, b));
  for (let guard = 0; guard < rooms.length * 2; guard += 1) {
    const pending = rooms.filter((a) => !reachable.has(a.key));
    if (!pending.length) break;
    // ჯერ — უკვე არსებული კარებით მისაწვდომი ოთახები; თუ ასეთი არ არის, ახალ კარს ვამატებთ
    const next = pending.find(isLinkedToReachable) ?? pending.find(linkToReachable);
    if (!next) break;
    reachable.add(next.key);
  }

  return { doors, entrance };
}

// კედლები: ოთახების კიდეები → გაერთიანებული ხაზები → კარების ამოჭრა
function buildWalls(rooms, doors) {
  const lines = { h: new Map(), v: new Map() };
  const add = (orient, at, range) => {
    const map = lines[orient];
    if (!map.has(at)) map.set(at, []);
    map.get(at).push(range);
  };
  rooms.forEach((r) => {
    add('h', r.y, [r.x, r.x + r.w]);
    add('h', r.y + r.h, [r.x, r.x + r.w]);
    add('v', r.x, [r.y, r.y + r.h]);
    add('v', r.x + r.w, [r.y, r.y + r.h]);
  });

  const boxes = [];
  const panes = [];

  ['h', 'v'].forEach((orient) => {
    lines[orient].forEach((ranges, at) => {
      const outer = orient === 'h' ? at === 0 || at === PLAN_H : at === 0 || at === PLAN_W;
      const glass = orient === 'h' && at === PLAN_H; // აივნის მხარე — პანორამული მინა
      const t = outer ? OUTER_T : INNER_T;
      const gaps = doors.filter((d) => d.orient === orient && d.at === at).map((d) => d.range);
      const segments = subtract(union(ranges), gaps);

      segments.forEach(([a, b]) => {
        // ბოლოებს ვაგრძელებთ ნახევარი სისქით, რომ კუთხეები დაიხუროს (კარის მხარეს — არა)
        const isGapEdge = (p) => gaps.some(([ga, gb]) => Math.abs(p - ga) < 0.5 || Math.abs(p - gb) < 0.5);
        const a2 = isGapEdge(a) ? a : a - t / 2;
        const b2 = isGapEdge(b) ? b : b + t / 2;
        const h = glass ? 6 : WALL_H;
        const box =
          orient === 'h'
            ? { x: a2, y: at - t / 2, w: b2 - a2, d: t, h }
            : { x: at - t / 2, y: a2, w: t, d: b2 - a2, h };
        boxes.push({ ...box, z: 0, color: WALL, top: glass ? '#e9e6de' : WALL_TOP, kind: 'wall' });
        if (glass) {
          panes.push({ orient: 'h', at, from: a, to: b, z: 6, h: WALL_H - 6 });
          boxes.push({ x: a2, y: at - 1.5, z: WALL_H - 3, w: b2 - a2, d: 3, h: 3, color: '#3a4844', kind: 'wall' });
        }
      });
    });
  });

  return { boxes, panes };
}

// --- ავეჯი ---
const C = {
  wood: '#b48a5e',
  darkWood: '#7a5a3e',
  white: '#fbfaf7',
  fabric: '#8fa39a',
  fabricDark: '#5f766c',
  accent: '#dfe6c5',
  stone: '#3c4744',
  ceramic: '#ffffff',
  water: '#bfe3ea',
  green: '#5f8a4e',
  pot: '#c9b79c',
  tv: '#1d2326',
};

function plant(x, y, size = 8) {
  return [
    { x, y, w: size, d: size, h: size * 0.9, color: C.pot },
    { x: x - 1, y: y - 1, z: size * 0.9, w: size + 2, d: size + 2, h: size * 1.1, color: C.green, top: '#7aa860' },
  ];
}

function furniture(room) {
  const { x, y, w, h } = room;
  const cx = x + w / 2;
  const list = [];

  if (room.type === 'bed') {
    const bw = Math.min(w * 0.55, 50);
    const bh = Math.min(h * 0.5, 44);
    const top = y + 10;
    list.push(
      { x: cx - bw / 2, y: top - 5, w: bw, d: 5, h: 20, color: C.darkWood },
      { x: cx - bw / 2, y: top, w: bw, d: bh, h: 8, color: C.wood },
      { x: cx - bw / 2 + 1, y: top + 1, z: 8, w: bw - 2, d: bh - 2, h: 3, color: C.white },
      { x: cx - bw / 2 + 0.5, y: top + bh * 0.38, z: 8, w: bw - 1, d: bh * 0.62 - 0.5, h: 4.5, color: C.fabric, top: '#9fb3aa' },
      { x: cx - bw / 2 + 4, y: top + 3, z: 11, w: bw / 2 - 6, d: 8, h: 3, color: C.white },
      { x: cx + 2, y: top + 3, z: 11, w: bw / 2 - 6, d: 8, h: 3, color: C.white },
    );
    if (w - bw > 26) {
      list.push(
        { x: cx - bw / 2 - 10, y: top, w: 8, d: 8, h: 10, color: C.wood },
        { x: cx + bw / 2 + 2, y: top, w: 8, d: 8, h: 10, color: C.wood },
      );
    }
    if (h - (top - y) - bh > 30) list.push(...plant(x + w - 14, y + h - 14));
  }

  if (room.type === 'living') {
    const sw = w * 0.5;
    const sy = y + h - 34;
    list.push(
      // ხალიჩა
      { x: cx - sw / 2 - 8, y: sy - 34, w: sw + 16, d: 50, h: 0.6, color: C.accent },
      // დივანი
      { x: cx - sw / 2, y: sy, w: sw, d: 14, h: 7, color: C.fabricDark },
      { x: cx - sw / 2, y: sy + 10, w: sw, d: 4, h: 15, color: C.fabricDark },
      { x: cx - sw / 2 - 4, y: sy, w: 4, d: 14, h: 11, color: C.fabricDark },
      { x: cx + sw / 2, y: sy, w: 4, d: 14, h: 11, color: C.fabricDark },
      { x: cx - sw / 2 + 2, y: sy + 1, z: 7, w: sw / 2 - 3, d: 9, h: 2.5, color: C.fabric },
      { x: cx + 1, y: sy + 1, z: 7, w: sw / 2 - 3, d: 9, h: 2.5, color: C.fabric },
      // ჟურნალის მაგიდა
      { x: cx - 12, y: sy - 22, w: 24, d: 12, h: 6, color: C.wood },
      // სამზარეულო
      { x: x + 8, y: y + 3, w: w * 0.45, d: 12, h: 14, color: C.white, top: C.stone },
      { x: x + 8 + w * 0.12, y: y + 5, z: 14, w: 8, d: 6, h: 0.8, color: '#9aa5a2' },
    );
    // სასადილო მაგიდა სკამებით
    const tx = x + 8 + w * 0.12;
    const ty = y + 30;
    if (h > 120) {
      list.push(
        { x: tx, y: ty, w: 30, d: 16, h: 12, color: C.wood },
        { x: tx + 3, y: ty - 8, w: 8, d: 7, h: 7, color: C.darkWood },
        { x: tx + 19, y: ty - 8, w: 8, d: 7, h: 7, color: C.darkWood },
        { x: tx + 3, y: ty + 17, w: 8, d: 7, h: 7, color: C.darkWood },
        { x: tx + 19, y: ty + 17, w: 8, d: 7, h: 7, color: C.darkWood },
      );
    }
    // ტელევიზორი
    if (w > 110) {
      const tvx = x + w * 0.6;
      list.push(
        { x: tvx, y: y + 3, w: w * 0.3, d: 7, h: 7, color: C.wood },
        { x: tvx + w * 0.03, y: y + 5, z: 7, w: w * 0.24, d: 1.5, h: 16, color: C.tv },
      );
    }
    list.push(...plant(x + w - 14, y + h - 16, 9));
  }

  if (room.type === 'bath') {
    if (w >= 40) {
      const tw = Math.min(w - 12, 40);
      list.push(
        { x: x + 6, y: y + 6, w: tw, d: 18, h: 9, color: C.ceramic },
        { x: x + 8, y: y + 8, z: 9, w: tw - 4, d: 14, h: 0.4, color: C.water },
        { x: x + w - 16, y: y + h - 18, w: 10, d: 12, h: 8, color: C.ceramic },
        { x: x + w - 16, y: y + h - 8, w: 10, d: 4, h: 14, color: C.ceramic },
      );
      if (h > 50) list.push({ x: x + 6, y: y + h - 14, w: 16, d: 10, h: 12, color: C.wood, top: C.ceramic });
    } else {
      list.push(
        { x: x + 4, y: y + 4, w: w - 8, d: Math.min(h * 0.4, 24), h: 1.5, color: '#e5ece9' },
        { x: x + w / 2 - 5, y: y + h - 16, w: 10, d: 12, h: 8, color: C.ceramic },
      );
    }
  }

  if (room.type === 'hall') {
    list.push({ x: x + 5, y: y + 5, w: Math.min(w * 0.45, 30), d: 9, h: 14, color: C.white, top: C.wood });
    if (w > 40 && h > 40) list.push(...plant(x + w - 14, y + h - 14, 7));
  }

  return list.map((b) => ({ z: 0, ...b, kind: 'furniture' }));
}

// მთავარი ფუნქცია
export function buildModel(rooms) {
  const { doors } = planDoors(rooms);
  const walls = buildWalls(rooms, doors);
  const items = rooms.flatMap(furniture);

  // აივნის მოაჯირი (მინა) და ჰანდრეილი
  const by = PLAN_H + BALCONY_D;
  const railPanes = [
    { orient: 'h', at: by, from: 0, to: PLAN_W, z: 0, h: 15 },
    { orient: 'v', at: 0, from: PLAN_H, to: by, z: 0, h: 15 },
    { orient: 'v', at: PLAN_W, from: PLAN_H, to: by, z: 0, h: 15 },
  ];
  const rails = [
    { x: -1, y: by - 1, z: 15, w: PLAN_W + 2, d: 2, h: 1.5, color: '#3a4844' },
    { x: -1, y: PLAN_H, z: 15, w: 2, d: BALCONY_D, h: 1.5, color: '#3a4844' },
    { x: PLAN_W - 1, y: PLAN_H, z: 15, w: 2, d: BALCONY_D, h: 1.5, color: '#3a4844' },
  ].map((b) => ({ ...b, kind: 'wall' }));

  // აივნის ავეჯი
  const balconyItems = [
    { x: 24, y: PLAN_H + 10, w: 14, d: 14, h: 9, color: C.darkWood },
    { x: 12, y: PLAN_H + 12, w: 9, d: 9, h: 6, color: C.fabric },
    { x: 41, y: PLAN_H + 12, w: 9, d: 9, h: 6, color: C.fabric },
    ...plant(PLAN_W - 18, PLAN_H + 12, 9),
  ].map((b) => ({ z: 0, ...b, kind: 'furniture' }));

  return {
    boxes: [...walls.boxes, ...rails, ...items, ...balconyItems],
    panes: [...walls.panes, ...railPanes],
    width: PLAN_W,
    depth: PLAN_H + BALCONY_D,
  };
}
