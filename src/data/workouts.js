// ─── ANIMATION TYPE MAP ─────────────────────────────────────────────────────
// Each exercise maps to a visual animation style
// Types: crunch | leg-raise | flutter | seated-twist | plank | side-plank |
//        mountain | toe-touch | scissors | hollow | leg-circle | extend-tuck |
//        reverse-crunch | bicycle | spider | kegel-breathe | timer-ring

export const WORKOUTS = [
  // ─── WORKOUT 1: 10 Min Abs — 30 sec work / 5 sec rest ───────────────────
  {
    id: 'abs-30-5',
    title: '10 Min Abs',
    subtitle: '30 sec work · 5 sec rest',
    emoji: '🔥',
    color: '#f97316',       // orange
    glow: 'rgba(249,115,22,0.3)',
    workSec: 30,
    restSec: 5,
    type: 'timed',          // reps vs timed
    exercises: [
      { id: 'crunches',           name: 'Crunches',                 anim: 'crunch',        cue: 'Chin up, exhale on lift' },
      { id: 'flutter-kicks',      name: 'Flutter Kicks',            anim: 'flutter',       cue: 'Keep lower back flat' },
      { id: 'leg-raises',         name: 'Leg Raises',               anim: 'leg-raise',     cue: 'Slow & controlled' },
      { id: 'seated-bicycles',    name: 'Seated Bicycles',          anim: 'bicycle',       cue: 'Elbow to opposite knee' },
      { id: 'extend-tuck',        name: 'Extend to Tuck',           anim: 'extend-tuck',   cue: 'Full extension, pull in knees' },
      { id: 'oblique-crunch-kick',name: 'Oblique Crunch Kicks',     anim: 'oblique-kick',  cue: 'Kick as you crunch' },
      { id: 'tabletop-crunches',  name: 'Tabletop Crunches',        anim: 'crunch',        cue: '90° at hips & knees' },
      { id: 'reverse-crunches',   name: 'Reverse Crunches',         anim: 'reverse-crunch',cue: 'Lift hips, not legs' },
      { id: 'russian-twist',      name: 'Russian Twist',            anim: 'seated-twist',  cue: 'Rotate from the core' },
      { id: 'leg-circles',        name: 'Leg Circles',              anim: 'leg-circle',    cue: 'Keep circles small & tight' },
      { id: 'hollow-hold',        name: 'Hollow Hold',              anim: 'hollow',        cue: 'Press lower back to floor' },
      { id: 'toe-touches',        name: 'Toe Touches',              anim: 'toe-touch',     cue: 'Reach up, not forward' },
      { id: 'l-sit-toe-touch',    name: 'L-Sit Cross Toe Touches',  anim: 'l-sit-touch',   cue: 'Alternate sides' },
      { id: 'scissors',           name: 'Scissors',                 anim: 'scissors',      cue: 'Keep legs low for more burn' },
      { id: 'cross-crunches',     name: 'Cross Crunches',           anim: 'cross-crunch',  cue: 'Elbow meets opposite knee' },
      { id: 'side-plank-r',       name: 'Side Plank Dips R',        anim: 'side-plank-r',  cue: 'Hips drop below mat level' },
      { id: 'side-plank-l',       name: 'Side Plank Dips L',        anim: 'side-plank-l',  cue: 'Keep neck neutral' },
      { id: 'mountain-climbers',  name: 'Mountain Climbers',        anim: 'mountain',      cue: 'Hips level, drive knees in' },
    ]
  },

  // ─── WORKOUT 2: 10 Min Abs — 50 sec work / 10 sec rest ──────────────────
  {
    id: 'abs-50-10',
    title: '10 Min Abs',
    subtitle: '50 sec work · 10 sec rest',
    emoji: '💪',
    color: '#8b5cf6',       // violet
    glow: 'rgba(139,92,246,0.3)',
    workSec: 50,
    restSec: 10,
    type: 'timed',
    exercises: [
      { id: 'leg-switches',         name: 'Leg Switches',               anim: 'leg-switch',     cue: 'Alternate legs fast' },
      { id: 'rev-crunch-openers',   name: 'Reverse Crunch + Openers',   anim: 'reverse-crunch', cue: 'Open legs at the top' },
      { id: 'leg-lowers',           name: 'Leg Lowers',                 anim: 'leg-raise',      cue: 'Lower slowly — 4 counts' },
      { id: 'scissor-crossovers',   name: 'Scissor Crossovers',         anim: 'scissors',       cue: 'Cross & uncross with control' },
      { id: 'cross-crunches-2',     name: 'Cross Crunches',             anim: 'cross-crunch',   cue: 'Full rotation each rep' },
      { id: 'butterfly-crunches',   name: 'Butterfly Crunches',         anim: 'butterfly',      cue: 'Elbows out, soles together' },
      { id: 'single-leg-extension', name: 'Single Leg Extension',       anim: 'leg-raise',      cue: 'Brace core, extend slowly' },
      { id: 'oblique-heel-taps',    name: 'Oblique Heel Taps',          anim: 'heel-tap',       cue: 'Side to side, feel the stretch' },
      { id: 'plank-knee-tucks',     name: 'Plank Knee Tucks',           anim: 'plank-knee',     cue: 'Tuck both knees to chest' },
      { id: 'spider-crunches',      name: 'Spider Crunches',            anim: 'spider',         cue: 'Knee to same-side elbow' },
    ]
  },
]

