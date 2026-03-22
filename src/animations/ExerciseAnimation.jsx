import React from 'react'

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────────
// Consistent stick figure character: rounded head, visible joints, ground shadow.
// All exercises use the same proportions and line weights.

const C = {
  body: '#cbd5e1',     // main body color (light slate)
  limb: '#94a3b8',     // secondary limbs
  joint: '#64748b',    // joint dots
  ground: '#1e293b',   // floor line
  shadow: '#0f172a',   // ground shadow fill
}

// Reusable parts
const Ground = () => (
  <>
    <ellipse cx={80} cy={112} rx={55} ry={3} fill={C.shadow} opacity={0.4} />
    <line x1={15} y1={110} x2={145} y2={110} stroke={C.ground} strokeWidth={1.5} strokeLinecap="round" />
  </>
)

const Head = ({ cx, cy, r = 9, color = C.body }) => (
  <>
    <circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke={color} strokeWidth={2.5} />
    {/* tiny highlight for dimensionality */}
    <circle cx={cx - 2} cy={cy - 2} r={1.5} fill={color} opacity={0.3} />
  </>
)

const Joint = ({ cx, cy }) => (
  <circle cx={cx} cy={cy} r={2.5} fill={C.joint} />
)

const Limb = ({ x1, y1, x2, y2, color = C.limb, w = 3 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />
)

const Torso = ({ x1, y1, x2, y2, color = C.body }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
)

const SVG = ({ children }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {children}
  </svg>
)


// ─── 1. CRUNCH ────────────────────────────────────────────────────────────────
const CrunchAnim = ({ color }) => (
  <SVG>
    <Ground />
    {/* Bent legs (static) */}
    <Limb x1={82} y1={94} x2={104} y2={110} />
    <Limb x1={104} y1={110} x2={118} y2={108} />
    <Limb x1={82} y1={94} x2={60} y2={110} />
    <Limb x1={60} y1={110} x2={46} y2={108} />
    <Joint cx={104} cy={110} />
    <Joint cx={60} cy={110} />
    {/* Upper body — crunches up */}
    <g className="anim-crunch" style={{ transformOrigin: '82px 94px' }}>
      <Torso x1={82} y1={64} x2={82} y2={94} color={color} />
      <Head cx={82} cy={55} color={color} />
      {/* Arms behind head */}
      <Limb x1={82} y1={70} x2={70} y2={62} />
      <Limb x1={70} y1={62} x2={74} y2={52} />
      <Limb x1={82} y1={70} x2={94} y2={62} />
      <Limb x1={94} y1={62} x2={90} y2={52} />
      <Joint cx={82} cy={70} />
    </g>
    <Joint cx={82} cy={94} />
  </SVG>
)

// ─── 2. FLUTTER KICKS ─────────────────────────────────────────────────────────
const FlutterAnim = ({ color }) => (
  <SVG>
    <Ground />
    {/* Body lying flat */}
    <Head cx={28} cy={88} color={color} />
    <Torso x1={28} y1={96} x2={90} y2={96} color={color} />
    {/* Arms behind head */}
    <Limb x1={28} y1={88} x2={20} y2={80} />
    <Limb x1={28} y1={88} x2={36} y2={80} />
    <Joint cx={90} cy={96} />
    {/* Left leg — flutter up */}
    <g className="anim-flutter-l" style={{ transformOrigin: '90px 96px' }}>
      <Limb x1={90} y1={96} x2={120} y2={80} color={color} w={3.5} />
      <Limb x1={120} y1={80} x2={132} y2={78} />
    </g>
    {/* Right leg — opposite phase */}
    <g className="anim-flutter-r" style={{ transformOrigin: '90px 96px' }}>
      <Limb x1={90} y1={96} x2={120} y2={92} color={color} w={3.5} />
      <Limb x1={120} y1={92} x2={132} y2={92} />
    </g>
  </SVG>
)

// ─── 3. LEG RAISES ────────────────────────────────────────────────────────────
const LegRaiseAnim = ({ color }) => (
  <SVG>
    <Ground />
    <Head cx={28} cy={88} color={color} />
    <Torso x1={28} y1={96} x2={90} y2={96} color={color} />
    <Limb x1={28} y1={88} x2={20} y2={80} />
    <Limb x1={28} y1={88} x2={36} y2={80} />
    <Joint cx={90} cy={96} />
    {/* Both legs together, animated raise */}
    <g className="anim-leg-raise" style={{ transformOrigin: '90px 96px' }}>
      <Limb x1={90} y1={96} x2={122} y2={96} color={color} w={3.5} />
      <Limb x1={122} y1={96} x2={140} y2={96} w={3.5} />
      <Joint cx={122} cy={96} />
    </g>
  </SVG>
)

// ─── 4. SEATED BICYCLE ────────────────────────────────────────────────────────
const BicycleAnim = ({ color }) => (
  <SVG>
    <Ground />
    {/* Seated torso, leaning back */}
    <Head cx={58} cy={56} color={color} />
    <Torso x1={58} y1={65} x2={62} y2={92} color={color} />
    {/* Arms behind head */}
    <Limb x1={58} y1={70} x2={48} y2={62} />
    <Limb x1={48} y1={62} x2={46} y2={54} />
    <Limb x1={58} y1={70} x2={68} y2={62} />
    <Limb x1={68} y1={62} x2={70} y2={54} />
    <Joint cx={62} cy={92} />
    {/* Left leg — bicycle pedal */}
    <g className="anim-bicycle-l" style={{ transformOrigin: '55px 92px' }}>
      <Limb x1={55} y1={92} x2={42} y2={104} color={color} />
      <Limb x1={42} y1={104} x2={36} y2={104} />
      <Joint cx={42} cy={104} />
    </g>
    {/* Right leg — opposite phase */}
    <g className="anim-bicycle-r" style={{ transformOrigin: '70px 92px' }}>
      <Limb x1={70} y1={92} x2={84} y2={104} color={color} />
      <Limb x1={84} y1={104} x2={90} y2={104} />
      <Joint cx={84} cy={104} />
    </g>
  </SVG>
)

// ─── 5. EXTEND TO TUCK ───────────────────────────────────────────────────────
const ExtendTuckAnim = ({ color }) => (
  <SVG>
    <Ground />
    <Head cx={40} cy={68} color={color} />
    <Torso x1={40} y1={77} x2={75} y2={92} color={color} />
    {/* Arms for balance */}
    <Limb x1={50} y1={82} x2={42} y2={75} />
    <Limb x1={50} y1={82} x2={60} y2={78} />
    <Joint cx={75} cy={92} />
    {/* Legs — extend ↔ tuck */}
    <g className="anim-extend-tuck" style={{ transformOrigin: '75px 92px' }}>
      <Limb x1={75} y1={92} x2={108} y2={92} color={color} w={3.5} />
      <Limb x1={108} y1={92} x2={128} y2={92} />
      <Joint cx={108} cy={92} />
    </g>
  </SVG>
)

// ─── 6. OBLIQUE CRUNCH KICKS ──────────────────────────────────────────────────
const ObliqueKickAnim = ({ color }) => (
  <SVG>
    <Ground />
    {/* Static leg */}
    <Limb x1={82} y1={94} x2={105} y2={110} />
    <Limb x1={105} y1={110} x2={118} y2={108} />
    <Joint cx={105} cy={110} />
    {/* Kicking leg */}
    <g className="anim-flutter-l" style={{ transformOrigin: '82px 94px' }}>
      <Limb x1={82} y1={94} x2={58} y2={76} color={color} />
      <Limb x1={58} y1={76} x2={44} y2={72} color={color} />
      <Joint cx={58} cy={76} />
    </g>
    {/* Upper body — crunch with twist */}
    <g className="anim-crunch" style={{ transformOrigin: '82px 94px' }}>
      <Torso x1={82} y1={64} x2={82} y2={94} color={color} />
      <Head cx={82} cy={55} color={color} />
      <Limb x1={82} y1={70} x2={68} y2={76} />
      <Limb x1={82} y1={70} x2={96} y2={76} />
      <Joint cx={82} cy={70} />
    </g>
    <Joint cx={82} cy={94} />
  </SVG>
)

// ─── 7. TABLETOP CRUNCHES ─────────────────────────────────────────────────────
const TabletopCrunchAnim = ({ color }) => (
  <SVG>
    <Ground />
    {/* Tabletop legs — 90° at hips and knees (static) */}
    <Limb x1={82} y1={94} x2={82} y2={78} />
    <Limb x1={82} y1={78} x2={102} y2={78} />
    <Joint cx={82} cy={78} />
    <Limb x1={82} y1={94} x2={82} y2={78} />
    <Limb x1={82} y1={78} x2={62} y2={78} />
    {/* Upper body — crunches toward knees */}
    <g className="anim-crunch" style={{ transformOrigin: '82px 94px' }}>
      <Torso x1={82} y1={64} x2={82} y2={94} color={color} />
      <Head cx={82} cy={55} color={color} />
      <Limb x1={82} y1={70} x2={70} y2={62} />
      <Limb x1={82} y1={70} x2={94} y2={62} />
      <Joint cx={82} cy={70} />
    </g>
    <Joint cx={82} cy={94} />
  </SVG>
)

// ─── 8. REVERSE CRUNCHES ──────────────────────────────────────────────────────
const ReverseCrunchAnim = ({ color }) => (
  <SVG>
    <Ground />
    {/* Upper body lying flat (static) */}
    <Head cx={28} cy={88} color={color} />
    <Torso x1={28} y1={96} x2={80} y2={96} color={color} />
    <Limb x1={28} y1={88} x2={20} y2={80} />
    <Limb x1={28} y1={88} x2={36} y2={80} />
    <Joint cx={80} cy={96} />
    {/* Hips + bent legs curl up */}
    <g className="anim-reverse-curl" style={{ transformOrigin: '80px 96px' }}>
      <Limb x1={80} y1={96} x2={100} y2={86} color={color} w={3.5} />
      <Limb x1={100} y1={86} x2={108} y2={92} />
      <Limb x1={100} y1={86} x2={106} y2={82} />
      <Joint cx={100} cy={86} />
    </g>
  </SVG>
)

// ─── 9. RUSSIAN TWIST ─────────────────────────────────────────────────────────
const SeatedTwistAnim = ({ color }) => (
  <SVG>
    <Ground />
    <Head cx={65} cy={52} color={color} />
    {/* Torso — animated twist */}
    <g className="anim-twist" style={{ transformOrigin: '65px 90px' }}>
      <Torso x1={65} y1={61} x2={65} y2={90} color={color} />
      {/* Arms holding weight */}
      <Limb x1={65} y1={74} x2={48} y2={80} color={color} />
      <Limb x1={65} y1={74} x2={82} y2={80} color={color} />
      {/* Weight */}
      <circle cx={65} cy={80} r={4} fill={C.joint} stroke={color} strokeWidth={1.5} />
      <Joint cx={65} cy={74} />
    </g>
    {/* V-sit legs (static) */}
    <Limb x1={65} y1={90} x2={48} y2={110} />
    <Limb x1={65} y1={90} x2={82} y2={110} />
    <Joint cx={65} cy={90} />
    <Joint cx={48} cy={110} />
    <Joint cx={82} cy={110} />
  </SVG>
)

// ─── 10. LEG CIRCLES ──────────────────────────────────────────────────────────
const LegCircleAnim = ({ color }) => (
  <SVG>
    <Ground />
    <Head cx={28} cy={88} color={color} />
    <Torso x1={28} y1={96} x2={88} y2={96} color={color} />
    <Limb x1={28} y1={88} x2={20} y2={80} />
    <Limb x1={28} y1={88} x2={36} y2={80} />
    <Joint cx={88} cy={96} />
    {/* Static leg */}
    <Limb x1={88} y1={96} x2={118} y2={96} />
    <Limb x1={118} y1={96} x2={132} y2={96} />
    {/* Circling leg */}
    <g className="anim-spin-slow" style={{ transformOrigin: '88px 96px' }}>
      <Limb x1={88} y1={96} x2={118} y2={78} color={color} w={3.5} />
      <Limb x1={118} y1={78} x2={128} y2={74} color={color} />
      <Joint cx={118} cy={78} />
    </g>
    {/* Circle path indicator */}
    <circle cx={108} cy={86} r={18} fill="none" stroke={color} strokeWidth={0.8}
      strokeDasharray="3 5" opacity={0.25} />
  </SVG>
)

// ─── 11. HOLLOW HOLD ──────────────────────────────────────────────────────────
const HollowAnim = ({ color }) => (
  <SVG>
    <Ground />
    <g className="anim-float" style={{ transformOrigin: '80px 90px' }}>
      <Head cx={28} cy={82} r={8} color={color} />
      {/* Banana-shaped body */}
      <path d="M 28 88 Q 80 78 132 76" stroke={color} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {/* Arms extended overhead */}
      <Limb x1={28} y1={82} x2={14} y2={74} color={color} />
      <Limb x1={14} y1={74} x2={8} y2={70} color={color} />
      {/* Legs together, lifted */}
      <Limb x1={132} y1={76} x2={148} y2={72} color={color} w={3.5} />
    </g>
    {/* Isometric hold indicator */}
    <text x={80} y={106} textAnchor="middle" fill={color} fontSize={8} fontWeight="600" opacity={0.4}>
      HOLD
    </text>
  </SVG>
)

// ─── 12. TOE TOUCHES ──────────────────────────────────────────────────────────
const ToeTouchAnim = ({ color }) => (
  <SVG>
    <Ground />
    {/* Legs straight up (static) */}
    <Limb x1={82} y1={96} x2={88} y2={58} w={3.5} />
    <Limb x1={82} y1={96} x2={78} y2={58} w={3.5} />
    <Joint cx={82} cy={96} />
    {/* Upper body crunches up, arms reach */}
    <g className="anim-crunch" style={{ transformOrigin: '82px 96px' }}>
      <Torso x1={82} y1={72} x2={82} y2={96} color={color} />
      <Head cx={82} cy={63} r={8} color={color} />
      {/* Arms reaching to toes */}
      <Limb x1={82} y1={76} x2={72} y2={66} color={color} />
      <Limb x1={72} y1={66} x2={76} y2={56} color={color} />
      <Limb x1={82} y1={76} x2={92} y2={66} color={color} />
      <Limb x1={92} y1={66} x2={88} y2={56} color={color} />
      <Joint cx={82} cy={76} />
    </g>
  </SVG>
)

// ─── 13. L-SIT CROSS TOE TOUCHES ─────────────────────────────────────────────
const LSitAnim = ({ color }) => (
  <SVG>
    <Ground />
    <Head cx={50} cy={55} color={color} />
    <Torso x1={50} y1={64} x2={50} y2={90} color={color} />
    {/* L-sit legs up */}
    <Limb x1={50} y1={90} x2={95} y2={90} w={3.5} />
    <Limb x1={95} y1={90} x2={118} y2={90} />
    <Joint cx={95} cy={90} />
    {/* Support arm */}
    <Limb x1={50} y1={82} x2={38} y2={90} />
    <Joint cx={50} cy={90} />
    {/* Cross arm reach — animated twist */}
    <g className="anim-twist" style={{ transformOrigin: '50px 72px' }}>
      <Limb x1={50} y1={72} x2={72} y2={82} color={color} />
      <Limb x1={72} y1={82} x2={90} y2={80} color={color} />
      <Joint cx={72} cy={82} />
    </g>
  </SVG>
)

// ─── 14. SCISSORS ─────────────────────────────────────────────────────────────
const ScissorsAnim = ({ color }) => (
  <SVG>
    <Ground />
    <Head cx={25} cy={86} color={color} />
    <Torso x1={25} y1={94} x2={88} y2={94} color={color} />
    <Limb x1={25} y1={86} x2={18} y2={78} />
    <Limb x1={25} y1={86} x2={32} y2={78} />
    <Joint cx={88} cy={94} />
    {/* Left leg */}
    <g className="anim-scissors-l" style={{ transformOrigin: '88px 94px' }}>
      <Limb x1={88} y1={94} x2={124} y2={78} color={color} w={3.5} />
      <Limb x1={124} y1={78} x2={136} y2={76} />
      <Joint cx={124} cy={78} />
    </g>
    {/* Right leg — opposite */}
    <g className="anim-scissors-r" style={{ transformOrigin: '88px 94px' }}>
      <Limb x1={88} y1={94} x2={124} y2={88} color={color} w={3.5} />
      <Limb x1={124} y1={88} x2={136} y2={88} />
      <Joint cx={124} cy={88} />
    </g>
  </SVG>
)

// ─── 15. CROSS CRUNCHES ───────────────────────────────────────────────────────
const CrossCrunchAnim = ({ color }) => (
  <SVG>
    <Ground />
    {/* Right leg bent (static) */}
    <Limb x1={82} y1={94} x2={105} y2={110} />
    <Joint cx={105} cy={110} />
    {/* Left knee lifts (animated) */}
    <g className="anim-flutter-l" style={{ transformOrigin: '82px 94px' }}>
      <Limb x1={82} y1={94} x2={62} y2={82} color={color} />
      <Limb x1={62} y1={82} x2={55} y2={88} />
      <Joint cx={62} cy={82} />
    </g>
    {/* Upper body — diagonal crunch */}
    <g className="anim-cross-l" style={{ transformOrigin: '82px 94px' }}>
      <Torso x1={82} y1={64} x2={82} y2={94} color={color} />
      <Head cx={82} cy={55} color={color} />
      {/* Elbow reaches across */}
      <Limb x1={82} y1={72} x2={68} y2={68} color={color} />
      <Limb x1={68} y1={68} x2={62} y2={58} />
      <Limb x1={82} y1={72} x2={96} y2={78} />
      <Joint cx={82} cy={72} />
    </g>
    <Joint cx={82} cy={94} />
  </SVG>
)

// ─── 16/17. SIDE PLANK DIPS ───────────────────────────────────────────────────
const SidePlankAnim = ({ color, side = 'r' }) => (
  <SVG>
    <Ground />
    <g style={{ transform: side === 'l' ? 'scaleX(-1)' : 'none', transformOrigin: '80px 60px' }}>
      <g className="anim-side-dip" style={{ transformOrigin: '30px 98px' }}>
        <Head cx={30} cy={62} color={color} />
        {/* Body diagonal */}
        <Torso x1={30} y1={71} x2={120} y2={96} color={color} />
        {/* Top arm raised */}
        <Limb x1={70} y1={82} x2={70} y2={62} color={C.limb} />
        {/* Support arm */}
        <Limb x1={30} y1={73} x2={30} y2={98} />
        <Joint cx={30} cy={98} />
        {/* Feet stacked */}
        <Limb x1={120} y1={96} x2={130} y2={96} />
        <Joint cx={120} cy={96} />
        <Joint cx={70} cy={82} />
      </g>
    </g>
  </SVG>
)

// ─── 18. MOUNTAIN CLIMBERS ────────────────────────────────────────────────────
const MountainAnim = ({ color }) => (
  <SVG>
    <Ground />
    {/* Plank body */}
    <Head cx={130} cy={56} color={color} />
    <Torso x1={130} y1={65} x2={50} y2={84} color={color} />
    {/* Arms */}
    <Limb x1={130} y1={70} x2={130} y2={88} />
    <Limb x1={130} y1={88} x2={136} y2={88} />
    <Joint cx={130} cy={70} />
    <Joint cx={50} cy={84} />
    {/* Right leg static */}
    <Limb x1={50} y1={84} x2={32} y2={110} />
    <Joint cx={32} cy={110} />
    {/* Left knee drives forward */}
    <g className="anim-mountain-l" style={{ transformOrigin: '50px 84px' }}>
      <Limb x1={50} y1={84} x2={58} y2={110} color={color} />
      <Joint cx={58} cy={110} />
    </g>
  </SVG>
)

// ─── 19. PLANK KNEE TUCKS ─────────────────────────────────────────────────────
const PlankKneeAnim = ({ color }) => (
  <SVG>
    <Ground />
    <Head cx={130} cy={56} color={color} />
    <Torso x1={130} y1={65} x2={50} y2={82} color={color} />
    <Limb x1={130} y1={70} x2={130} y2={88} />
    <Joint cx={130} cy={70} />
    <Joint cx={50} cy={82} />
    {/* Both knees tuck */}
    <g className="anim-plank-knee-l" style={{ transformOrigin: '50px 82px' }}>
      <Limb x1={50} y1={82} x2={58} y2={110} color={color} />
      <Joint cx={58} cy={110} />
    </g>
    <g className="anim-plank-knee-r" style={{ transformOrigin: '50px 82px' }}>
      <Limb x1={50} y1={82} x2={50} y2={110} color={color} />
      <Joint cx={50} cy={110} />
    </g>
  </SVG>
)

// ─── 20. SPIDER CRUNCHES ──────────────────────────────────────────────────────
const SpiderAnim = ({ color }) => (
  <SVG>
    <Ground />
    <Head cx={130} cy={58} color={color} />
    <Torso x1={130} y1={67} x2={50} y2={82} color={color} />
    <Limb x1={130} y1={72} x2={130} y2={90} />
    <Joint cx={130} cy={72} />
    <Joint cx={50} cy={82} />
    {/* Static back leg */}
    <Limb x1={50} y1={82} x2={30} y2={110} />
    <Joint cx={30} cy={110} />
    {/* Spider knee — drives to side elbow */}
    <g className="anim-spider" style={{ transformOrigin: '50px 82px' }}>
      <Limb x1={50} y1={82} x2={60} y2={72} color={color} />
      <Limb x1={60} y1={72} x2={68} y2={80} color={color} />
      <Joint cx={60} cy={72} />
    </g>
  </SVG>
)

// ─── 21. HEEL TAPS ────────────────────────────────────────────────────────────
const HeelTapAnim = ({ color }) => (
  <SVG>
    <Ground />
    <Head cx={80} cy={58} r={8} color={color} />
    <Torso x1={80} y1={66} x2={80} y2={90} color={color} />
    {/* Bent knees */}
    <Limb x1={80} y1={90} x2={58} y2={110} />
    <Limb x1={58} y1={110} x2={52} y2={108} />
    <Limb x1={80} y1={90} x2={102} y2={110} />
    <Limb x1={102} y1={110} x2={108} y2={108} />
    <Joint cx={58} cy={110} />
    <Joint cx={102} cy={110} />
    <Joint cx={80} cy={90} />
    {/* Arms — side-to-side reach */}
    <g className="anim-heel-reach" style={{ transformOrigin: '80px 74px' }}>
      <Limb x1={80} y1={74} x2={60} y2={82} color={color} />
      <Limb x1={60} y1={82} x2={54} y2={100} color={color} />
      <Limb x1={80} y1={74} x2={100} y2={82} color={color} />
      <Limb x1={100} y1={82} x2={106} y2={100} color={color} />
      <Joint cx={80} cy={74} />
    </g>
  </SVG>
)

// ─── 22. BUTTERFLY CRUNCHES ───────────────────────────────────────────────────
const ButterflyAnim = ({ color }) => (
  <SVG>
    <Ground />
    {/* Butterfly legs — soles together, knees out (static) */}
    <Limb x1={68} y1={108} x2={58} y2={92} />
    <Limb x1={92} y1={108} x2={102} y2={92} />
    <Limb x1={68} y1={108} x2={92} y2={108} w={2} />
    <Joint cx={58} cy={92} />
    <Joint cx={102} cy={92} />
    {/* Upper body — crunches up */}
    <g className="anim-butterfly" style={{ transformOrigin: '80px 92px' }}>
      <Torso x1={80} y1={62} x2={80} y2={92} color={color} />
      <Head cx={80} cy={53} color={color} />
      {/* Elbows wide */}
      <Limb x1={80} y1={70} x2={62} y2={62} color={C.limb} />
      <Limb x1={80} y1={70} x2={98} y2={62} color={C.limb} />
      <Joint cx={80} cy={70} />
    </g>
    <Joint cx={80} cy={92} />
  </SVG>
)

// ─── 23. LEG SWITCHES ─────────────────────────────────────────────────────────
const LegSwitchAnim = ({ color }) => (
  <SVG>
    <Ground />
    <Head cx={25} cy={86} color={color} />
    <Torso x1={25} y1={94} x2={88} y2={94} color={color} />
    <Limb x1={25} y1={86} x2={18} y2={78} />
    <Limb x1={25} y1={86} x2={32} y2={78} />
    <Joint cx={88} cy={94} />
    {/* Alternating legs — wider than flutter */}
    <g className="anim-scissors-l" style={{ transformOrigin: '88px 94px' }}>
      <Limb x1={88} y1={94} x2={126} y2={74} color={color} w={3.5} />
      <Joint cx={126} cy={74} />
    </g>
    <g className="anim-scissors-r" style={{ transformOrigin: '88px 94px' }}>
      <Limb x1={88} y1={94} x2={126} y2={90} color={color} w={3.5} />
      <Joint cx={126} cy={90} />
    </g>
  </SVG>
)


// ─── KEGEL: BREATHE RING ──────────────────────────────────────────────────────
export const KagelBreatheAnim = ({ phase = 'squeeze', color = '#8b5cf6' }) => {
  const isSqueeze = phase === 'squeeze'
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx={80} cy={80} r={65}
        stroke={color} strokeWidth="1" strokeDasharray="4 6"
        opacity={0.3}
        style={{ animation: isSqueeze ? 'spin-slow 8s linear infinite' : 'none' }} />
      <circle cx={80} cy={80} r={isSqueeze ? 45 : 30}
        fill={`${color}22`} stroke={color} strokeWidth="2.5"
        style={{
          transition: 'r 0.6s ease-in-out',
          filter: `drop-shadow(0 0 ${isSqueeze ? 16 : 6}px ${color})`
        }} />
      <circle cx={80} cy={80} r={isSqueeze ? 12 : 6}
        fill={color} style={{ transition: 'r 0.6s ease-in-out' }} />
      {isSqueeze && (
        <>
          <text x={80} y={16} textAnchor="middle" fill={color} fontSize="10" opacity={0.6}>▼</text>
          <text x={80} y={152} textAnchor="middle" fill={color} fontSize="10" opacity={0.6}>▲</text>
          <text x={8} y={84} textAnchor="middle" fill={color} fontSize="10" opacity={0.6}>▶</text>
          <text x={152} y={84} textAnchor="middle" fill={color} fontSize="10" opacity={0.6}>◀</text>
        </>
      )}
    </svg>
  )
}

