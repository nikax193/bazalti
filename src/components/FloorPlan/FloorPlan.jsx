import { useId } from 'react';
import { getRooms, PLAN_W as INNER_W, PLAN_H as INNER_H } from '../../data/planLayouts';
import styles from './FloorPlan.module.css';

// 2D გეგმარება SVG-ში. ოთახების განლაგება დამოკიდებულია საძინებლების რაოდენობაზე.
// detailed=true — დიდი ვერსია დეტალური გვერდისთვის (ყველა ოთახის სახელი + ფართის ნიშანი).
// როცა Figma-დან რეალური SVG ნახაზები გექნება, ეს კომპონენტი შეგიძლია ჩაანაცვლო <img src={apt.plan} />-ით.

const fills = {
  living: '#f3eee4',
  bed: '#e6edf0',
  bath: '#dde8e3',
  hall: '#f7f7f4',
};

function Furniture({ room }) {
  const cx = room.x + room.w / 2;
  
  if (room.type === 'bed') {
    const bw = Math.min(room.w * 0.55, 50);
    const bh = Math.min(room.h * 0.5, 44);
    const top = room.y + 10;
    return (
      <g className={styles.furniture}>
        <rect x={cx - bw / 2} y={top} width={bw} height={bh} rx="3" />
        <rect x={cx - bw / 2 + 4} y={top + 4} width={bw / 2 - 6} height="8" rx="2" />
        <rect x={cx + 2} y={top + 4} width={bw / 2 - 6} height="8" rx="2" />
      </g>
    );
  }

  if (room.type === 'living') {
    const sw = room.w * 0.5;
    return (
      <g className={styles.furniture}>
        <rect x={cx - sw / 2} y={room.y + room.h - 34} width={sw} height="14" rx="4" />
        <rect x={room.x + 8} y={room.y + 8} width={room.w * 0.45} height="10" rx="2" />
      </g>
    );
  }

  if (room.type === 'bath' && room.w >= 40) {
    return (
      <g className={styles.furniture}>
        <rect x={room.x + 6} y={room.y + 6} width={Math.min(room.w - 12, 40)} height="18" rx="6" />
      </g>
    );
  }

  return null;
}

function RoomText({ room, detailed }) {
  const cx = room.x + room.w / 2;
  const showLabel = detailed || room.w >= 60;
  // ტექსტი იწერება ავეჯის გარეშე დარჩენილ ადგილას
  const baseY =
    room.type === 'bed' || room.type === 'bath'
      ? room.y + room.h - (showLabel ? 20 : 10)
      : room.y + room.h / 2 - (showLabel ? 4 : -3);
  const label = room.w < 60 ? room.short.split(' ')[0] : room.short;

  if (detailed) {
    const text = `${room.area} მ²`;
    const pillW = Math.min(text.length * 3.6 + 6, room.w - 6);
    const narrow = room.w < 60;
    const y = room.type === 'bed' || room.type === 'bath' ? room.y + room.h - (narrow ? 12 : 18) : room.y + room.h / 2;
    return (
      <g>
        {!narrow && (
          <text x={cx} y={y} className={styles.detailLabel} textAnchor="middle">{room.short}</text>
        )}
        <rect x={cx - pillW / 2} y={y + 2.5} width={pillW} height="9" rx="4.5" className={styles.pill} />
        <text x={cx} y={y + 8.9} className={styles.pillText} textAnchor="middle">{text}</text>
      </g>
    );
  }

  return (
    <>
      {showLabel && (
        <text x={cx} y={baseY} className={styles.label} textAnchor="middle">{label}</text>
      )}
      <text x={cx} y={baseY + (showLabel ? 11 : 0)} className={styles.area} textAnchor="middle">
        {room.area.toFixed(1)}
      </text>
    </>
  );
}

function FloorPlan({ bedrooms = 1, livingArea, balconyArea, mirrored = false, detailed = false }) {
  const patternId = useId();
  const rooms = getRooms({ bedrooms, livingArea, mirrored });

  return (
    <svg className={styles.plan} viewBox="0 0 300 212" role="img" aria-label="ბინის გეგმარება">
      <defs>
        <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#e9dcc0" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#c8a96a" strokeWidth="3" />
        </pattern>
      </defs>

      <g transform="translate(10 10)">
        {/* აივანი */}
        <rect x="0" y={INNER_H} width={INNER_W} height="32" fill={`url(#${patternId})`} className={styles.balcony} />
        <text x={INNER_W / 2} y={INNER_H + 21} className={styles.balconyLabel} textAnchor="middle">
          აივანი · {balconyArea} მ²
        </text>

        {/* ოთახები */}
        {rooms.map((room, i) => (
          <g key={i}>
            <rect x={room.x} y={room.y} width={room.w} height={room.h} fill={fills[room.type]} className={styles.room} />
            <Furniture room={room} />
            <RoomText room={room} detailed={detailed} />
          </g>
        ))}

        {/* გარე კედელი და ფანჯრები */}
        <rect x="0" y="0" width={INNER_W} height={INNER_H} className={styles.wall} />
        {[0.12, 0.42, 0.72].map((p) => (
          <line key={p} x1={INNER_W * p} y1={INNER_H} x2={INNER_W * p + 50} y2={INNER_H} className={styles.window} />
        ))}
      </g>
    </svg>
  );
}

export default FloorPlan;