// ─── KEGEL PROGRAM ──────────────────────────────────────────────────────────
export const KEGEL_WEEKS = [
  // ── Week 1–2: ~5 min sessions ─────────────────────────────────────────
  {
    week: 1, label: 'Week 1–2 · Learning',
    description: 'Isolate the muscle. Lying position only.',
    sessions: {
      morning: [
        { name: 'Long Hold',    holdSec: 3, restSec: 3, reps: 12, sets: 3, anim: 'kegel-breathe', cue: 'Breathe out on squeeze ↑' },
        { name: 'Quick Flicks', holdSec: 1, restSec: 1, reps: 20, sets: 2, anim: 'kegel-flick',   cue: 'Fast contract & release' },
      ],
      evening: [
        { name: 'Long Hold',    holdSec: 3, restSec: 3, reps: 12, sets: 3, anim: 'kegel-breathe', cue: 'Full release between reps' },
        { name: 'Quick Flicks', holdSec: 1, restSec: 1, reps: 20, sets: 2, anim: 'kegel-flick',   cue: 'Control the release' },
      ]
    }
  },
  // ── Week 3–4: ~7 min sessions ─────────────────────────────────────────
  {
    week: 3, label: 'Week 3–4 · Building',
    description: 'Add Elevator & Reverse. Try seated position.',
    sessions: {
      morning: [
        { name: 'Long Hold',       holdSec: 5, restSec: 5, reps: 10, sets: 3, anim: 'kegel-breathe', cue: 'Hold steady — no breath-holding' },
        { name: 'Quick Flicks',    holdSec: 1, restSec: 1, reps: 20, sets: 2, anim: 'kegel-flick',   cue: 'Rapid fire' },
        { name: 'Elevator Kegels', holdSec: 3, restSec: 3, reps: 5,  sets: 2, anim: 'kegel-elevator',cue: '4 floors up, 4 floors down' },
      ],
      evening: [
        { name: 'Long Hold',       holdSec: 5, restSec: 5, reps: 10, sets: 2, anim: 'kegel-breathe', cue: 'Try seated position' },
        { name: 'Quick Flicks',    holdSec: 1, restSec: 1, reps: 15, sets: 2, anim: 'kegel-flick',   cue: 'Stay relaxed between flicks' },
        { name: 'Reverse Kegels',  holdSec: 5, restSec: 5, reps: 8,  sets: 2, anim: 'kegel-reverse', cue: 'Active release & lengthen' },
      ]
    }
  },
  // ── Week 5–6: ~10 min sessions ────────────────────────────────────────
  {
    week: 5, label: 'Week 5–6 · Endurance',
    description: '8-second holds. Add standing position.',
    sessions: {
      morning: [
        { name: 'Long Hold',       holdSec: 8, restSec: 8, reps: 10, sets: 3, anim: 'kegel-breathe', cue: 'Try standing position' },
        { name: 'Quick Flicks',    holdSec: 1, restSec: 1, reps: 20, sets: 2, anim: 'kegel-flick',   cue: 'Max speed' },
        { name: 'Elevator Kegels', holdSec: 3, restSec: 3, reps: 6,  sets: 2, anim: 'kegel-elevator',cue: 'Full 4-floor sequence' },
      ],
      evening: [
        { name: 'Long Hold',       holdSec: 8, restSec: 8, reps: 10, sets: 2, anim: 'kegel-breathe', cue: 'Breathe — don\'t hold breath' },
        { name: 'Quick Flicks',    holdSec: 1, restSec: 1, reps: 20, sets: 2, anim: 'kegel-flick',   cue: 'Quick bursts, full release' },
        { name: 'Reverse Kegels',  holdSec: 8, restSec: 5, reps: 8,  sets: 2, anim: 'kegel-reverse', cue: 'Conscious lengthening' },
      ]
    }
  },
  // ── Week 7+: ~12 min sessions ─────────────────────────────────────────
  {
    week: 7, label: 'Week 7+ · Integration',
    description: '10-second holds. Functional Kegels daily.',
    sessions: {
      morning: [
        { name: 'Long Hold',       holdSec: 10, restSec: 10, reps: 10, sets: 3, anim: 'kegel-breathe', cue: 'Standing — max challenge' },
        { name: 'Quick Flicks',    holdSec: 1,  restSec: 1,  reps: 20, sets: 2, anim: 'kegel-flick',   cue: 'Stay relaxed between flicks' },
        { name: 'Elevator Kegels', holdSec: 3,  restSec: 3,  reps: 8,  sets: 2, anim: 'kegel-elevator',cue: 'Smooth floors, no jumping' },
      ],
      evening: [
        { name: 'Long Hold',       holdSec: 10, restSec: 10, reps: 10, sets: 2, anim: 'kegel-breathe', cue: 'Full release — as important as squeeze' },
        { name: 'Quick Flicks',    holdSec: 1,  restSec: 1,  reps: 20, sets: 2, anim: 'kegel-flick',   cue: 'Quick bursts between holds' },
        { name: 'Reverse Kegels',  holdSec: 10, restSec: 5,  reps: 8,  sets: 1, anim: 'kegel-reverse', cue: 'Relax & lengthen down' },
        { name: 'Elevator Kegels', holdSec: 3,  restSec: 3,  reps: 8,  sets: 1, anim: 'kegel-elevator',cue: 'Feel each floor' },
      ]
    }
  }
]

export const DEFAULT_SETTINGS = {
  kegelWeek: 1,
  morningTime: '07:00',
  eveningTime: '20:00',
  notificationsEnabled: false,
  streakDays: 0,
  lastWorkoutDate: null,
  completedWorkouts: [],   // array of { date, workoutId, durationSec }
}
