import React from 'react'

// ─── SHARED COLORS ──────────────────────────────────────────────────────────
const C = {
  body: '#e2e8f0',
  joint: '#94a3b8',
  accent: '#f97316',
  violet: '#8b5cf6',
  ground: '#1e293b',
}

// ─── BASE STICK FIGURE PARTS ────────────────────────────────────────────────
const Head = ({ cx, cy, r = 10, color = C.body }) => (
  <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="2.5" />
)

// ─── 1. CRUNCH (lying, upper body rises) ────────────────────────────────────
const CrunchAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* ground */}
    <line x1="10" y1="98" x2="150" y2="98" stroke={C.ground} strokeWidth="2" />
    {/* legs (static) */}
    <line x1="80" y1="85" x2="110" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    <line x1="110" y1="98" x2="125" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    <line x1="80" y1="85" x2="65" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    <line x1="65" y1="98" x2="50" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    {/* upper body animated */}
    <g className="animate-crunch" style={{ transformOrigin: '80px 85px' }}>
      <Head cx={80} cy={55} r={9} color={color} />
      <line x1="80" y1="64" x2="80" y2="85" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* arms */}
      <line x1="80" y1="68" x2="68" y2="78" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1="78" x2="72" y2="62" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="68" x2="92" y2="78" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="92" y1="78" x2="88" y2="62" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 2. FLUTTER KICKS ───────────────────────────────────────────────────────
const FlutterAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="90" x2="150" y2="90" stroke={C.ground} strokeWidth="2" />
    {/* body (static lying) */}
    <Head cx={25} cy={75} r={9} color={color} />
    <line x1="25" y1="84" x2="120" y2="84" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* left leg flutter */}
    <g className="animate-flutter-l" style={{ transformOrigin: '120px 84px' }}>
      <line x1="120" y1="84" x2="148" y2="72" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    </g>
    {/* right leg flutter (offset) */}
    <g className="animate-flutter-r" style={{ transformOrigin: '120px 84px' }}>
      <line x1="120" y1="84" x2="148" y2="80" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    </g>
    {/* arms behind head */}
    <line x1="25" y1="75" x2="18" y2="65" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="25" y1="75" x2="32" y2="65" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

// ─── 3. LEG RAISE ───────────────────────────────────────────────────────────
const LegRaiseAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="90" x2="150" y2="90" stroke={C.ground} strokeWidth="2" />
    <Head cx={25} cy={75} r={9} color={color} />
    <line x1="25" y1="84" x2="110" y2="84" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="25" y1="75" x2="18" y2="65" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="25" y1="75" x2="32" y2="65" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* both legs together, animated */}
    <g className="animate-leg-raise" style={{ transformOrigin: '110px 84px' }}>
      <line x1="110" y1="84" x2="138" y2="84" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="138" y1="84" x2="150" y2="84" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 4. BICYCLE / SEATED BICYCLE ────────────────────────────────────────────
const BicycleAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="102" x2="150" y2="102" stroke={C.ground} strokeWidth="2" />
    {/* seated torso */}
    <Head cx={60} cy={52} r={9} color={color} />
    <line x1="60" y1="61" x2="60" y2="88" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* hips */}
    <line x1="50" y1="88" x2="72" y2="88" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* left arm (behind head elbow) */}
    <line x1="60" y1="65" x2="50" y2="58" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="50" y1="58" x2="46" y2="50" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* right arm */}
    <line x1="60" y1="65" x2="70" y2="58" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="70" y1="58" x2="74" y2="50" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* left leg - animated bicycle motion */}
    <g className="animate-bicycle" style={{ transformOrigin: '50px 88px' }}>
      <line x1="50" y1="88" x2="38" y2="100" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="100" x2="32" y2="100" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    </g>
    {/* right leg - opposite phase */}
    <g style={{ transformOrigin: '72px 88px', animation: 'bicycle 1.2s ease-in-out infinite reverse' }}>
      <line x1="72" y1="88" x2="84" y2="100" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
      <line x1="84" y1="100" x2="90" y2="100" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 5. EXTEND TO TUCK ──────────────────────────────────────────────────────
const ExtendTuckAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="90" x2="150" y2="90" stroke={C.ground} strokeWidth="2" />
    <Head cx={30} cy={75} r={9} color={color} />
    <line x1="30" y1="84" x2="80" y2="84" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* arms reaching to knees */}
    <line x1="40" y1="78" x2="70" y2="72" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="40" y1="78" x2="70" y2="88" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* legs animating extend ↔ tuck */}
    <g className="animate-leg-raise" style={{ transformOrigin: '80px 84px' }}>
      <line x1="80" y1="84" x2="115" y2="84" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="115" y1="84" x2="130" y2="84" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 6. SEATED TWIST (Russian Twist / L-Sit) ─────────────────────────────────
const SeatedTwistAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="98" x2="150" y2="98" stroke={C.ground} strokeWidth="2" />
    <Head cx={60} cy={55} r={9} color={color} />
    {/* torso animated twist */}
    <g className="animate-twist" style={{ transformOrigin: '60px 85px' }}>
      <line x1="60" y1="64" x2="60" y2="85" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* arms holding weight */}
      <line x1="60" y1="72" x2="45" y2="78" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={42} cy={79} r={5} fill={C.joint} />
      <line x1="60" y1="72" x2="75" y2="78" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    </g>
    {/* legs (V-sit) */}
    <line x1="60" y1="85" x2="45" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    <line x1="60" y1="85" x2="75" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
  </svg>
)

// ─── 7. HOLLOW HOLD ─────────────────────────────────────────────────────────
const HollowAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="92" x2="150" y2="92" stroke={C.ground} strokeWidth="2" />
    <g className="animate-float" style={{ transformOrigin: '80px 80px' }}>
      <Head cx={22} cy={72} r={9} color={color} />
      {/* body in banana hollow shape */}
      <path d="M 22 80 Q 80 70 138 68" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* arms above head */}
      <line x1="22" y1="72" x2="10" y2="62" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="62" x2="6" y2="60" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      {/* legs together lifted */}
      <line x1="138" y1="68" x2="150" y2="65" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 8. TOE TOUCH (lying) ───────────────────────────────────────────────────
const ToeTouchAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="92" x2="150" y2="92" stroke={C.ground} strokeWidth="2" />
    <Head cx={25} cy={74} r={9} color={color} />
    <line x1="25" y1="83" x2="80" y2="83" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* legs straight up (static) */}
    <line x1="80" y1="83" x2="100" y2="60" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
    <line x1="80" y1="83" x2="90" y2="60" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
    {/* arms reach up animated */}
    <g className="animate-crunch" style={{ transformOrigin: '25px 83px' }}>
      <line x1="25" y1="76" x2="14" y2="68" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="14" y1="68" x2="12" y2="64" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="25" y1="76" x2="36" y2="68" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="68" x2="38" y2="64" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 9. SCISSORS ────────────────────────────────────────────────────────────
const ScissorsAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="92" x2="150" y2="92" stroke={C.ground} strokeWidth="2" />
    <Head cx={22} cy={74} r={9} color={color} />
    <line x1="22" y1="83" x2="110" y2="83" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="22" y1="74" x2="14" y2="64" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="22" y1="74" x2="30" y2="64" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* left leg */}
    <g className="animate-scissors-l" style={{ transformOrigin: '110px 83px' }}>
      <line x1="110" y1="83" x2="138" y2="66" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
    </g>
    {/* right leg */}
    <g className="animate-scissors-r" style={{ transformOrigin: '110px 83px' }}>
      <line x1="110" y1="83" x2="138" y2="75" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 10. CROSS CRUNCH ───────────────────────────────────────────────────────
const CrossCrunchAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="98" x2="150" y2="98" stroke={C.ground} strokeWidth="2" />
    {/* legs bent */}
    <line x1="80" y1="85" x2="108" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    <line x1="80" y1="85" x2="55" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    {/* upper body diagonal crunch */}
    <g className="animate-crunch" style={{ transformOrigin: '80px 85px' }}>
      <Head cx={80} cy={56} r={9} color={color} />
      <line x1="80" y1="65" x2="80" y2="85" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* cross arm motion */}
      <line x1="80" y1="70" x2="66" y2="76" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="76" x2="58" y2="65" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="70" x2="94" y2="80" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 11. SIDE PLANK DIPS ────────────────────────────────────────────────────
