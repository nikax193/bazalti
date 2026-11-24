import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getRooms, PLAN_H } from '../../data/planLayouts';
import { buildModel, BALCONY_D, WALL_H } from '../../data/plan3d';
import styles from './Apartment3D.module.css';

/*
  ბინის 3D ვიზუალი — "სათამაშო სახლის" ხედი, გარე ბიბლიოთეკების გარეშე (CSS 3D transforms).
  მოდელი იგება იმავე გეგმიდან, რაც 2D-ში (planLayouts.js), ამიტომ ოთახები და ფართები ემთხვევა.
  - მაუსით / თითით გადატრიალება, ღილაკებით მობრუნება, მიახლოება, ზედხედი
  - ოთახზე მიტანისას — სახელი და ფართი
*/

const S = 2; // 1 გეგმის ერთეული = 2px
const DEFAULT_VIEW = { yaw: -32, tilt: 58, zoom: 1 };
const TOP_VIEW = { yaw: 0, tilt: 0, zoom: 1 };
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const floorClass = {
  living: 'floorWood',
  bed: 'floorWood',
  bath: 'floorTile',
  hall: 'floorStone',
};

function shade(hex, factor) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => clamp(Math.round(v * factor), 0, 255);
  return `rgb(${ch((n >> 16) & 255)}, ${ch((n >> 8) & 255)}, ${ch(n & 255)})`;
}

const px = (v) => `${v * S}px`;

// ყუთი 5 წახნაგით (ქვედა არ ჩანს)
const Box = memo(function Box({ box }) {
  const { x, y, z = 0, w, d, h, color, top } = box;
  const lift = `translateZ(${px(z)})`;
  const faces = [
    { left: px(x), top: px(y), width: px(w), height: px(d), transform: `translateZ(${px(z + h)})`, background: top ?? shade(color, 1.04) },
    { left: px(x), top: px(y + d), width: px(w), height: px(h), transform: `${lift} rotateX(90deg)`, background: shade(color, 0.9) },
    { left: px(x), top: px(y), width: px(w), height: px(h), transform: `${lift} rotateX(90deg)`, background: shade(color, 0.8) },
    { left: px(x), top: px(y), width: px(d), height: px(h), transform: `${lift} rotateZ(90deg) rotateX(90deg)`, background: shade(color, 0.86) },
    { left: px(x + w), top: px(y), width: px(d), height: px(h), transform: `${lift} rotateZ(90deg) rotateX(90deg)`, background: shade(color, 0.74) },
  ];
  return faces.map((style, i) => <div key={i} className={styles.face} style={style} />);
});

function Pane({ pane }) {
  const { orient, at, from, to, z, h } = pane;
  const len = to - from;
  const style =
    orient === 'h'
      ? { left: px(from), top: px(at), width: px(len), height: px(h), transform: `translateZ(${px(z)}) rotateX(90deg)` }
      : { left: px(at), top: px(from), width: px(len), height: px(h), transform: `translateZ(${px(z)}) rotateZ(90deg) rotateX(90deg)` };
  return <div className={`${styles.face} ${styles.glass}`} style={{ ...style, backgroundSize: `${px(50)} 100%` }} />;
}