// ─── KEGEL: ELEVATOR ──────────────────────────────────────────────────────────
export const KagelElevatorAnim = ({ floor = 0, color = '#06b6d4' }) => {
  const floors = [0, 1, 2, 3]
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x={55} y={20} width={50} height={120} rx={6}
        fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      {floors.map((f) => {
        const y = 112 - f * 26
        const isActive = f <= floor
        return (
          <g key={f}>
            <rect x={62} y={y} width={36} height={18} rx={4}
              fill={isActive ? `${color}33` : '#1e293b'}
              stroke={isActive ? color : '#334155'}
              strokeWidth={isActive ? 1.5 : 1} />
            <text x={80} y={y + 13} textAnchor="middle"
              fill={isActive ? color : '#475569'}
              fontSize="9" fontWeight={isActive ? 'bold' : 'normal'}>
              {f + 1}F
            </text>
          </g>
        )
      })}
      <rect x={63} y={112 - floor * 26 + 2} width={34} height={14} rx={3}
        fill={color} opacity={0.9}
        style={{ transition: 'y 0.5s ease-in-out' }} />
    </svg>
  )
}

// ─── KEGEL: QUICK FLICK ───────────────────────────────────────────────────────
export const KagelFlickAnim = ({ active = false, color = '#f59e0b' }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={80} cy={80} r={25 + i * 20}
        stroke={color} strokeWidth={active ? 2 : 0.5}
        opacity={active ? 0.8 - i * 0.25 : 0.15} fill="none"
        style={{
          transition: 'all 0.15s ease',
          filter: active ? `drop-shadow(0 0 8px ${color})` : 'none'
        }} />
    ))}
    <circle cx={80} cy={80} r={18}
      fill={active ? color : `${color}44`}
      style={{ transition: 'fill 0.15s ease' }} />
  </svg>
)