const SidePlankAnim = ({ color, side = 'r' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ transform: side === 'l' ? 'scaleX(-1)' : 'none' }} className="w-full h-full">
    <line x1="10" y1="98" x2="150" y2="98" stroke={C.ground} strokeWidth="2" />
    <g className="animate-side-dip" style={{ transformOrigin: '80px 80px' }}>
      {/* body side-on */}
      <Head cx={28} cy={64} r={9} color={color} />
      <line x1="28" y1="73" x2="120" y2="90" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      {/* top arm raised */}
      <line x1="65" y1="80" x2="65" y2="62" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      {/* support arm */}
      <line x1="28" y1="75" x2="28" y2="90" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      {/* feet */}
      <line x1="120" y1="90" x2="130" y2="90" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 12. MOUNTAIN CLIMBERS ──────────────────────────────────────────────────
const MountainAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="98" x2="150" y2="98" stroke={C.ground} strokeWidth="2" />
    {/* plank body */}
    <Head cx={130} cy={55} r={9} color={color} />
    <line x1="130" y1="64" x2="38" y2="82" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* hands */}
    <line x1="130" y1="68" x2="130" y2="82" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="130" y1="82" x2="136" y2="82" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* right foot static */}
    <line x1="38" y1="82" x2="25" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    {/* left knee drives in */}
    <g className="animate-mountain" style={{ transformOrigin: '38px 82px' }}>
      <line x1="38" y1="82" x2="52" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 13. PLANK KNEE TUCK ────────────────────────────────────────────────────
const PlankKneeAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="98" x2="150" y2="98" stroke={C.ground} strokeWidth="2" />
    <Head cx={130} cy={55} r={9} color={color} />
    <line x1="130" y1="64" x2="38" y2="80" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="130" y1="68" x2="130" y2="82" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* both knees tuck */}
    <g className="animate-plank-knee" style={{ transformOrigin: '38px 80px' }}>
      <line x1="38" y1="80" x2="52" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="80" x2="44" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 14. SPIDER CRUNCH ──────────────────────────────────────────────────────
const SpiderAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="98" x2="150" y2="98" stroke={C.ground} strokeWidth="2" />
    <Head cx={130} cy={55} r={9} color={color} />
    <line x1="130" y1="64" x2="38" y2="80" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="130" y1="68" x2="130" y2="82" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* right foot static */}
    <line x1="38" y1="80" x2="22" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    {/* left knee to left elbow */}
    <g className="animate-plank-knee" style={{ transformOrigin: '38px 80px' }}>
      <line x1="38" y1="80" x2="50" y2="70" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="70" x2="55" y2="80" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 15. REVERSE CRUNCH ─────────────────────────────────────────────────────
const ReverseCrunchAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="92" x2="150" y2="92" stroke={C.ground} strokeWidth="2" />
    {/* upper body (static lying) */}
    <Head cx={25} cy={74} r={9} color={color} />
    <line x1="25" y1="83" x2="80" y2="83" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="25" y1="74" x2="14" y2="64" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="25" y1="74" x2="36" y2="64" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* hips + legs rise */}
    <g className="animate-leg-raise" style={{ transformOrigin: '80px 83px' }}>
      <line x1="80" y1="83" x2="100" y2="75" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="75" x2="110" y2="78" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="75" x2="108" y2="72" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 16. LEG CIRCLE ─────────────────────────────────────────────────────────
const LegCircleAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="92" x2="150" y2="92" stroke={C.ground} strokeWidth="2" />
    <Head cx={22} cy={74} r={9} color={color} />
    <line x1="22" y1="83" x2="100" y2="83" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="22" y1="74" x2="14" y2="64" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="22" y1="74" x2="30" y2="64" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* one leg makes circles */}
    <g style={{ transformOrigin: '100px 83px', animation: 'spin-slow 2s linear infinite' }}>
      <line x1="100" y1="83" x2="128" y2="72" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
    </g>
    {/* other leg static */}
    <line x1="100" y1="83" x2="128" y2="83" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
  </svg>
)