function ViewIcon({ name }) {
  const paths = {
    left: <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />,
    right: <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    top: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 12h16M12 4v16" /></>,
    cube: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Apartment3D({ bedrooms = 1, livingArea, balconyArea, mirrored = false }) {
  const stageRef = useRef(null);
  const worldRef = useRef(null);
  const view = useRef({ ...TOP_VIEW });
  const drag = useRef(null);
  const [fit, setFit] = useState(0.8);
  const [hovered, setHovered] = useState(null);
  const [isTop, setIsTop] = useState(false);
  const [dragging, setDragging] = useState(false);

  const rooms = useMemo(() => getRooms({ bedrooms, livingArea, mirrored }), [bedrooms, livingArea, mirrored]);
  const model = useMemo(() => buildModel(rooms), [rooms]);

  // კამერა იცვლება პირდაპირ CSS ცვლადებით — React-ის ხელახალი რენდერის გარეშე (სწრაფი)
  const apply = (next, animate = true) => {
    view.current = { ...view.current, ...next };
    const el = worldRef.current;
    if (!el) return;
    el.classList.toggle(styles.animate, animate);
    el.style.setProperty('--yaw', `${view.current.yaw}deg`);
    el.style.setProperty('--tilt', `${view.current.tilt}deg`);
    el.style.setProperty('--zoom', view.current.zoom);
    setIsTop(view.current.tilt < 5);
  };

  // ეკრანის ზომაზე მორგება
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const diag = Math.hypot(model.width, model.depth) * S;
    const update = () => {
      const { width, height } = stage.getBoundingClientRect();
      setFit(clamp(Math.min(width / (diag * 0.98), height / (diag * 0.82)), 0.35, 1.4));
    };
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [model]);

  // შესვლის ანიმაცია: ზემოდან (როგორც 2D) → 3D
  useEffect(() => {
    apply(TOP_VIEW, false);
    const timer = setTimeout(() => apply(DEFAULT_VIEW), 120);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.target.closest('button')) return;
    stageRef.current.setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ...view.current };
    setDragging(true);
  };

  const onPointerMove = (e) => {
    const start = drag.current;
    if (!start) return;
    apply(
      {
        yaw: start.yaw + (e.clientX - start.x) * 0.45,
        tilt: clamp(start.tilt - (e.clientY - start.y) * 0.3, 0, 78),
      },
      false,
    );
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const onKeyDown = (e) => {
    const v = view.current;
    const keys = {
      ArrowLeft: { yaw: v.yaw - 15 },
      ArrowRight: { yaw: v.yaw + 15 },
      ArrowUp: { tilt: clamp(v.tilt + 8, 0, 78) },
      ArrowDown: { tilt: clamp(v.tilt - 8, 0, 78) },
      '+': { zoom: clamp(v.zoom + 0.15, 0.6, 2.2) },
      '-': { zoom: clamp(v.zoom - 0.15, 0.6, 2.2) },
    };
    if (keys[e.key]) {
      e.preventDefault();
      apply(keys[e.key]);
    }
  };

  const W = model.width * S;
  const D = model.depth * S;
  const labelLift = WALL_H + 16;

  return (
    <div className={styles.wrap}>
      <div
        ref={stageRef}
        className={`${styles.stage} ${dragging ? styles.grabbing : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="img"
        aria-label="ბინის 3D მოდელი. გადასატრიალებლად გამოიყენე მაუსი, თითი ან ისრები."
      >
        <div className={styles.fit} style={{ transform: `scale(${fit})` }}>
          <div
            ref={worldRef}
            className={styles.world}
            style={{ width: W, height: D, '--yaw': '0deg', '--tilt': '0deg', '--zoom': 1 }}
          >
            {/* ჩრდილი და იატაკის ფილა */}
            <div className={styles.shadow} style={{ left: -24, top: -24, width: W + 48, height: D + 48 }} />
            <div className={styles.slab} style={{ left: px(-6), top: px(-6), width: px(model.width + 12), height: px(PLAN_H + 12) }} />

            {/* აივანი */}
            <div className={`${styles.floor} ${styles.floorDeck}`} style={{ left: 0, top: px(PLAN_H), width: W, height: px(BALCONY_D) }} />

            {/* ოთახების იატაკი */}
            {rooms.map((room) => (
              <div
                key={room.key}
                className={`${styles.floor} ${styles[floorClass[room.type]]} ${hovered === room.key ? styles.floorHover : ''}`}
                style={{ left: px(room.x), top: px(room.y), width: px(room.w), height: px(room.h) }}
                onPointerEnter={() => setHovered(room.key)}
                onPointerLeave={() => setHovered((h) => (h === room.key ? null : h))}
              />
            ))}

            {/* კედლები და ავეჯი */}
            {model.boxes.map((box, i) => (
              <Box key={i} box={box} />
            ))}
            {model.panes.map((pane, i) => (
              <Pane key={`p${i}`} pane={pane} />
            ))}

            {/* წარწერები — ყოველთვის კამერისკენ არიან მიბრუნებული */}
            {rooms.map((room) => (
              <div
                key={`l-${room.key}`}
                className={styles.anchor}
                style={{ left: px(room.x + room.w / 2), top: px(room.y + room.h / 2), '--lift': px(labelLift) }}
              >
                <span className={`${styles.label} ${hovered === room.key ? styles.labelActive : ''}`}>
                  {(hovered === room.key || room.w >= 60) && <span className={styles.labelName}>{room.name}</span>}
                  <span className={styles.labelArea}>{room.area} მ²</span>
                </span>
              </div>
            ))}
            <div
              className={styles.anchor}
              style={{ left: px(model.width / 2), top: px(PLAN_H + BALCONY_D / 2), '--lift': px(24) }}
            >
              <span className={`${styles.label} ${styles.labelBalcony}`}>
                <span className={styles.labelName}>აივანი</span>
                <span className={styles.labelArea}>{balconyArea} მ²</span>
              </span>
            </div>
          </div>
        </div>

        <p className={styles.hint}>გადაატრიალე მაუსით ან თითით</p>

        <div className={styles.controls}>
          <button type="button" onClick={() => apply({ yaw: view.current.yaw - 45 })} aria-label="მარცხნივ მობრუნება">
            <ViewIcon name="left" />
          </button>
          <button type="button" onClick={() => apply({ yaw: view.current.yaw + 45 })} aria-label="მარჯვნივ მობრუნება">
            <ViewIcon name="right" />
          </button>
          <span className={styles.sep} />
          <button type="button" onClick={() => apply({ zoom: clamp(view.current.zoom - 0.2, 0.6, 2.2) })} aria-label="დაშორება">
            <ViewIcon name="minus" />
          </button>
          <button type="button" onClick={() => apply({ zoom: clamp(view.current.zoom + 0.2, 0.6, 2.2) })} aria-label="მიახლოება">
            <ViewIcon name="plus" />
          </button>
          <span className={styles.sep} />
          <button
            type="button"
            className={styles.textBtn}
            onClick={() => apply(isTop ? DEFAULT_VIEW : TOP_VIEW)}
          >
            <ViewIcon name={isTop ? 'cube' : 'top'} />
            {isTop ? '3D ხედი' : 'ზემოდან'}
          </button>
        </div>
      </div>
      <p className={styles.note}>ავეჯი საილუსტრაციოა. ჭერის სიმაღლე — 3.2 მ.</p>
    </div>
  );
}

export default Apartment3D;