// ─── KEGEL: REVERSE ───────────────────────────────────────────────────────────
export const KagelReverseAnim = ({ phase = 'rest', color = '#10b981' }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx={80} cy={80} r={phase === 'squeeze' ? 60 : 35}
      fill={`${color}15`} stroke={color} strokeWidth="1.5" strokeDasharray="8 4"
      style={{ transition: 'r 0.8s ease-in-out' }} />
    <circle cx={80} cy={80} r={phase === 'squeeze' ? 40 : 22}
      fill={`${color}25`} stroke={color} strokeWidth="2"
      style={{ transition: 'r 0.8s ease-in-out' }} />
    <text x={80} y={12} textAnchor="middle" fill={color} fontSize="12" opacity={0.7}>▲</text>
    <text x={80} y={155} textAnchor="middle" fill={color} fontSize="12" opacity={0.7}>▼</text>
    <text x={10} y={85} textAnchor="middle" fill={color} fontSize="12" opacity={0.7}>◀</text>
    <text x={150} y={85} textAnchor="middle" fill={color} fontSize="12" opacity={0.7}>▶</text>
  </svg>
)


// ─── ROUTER ──────────────────────────────────────────────────────────────────
const animMap = {
  'crunch':         CrunchAnim,
  'flutter':        FlutterAnim,
  'leg-raise':      LegRaiseAnim,
  'bicycle':        BicycleAnim,
  'extend-tuck':    ExtendTuckAnim,
  'oblique-kick':   ObliqueKickAnim,
  'reverse-crunch': ReverseCrunchAnim,
  'seated-twist':   SeatedTwistAnim,
  'leg-circle':     LegCircleAnim,
  'hollow':         HollowAnim,
  'toe-touch':      ToeTouchAnim,
  'l-sit-touch':    LSitAnim,
  'scissors':       ScissorsAnim,
  'cross-crunch':   CrossCrunchAnim,
  'side-plank-r':   (p) => <SidePlankAnim {...p} side="r" />,
  'side-plank-l':   (p) => <SidePlankAnim {...p} side="l" />,
  'mountain':       MountainAnim,
  'leg-switch':     LegSwitchAnim,
  'butterfly':      ButterflyAnim,
  'heel-tap':       HeelTapAnim,
  'plank-knee':     PlankKneeAnim,
  'spider':         SpiderAnim,
}

export default function ExerciseAnimation({ animType, color = '#f97316' }) {
  const Comp = animMap[animType]
  if (!Comp) return (
    <svg viewBox="0 0 160 120" className="w-full h-full">
      <circle cx={80} cy={60} r={40} fill="none" stroke={color} strokeWidth="2" opacity={0.3} />
      <text x={80} y={68} textAnchor="middle" fill={color} fontSize="24">?</text>
    </svg>
  )
  return <Comp color={color} />
}