// ─── 17. HEEL TAP ───────────────────────────────────────────────────────────
const HeelTapAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="92" x2="150" y2="92" stroke={C.ground} strokeWidth="2" />
    <Head cx={80} cy={52} r={9} color={color} />
    <line x1="80" y1="61" x2="80" y2="80" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* bent knees */}
    <line x1="80" y1="80" x2="60" y2="92" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    <line x1="60" y1="92" x2="55" y2="92" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    <line x1="80" y1="80" x2="100" y2="92" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    <line x1="100" y1="92" x2="105" y2="92" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    {/* side-to-side arm tap animated */}
    <g className="animate-twist" style={{ transformOrigin: '80px 70px' }}>
      <line x1="80" y1="68" x2="60" y2="74" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="74" x2="56" y2="92" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="68" x2="100" y2="74" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 18. BUTTERFLY CRUNCH ───────────────────────────────────────────────────
const ButterflyAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="98" x2="150" y2="98" stroke={C.ground} strokeWidth="2" />
    {/* feet together soles */}
    <line x1="65" y1="98" x2="95" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    {/* butterfly legs */}
    <line x1="65" y1="98" x2="55" y2="86" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    <line x1="95" y1="98" x2="105" y2="86" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    {/* crunch upper body */}
    <g className="animate-crunch" style={{ transformOrigin: '80px 86px' }}>
      <Head cx={80} cy={57} r={9} color={color} />
      <line x1="80" y1="66" x2="80" y2="86" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* elbows wide */}
      <line x1="80" y1="70" x2="62" y2="62" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="70" x2="98" y2="62" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 19. L-SIT CROSS TOE TOUCH ──────────────────────────────────────────────
const LSitAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="98" x2="150" y2="98" stroke={C.ground} strokeWidth="2" />
    <Head cx={45} cy={52} r={9} color={color} />
    <line x1="45" y1="61" x2="45" y2="85" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* L-sit legs */}
    <line x1="45" y1="85" x2="95" y2="85" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    <line x1="95" y1="85" x2="115" y2="85" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    {/* support hands */}
    <line x1="45" y1="78" x2="34" y2="85" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* cross arm reach animated */}
    <g className="animate-twist" style={{ transformOrigin: '45px 68px' }}>
      <line x1="45" y1="68" x2="76" y2="80" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="76" y1="80" x2="90" y2="76" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 20. OBLIQUE CRUNCH KICK ────────────────────────────────────────────────
const ObliqueKickAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="98" x2="150" y2="98" stroke={C.ground} strokeWidth="2" />
    <line x1="80" y1="85" x2="108" y2="98" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    {/* kicking leg */}
    <g className="animate-flutter-l" style={{ transformOrigin: '80px 85px' }}>
      <line x1="80" y1="85" x2="55" y2="72" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="72" x2="40" y2="68" stroke={C.body} strokeWidth="3" strokeLinecap="round" />
    </g>
    <g className="animate-crunch" style={{ transformOrigin: '80px 85px' }}>
      <Head cx={80} cy={56} r={9} color={color} />
      <line x1="80" y1="65" x2="80" y2="85" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="80" y1="70" x2="66" y2="76" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="70" x2="94" y2="76" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── 21. LEG SWITCH ─────────────────────────────────────────────────────────
const LegSwitchAnim = ({ color }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <line x1="10" y1="92" x2="150" y2="92" stroke={C.ground} strokeWidth="2" />
    <Head cx={22} cy={74} r={9} color={color} />
    <line x1="22" y1="83" x2="100" y2="83" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="22" y1="74" x2="14" y2="64" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="22" y1="74" x2="30" y2="64" stroke={C.body} strokeWidth="2.5" strokeLinecap="round" />
    {/* alternating legs */}
    <g className="animate-flutter-l" style={{ transformOrigin: '100px 83px' }}>
      <line x1="100" y1="83" x2="132" y2="65" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
    </g>
    <g className="animate-flutter-r" style={{ transformOrigin: '100px 83px' }}>
      <line x1="100" y1="83" x2="132" y2="80" stroke={C.body} strokeWidth="3.5" strokeLinecap="round" />
    </g>
  </svg>
)

