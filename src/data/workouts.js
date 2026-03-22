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

  // ─── WORKOUT 3: Daily Routine — mixed 30s / 60s ────────────────────────────
  {
    id: 'daily-routine',
    title: 'Daily Routine',
    subtitle: 'Mobility & flow · no rest',
    emoji: '🌅',
    color: '#10b981',       // emerald
    glow: 'rgba(16,185,129,0.3)',
    workSec: 30,            // default — overridden per exercise
    restSec: 0,
    type: 'timed',
    exercises: [
      // — 30 sec block —
      { id: 'hopping-around',    name: 'Hopping Around',       anim: 'hopping',        cue: 'Light bouncy hops, stay loose',       workSec: 30 },
      { id: 'lymphatic-hops',    name: 'Lymphatic Hops',       anim: 'lymphatic-hops', cue: 'Gentle heel bounces, arms relaxed',   workSec: 30 },
      { id: 'whipping-arms',     name: 'Whipping Arms Release',anim: 'whipping-arms',  cue: 'Let arms flop freely, shake it out',  workSec: 30 },
      { id: 'heart-openers',     name: 'Heart Openers',        anim: 'heart-openers',  cue: 'Open chest wide, squeeze shoulder blades', workSec: 30 },
      // — 1 min block —
      { id: 'arm-swings',        name: 'Arm Swings',           anim: 'arm-swings',     cue: 'Big forward & backward circles',      workSec: 60 },
      { id: 'spinal-waves',      name: 'Spinal Waves',         anim: 'spinal-waves',   cue: 'Roll through each vertebra slowly',   workSec: 60 },
      { id: 'dead-arms',         name: 'Dead Arms',            anim: 'dead-arms',      cue: 'Twist torso, let arms swing freely',  workSec: 60 },
      { id: 'trunk-twists',      name: 'Trunk Twists',         anim: 'trunk-twists',   cue: 'Rotate from the hips, look behind',   workSec: 60 },
      { id: 'golf-arms',         name: 'Golf Arms',            anim: 'golf-arms',      cue: 'Smooth rotational swing motion',      workSec: 60 },
      { id: 'marches-knee',      name: 'Marches Knee Steps',   anim: 'marches',        cue: 'High knees, pump arms',               workSec: 60 },
      { id: 'windmill',          name: 'Windmill',             anim: 'windmill',        cue: 'Opposite hand to foot, stay long',    workSec: 60 },
      { id: 'ballet-squats',     name: 'Ballet Squats',        anim: 'ballet-squat',   cue: 'Wide stance, toes out, back straight',workSec: 60 },
      { id: 'horse-stance',      name: 'Horse Stance',         anim: 'horse-stance',   cue: 'Deep wide squat, hold strong',        workSec: 60 },
      { id: 'body-tapping',      name: 'Body Tapping',         anim: 'body-tapping',   cue: 'Tap arms, chest, legs — wake up the body', workSec: 60 },
    ]
  },

  // ─── WORKOUT 4: 12 Steps Short Workout — 30s work / 10s rest ──────────────
  {
    id: 'twelve-steps',
    title: '12 Steps',
    subtitle: '30 sec work · 10 sec rest',
    emoji: '⚡',
    color: '#ef4444',       // red
    glow: 'rgba(239,68,68,0.3)',
    workSec: 30,
    restSec: 10,
    type: 'timed',
    exercises: [
      { id: 'push-ups',       name: 'Push Ups',              anim: 'push-up',       cue: 'Chest to floor, full extension' },
      { id: 'prone-cobra',    name: 'Prone Cobra',           anim: 'prone-cobra',   cue: 'Lift chest, squeeze glutes, thumbs up' },
      { id: 'burpees',        name: 'Burpees',               anim: 'burpee',        cue: 'Drop, push, jump — full send' },
      { id: 'pike-push-up',   name: 'Pike Push Up',          anim: 'pike-push-up',  cue: 'Hips high, head between arms' },
      { id: 'squats',         name: 'Squats / Jump Squats',  anim: 'squat',         cue: 'Sit deep, explode up' },
      { id: 'lunges',         name: 'Lunges',                anim: 'lunge',         cue: 'Back knee nearly touches floor' },
      { id: 'leg-raises-12',  name: 'Leg Raises',            anim: 'leg-raise',     cue: 'Slow & controlled, no swinging' },
      { id: 'run-in-place',   name: 'Run in Place',          anim: 'run-in-place',  cue: 'Drive knees high, pump arms' },
      { id: 'kicks',          name: 'Kicks',                 anim: 'kicks',         cue: 'Front kicks, snap and retract' },
      { id: 'strikes',        name: 'Strikes',               anim: 'strikes',       cue: 'Alternate punches, twist from hips' },
      { id: 'jumps',          name: 'Jumps',                 anim: 'jumps',         cue: 'Soft landing, explode back up' },
      { id: 'plank-12',       name: 'Plank',                 anim: 'plank-hold',    cue: 'Straight line — squeeze everything' },
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