// ─── KEGEL: BREATHE RING ─────────────────────────────────────────────────────
export const KagelBreatheAnim = ({ phase = 'squeeze', color = '#8b5cf6' }) => {
  const isRest = phase === 'rest'
  const isSqueeze = phase === 'squeeze'

  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* outer glow ring */}
      <circle cx={80} cy={80} r={65}
        stroke={color} strokeWidth="1" strokeDasharray="4 6"
        opacity={0.3}
        style={{ animation: isRest ? 'none' : 'spin-slow 8s linear infinite' }}
      />
      {/* main breathing circle */}
      <circle cx={80} cy={80} r={isSqueeze ? 45 : 30}
        fill={`${color}22`}
        stroke={color} strokeWidth="2.5"
        style={{
          transition: 'r 0.6s ease-in-out',
          filter: `drop-shadow(0 0 ${isSqueeze ? 16 : 6}px ${color})`
        }}
      />
      {/* inner pulsing dot */}
      <circle cx={80} cy={80} r={isSqueeze ? 12 : 6}
        fill={color}
        style={{ transition: 'r 0.6s ease-in-out' }}
      />
      {/* direction arrows */}
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

// ─── KEGEL: ELEVATOR ─────────────────────────────────────────────────────────
export const KagelElevatorAnim = ({ floor = 0, color = '#06b6d4' }) => {
  const floors = [0, 1, 2, 3]
  const activeColor = color
  const inactiveColor = '#1e293b'

  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* elevator shaft */}
      <rect x={55} y={20} width={50} height={120} rx={6}
        fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      {/* floors */}
      {floors.map((f) => {
        const y = 112 - f * 26
        const isActive = f <= floor
        return (
          <g key={f}>
            <rect x={62} y={y} width={36} height={18} rx={4}
              fill={isActive ? `${activeColor}33` : inactiveColor}
              stroke={isActive ? activeColor : '#334155'}
              strokeWidth={isActive ? 1.5 : 1}
            />
            <text x={80} y={y + 13} textAnchor="middle"
              fill={isActive ? activeColor : '#475569'}
              fontSize="9" fontWeight={isActive ? 'bold' : 'normal'}>
              {f + 1}F
            </text>
          </g>
        )
      })}
      {/* elevator car */}
      <rect x={63} y={112 - floor * 26 + 2} width={34} height={14} rx={3}
        fill={activeColor}
        opacity={0.9}
        style={{ transition: 'y 0.5s ease-in-out' }}
      />
    </svg>
  )
}

// ─── KEGEL: QUICK FLICK ──────────────────────────────────────────────────────
export const KagelFlickAnim = ({ active = false, color = '#f59e0b' }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={80} cy={80}
        r={25 + i * 20}
        stroke={color}
        strokeWidth={active ? 2 : 0.5}
        opacity={active ? 0.8 - i * 0.25 : 0.15}
        fill="none"
        style={{
          transition: 'all 0.15s ease',
          filter: active ? `drop-shadow(0 0 8px ${color})` : 'none'
        }}
      />
    ))}
    <circle cx={80} cy={80} r={18}
      fill={active ? color : `${color}44`}
      style={{ transition: 'fill 0.15s ease' }}
    />
    <text x={80} y={85} textAnchor="middle"
      fill={active ? '#000' : color}
      fontSize="11" fontWeight="bold">
      {active ? '◉' : '○'}
    </text>
  </svg>
)

// ─── KEGEL: REVERSE ──────────────────────────────────────────────────────────
export const KagelReverseAnim = ({ phase = 'rest', color = '#10b981' }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* outer ring expanding */}
    <circle cx={80} cy={80} r={phase === 'squeeze' ? 60 : 35}
      fill={`${color}15`}
      stroke={color} strokeWidth="1.5" strokeDasharray="8 4"
      style={{ transition: 'r 0.8s ease-in-out' }}
    />
    {/* middle */}
    <circle cx={80} cy={80} r={phase === 'squeeze' ? 40 : 22}
      fill={`${color}25`}
      stroke={color} strokeWidth="2"
      style={{ transition: 'r 0.8s ease-in-out' }}
    />
    {/* arrows pointing outward (release) */}
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
  // Kegel animations exported separately above
}

export default function ExerciseAnimation({ animType, color = '#f97316' }) {
  const Comp = animMap[animType]
  if (!Comp) return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <circle cx={80} cy={80} r={50} fill="none" stroke={color} strokeWidth="2" className="animate-pulse-ring" />
      <text x={80} y={88} textAnchor="middle" fill={color} fontSize="28">?</text>
    </svg>
  )
  if (typeof Comp === 'function' && Comp.length === 0) {
    return <Comp color={color} />
  }
  return <Comp color={color} />
}
