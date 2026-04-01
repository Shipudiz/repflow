// ─── ANIMATION TYPE MAP ─────────────────────────────────────────────────────
// Each exercise maps to a visual animation style
// Types: crunch | leg-raise | flutter | seated-twist | plank | side-plank |
//        mountain | toe-touch | scissors | hollow | leg-circle | extend-tuck |
//        reverse-crunch | bicycle | spider | kegel-breathe | timer-ring

export const WORKOUTS = [
  // ─── WORKOUT 1: 10 Min Abs — 30 sec work / 5 sec rest ───────────────────
  {
    id: 'abs-30-5',
    title: '#1 Abs 30/5',
    subtitle: '30 sec work · 5 sec rest',
    emoji: '🔥',
    thumb: '/workouts/abs-30-5-thumb.png',
    color: '#f97316',       // orange
    glow: 'rgba(249,115,22,0.3)',
    workSec: 30,
    restSec: 5,
    category: 'abs',
    type: 'timed',          // reps vs timed
    exercises: [
      { id: 'crunches',           gif: '/workouts/abs-30-5/crunches.gif',            name: 'Crunches',                 anim: 'crunch',        cue: 'Chin up, exhale on lift' },
      { id: 'flutter-kicks',      gif: '/workouts/abs-30-5/flutter-kicks.gif',      name: 'Flutter Kicks',            anim: 'flutter',       cue: 'Keep lower back flat' },
      { id: 'leg-raises',         gif: '/workouts/abs-30-5/leg-raises.gif',         name: 'Leg Raises',               anim: 'leg-raise',     cue: 'Slow & controlled' },
      { id: 'seated-bicycles',    gif: '/workouts/abs-30-5/seated-bicycles.gif',    name: 'Seated Bicycles',          anim: 'bicycle',       cue: 'Elbow to opposite knee' },
      { id: 'extend-tuck',        gif: '/workouts/abs-30-5/extend-tuck.gif',        name: 'Extend to Tuck',           anim: 'extend-tuck',   cue: 'Full extension, pull in knees' },
      { id: 'oblique-crunch-kick',gif: '/workouts/abs-30-5/oblique-crunch-kick.gif',name: 'Oblique Crunch Kicks',     anim: 'oblique-kick',  cue: 'Kick as you crunch' },
      { id: 'tabletop-crunches',  gif: '/workouts/abs-30-5/tabletop-crunches.gif',  name: 'Tabletop Crunches',        anim: 'crunch',        cue: '90° at hips & knees' },
      { id: 'reverse-crunches',   gif: '/workouts/abs-30-5/reverse-crunches.gif',   name: 'Reverse Crunches',         anim: 'reverse-crunch',cue: 'Lift hips, not legs' },
      { id: 'russian-twist',      gif: '/workouts/abs-30-5/russian-twist.gif',      name: 'Russian Twist',            anim: 'seated-twist',  cue: 'Rotate from the core' },
      { id: 'leg-circles',        gif: '/workouts/abs-30-5/leg-circles.gif',        name: 'Leg Circles',              anim: 'leg-circle',    cue: 'Keep circles small & tight' },
      { id: 'hollow-hold',        gif: '/workouts/abs-30-5/hollow-hold.gif',        name: 'Hollow Hold',              anim: 'hollow',        cue: 'Press lower back to floor' },
      { id: 'l-sit-toe-touch',    gif: '/workouts/abs-30-5/l-sit-toe-touch.gif',    name: 'L-Sit Cross Toe Touches',  anim: 'l-sit-touch',   cue: 'Alternate sides' },
      { id: 'scissors',           gif: '/workouts/abs-30-5/scissors.gif',           name: 'Scissors',                 anim: 'scissors',      cue: 'Keep legs low for more burn' },
      { id: 'cross-crunches',     gif: '/workouts/abs-30-5/cross-crunches.gif',     name: 'Cross Crunches',           anim: 'cross-crunch',  cue: 'Elbow meets opposite knee' },
      { id: 'side-plank-r',       gif: '/workouts/abs-30-5/side-plank-r.gif',       name: 'Side Plank Dips R',        anim: 'side-plank-r',  cue: 'Hips drop below mat level' },
      { id: 'side-plank-l',       gif: '/workouts/abs-30-5/side-plank-l.gif',       name: 'Side Plank Dips L',        anim: 'side-plank-l',  cue: 'Keep neck neutral' },
      { id: 'mountain-climbers',  gif: '/workouts/abs-30-5/mountain-climbers.gif',  name: 'Mountain Climbers',        anim: 'mountain',      cue: 'Hips level, drive knees in' },
    ]
  },

  // ─── WORKOUT 2: 10 Min Abs — 50 sec work / 10 sec rest ──────────────────
  {
    id: 'abs-50-10',
    title: '#2 Abs 50/10',
    subtitle: '50 sec work · 10 sec rest',
    emoji: '💪',
    thumb: '/workouts/abs-50-10-thumb.png',
    color: '#8b5cf6',       // violet
    glow: 'rgba(139,92,246,0.3)',
    workSec: 50,
    restSec: 10,
    category: 'abs',
    type: 'timed',
    exercises: [
      { id: 'leg-switches',         gif: '/workouts/abs-50-10/leg-switches.gif',         name: 'Leg Switches',               anim: 'leg-switch',     cue: 'Alternate legs fast' },
      { id: 'rev-crunch-openers',   gif: '/workouts/abs-50-10/rev-crunch-openers.gif',   name: 'Reverse Crunch + Openers',   anim: 'reverse-crunch', cue: 'Open legs at the top' },
      { id: 'leg-lowers',           gif: '/workouts/abs-50-10/leg-lowers.gif',           name: 'Leg Lowers',                 anim: 'leg-raise',      cue: 'Lower slowly — 4 counts' },
      { id: 'scissor-crossovers',   gif: '/workouts/abs-50-10/scissor-crossovers.gif',   name: 'Scissor Crossovers',         anim: 'scissors',       cue: 'Cross & uncross with control' },
      { id: 'cross-crunches-2',     gif: '/workouts/abs-50-10/cross-crunches-2.gif',     name: 'Cross Crunches',             anim: 'cross-crunch',   cue: 'Full rotation each rep' },
      { id: 'butterfly-crunches',   gif: '/workouts/abs-50-10/butterfly-crunches.gif',   name: 'Butterfly Crunches',         anim: 'butterfly',      cue: 'Elbows out, soles together' },
      { id: 'single-leg-extension', gif: '/workouts/abs-50-10/single-leg-extension.gif', name: 'Single Leg Extension',       anim: 'leg-raise',      cue: 'Brace core, extend slowly' },
      { id: 'oblique-heel-taps',    gif: '/workouts/abs-50-10/oblique-heel-taps.gif',    name: 'Oblique Heel Taps',          anim: 'heel-tap',       cue: 'Side to side, feel the stretch' },
      { id: 'plank-knee-tucks',     gif: '/workouts/abs-50-10/plank-knee-tucks.gif',     name: 'Plank Knee Tucks',           anim: 'plank-knee',     cue: 'Tuck both knees to chest' },
      { id: 'spider-crunches',      gif: '/workouts/abs-50-10/spider-crunches.gif',      name: 'Spider Crunches',            anim: 'spider',         cue: 'Knee to same-side elbow' },
    ]
  },

  // ─── WORKOUT 3: Abs 50/10 v2 — 10 min ──────────────────────────────────────
  {
    id: 'abs-50-10-v2',
    title: '#3 Abs 50/10',
    subtitle: '50 sec work · 10 sec rest',
    emoji: '🔥',
    thumb: '/workouts/abs-50-10-v2-thumb.png',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.3)',
    workSec: 50,
    restSec: 10,
    category: 'abs',
    type: 'timed',
    exercises: [
      { id: 'reverse-crunches-3',    gif: '/workouts/abs-50-10-v2/reverse-crunches.gif',           name: 'Reverse Crunches',           anim: 'reverse-crunch', cue: 'Lift hips, not just legs' },
      { id: 'leg-raises-3',          gif: '/workouts/abs-50-10-v2/leg-raises.gif',                 name: 'Leg Raises',                 anim: 'leg-raise',      cue: 'Slow & controlled' },
      { id: 'scissor-crossovers-3',  gif: '/workouts/abs-50-10-v2/scissor-crossovers.gif',         name: 'Scissor Crossovers',         anim: 'scissors',       cue: 'Cross & uncross with control' },
      { id: 'slow-bicycles',         gif: '/workouts/abs-50-10-v2/slow-bicycles.gif',              name: 'Slow Bicycles',              anim: 'bicycle',        cue: 'Slow and deliberate each rep' },
      { id: 'leg-switches-3',        gif: '/workouts/abs-50-10-v2/leg-switches.gif',               name: 'Leg Switches',               anim: 'leg-switch',     cue: 'Alternate legs fast' },
      { id: 'straight-leg-sit-up',   gif: '/workouts/abs-50-10-v2/straight-leg-sit-up-twists.gif', name: 'Straight Leg Sit Up Twists', anim: 'seated-twist',   cue: 'Full sit-up with rotation' },
      { id: 'frog-crunches',         gif: '/workouts/abs-50-10-v2/frog-crunches.gif',              name: 'Frog Crunches',              anim: 'butterfly',      cue: 'Soles together, crunch up' },
      { id: 'cocoons',               gif: '/workouts/abs-50-10-v2/cocoons.gif',                    name: 'Cocoons',                    anim: 'extend-tuck',    cue: 'Extend fully, tuck in tight' },
      { id: 'heel-taps-3',           gif: '/workouts/abs-50-10-v2/heel-taps.gif',                  name: 'Heel Taps',                  anim: 'heel-tap',       cue: 'Side to side, feel the obliques' },
      { id: 'hollow-hold-3',         gif: '/workouts/abs-50-10-v2/hollow-hold.gif',                name: 'Hollow Hold',                anim: 'hollow',         cue: 'Press lower back to floor' },
    ]
  },

  // ─── WORKOUT 4: Abs 30/5 v2 — 5 min ───────────────────────────────────────
  {
    id: 'abs-30-5-v2',
    title: '#4 Abs 30/5',
    subtitle: '30 sec work · 5 sec rest',
    emoji: '⚡',
    thumb: '/workouts/abs-30-5-v2-thumb.png',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.3)',
    workSec: 30,
    restSec: 5,
    category: 'abs',
    type: 'timed',
    exercises: [
      { id: 'lower-crunches',        gif: '/workouts/abs-30-5-v2/lower-crunches.gif',         name: 'Lower Crunches',         anim: 'crunch',         cue: 'Focus on lower abs' },
      { id: 'leg-raises-4',          gif: '/workouts/abs-30-5-v2/leg-raises.gif',             name: 'Leg Raises',             anim: 'leg-raise',      cue: 'Slow & controlled' },
      { id: 'flutter-kicks-4',       gif: '/workouts/abs-30-5-v2/flutter-kicks.gif',          name: 'Flutter Kicks',          anim: 'flutter',        cue: 'Keep lower back flat' },
      { id: 'v-sit-crunches',        gif: '/workouts/abs-30-5-v2/v-sit-crunches.gif',         name: 'V-Sit Crunches',         anim: 'crunch',         cue: 'Reach for your toes' },
      { id: 'cross-mountain',        gif: '/workouts/abs-30-5-v2/cross-mountain-climbers.gif',name: 'Cross Mountain Climbers',anim: 'mountain',       cue: 'Knee to opposite elbow' },
      { id: 'plank-step-outs',       gif: '/workouts/abs-30-5-v2/plank-step-outs.gif',        name: 'Plank Step Outs',        anim: 'plank-knee',     cue: 'Step wide, stay stable' },
      { id: 'spiderman-crunches',    gif: '/workouts/abs-30-5-v2/spiderman-crunches.gif',     name: 'Spiderman Crunches',     anim: 'spider',         cue: 'Knee to same-side elbow' },
      { id: 'alt-leg-raises',        gif: '/workouts/abs-30-5-v2/alternating-leg-raises.gif', name: 'Alternating Leg Raises', anim: 'leg-raise',      cue: 'One leg at a time' },
      { id: 'lying-bicycles',        gif: '/workouts/abs-30-5-v2/lying-bicycles.gif',         name: 'Lying Bicycles',         anim: 'bicycle',        cue: 'Slow pedaling motion' },
      { id: 'tabletop-crunch-pulse', gif: '/workouts/abs-30-5-v2/tabletop-crunch-pulses.gif', name: 'Tabletop Crunch Pulses', anim: 'crunch',         cue: 'Small controlled pulses' },
    ]
  },

  // ─── WORKOUT 5: Daily Routine — mixed 30s / 60s ────────────────────────────
  {
    id: 'daily-routine',
    title: '#5 Daily Routine',
    subtitle: 'Mobility & flow · no rest',
    emoji: '🌅',
    thumb: '/workouts/daily-routine-thumb.png',
    color: '#10b981',       // emerald
    glow: 'rgba(16,185,129,0.3)',
    workSec: 30,            // default — overridden per exercise
    restSec: 5,
    category: 'core',
    type: 'timed',
    exercises: [
      // — 30 sec block —
      { id: 'hopping-around',    gif: '/workouts/daily-routine/hopping-around.gif',  name: 'Hopping Around',       anim: 'hopping',        cue: 'Light bouncy hops, stay loose',       workSec: 30 },
      { id: 'lymphatic-hops',    gif: '/workouts/daily-routine/lymphatic-hops.gif',  name: 'Lymphatic Hops',       anim: 'lymphatic-hops', cue: 'Gentle heel bounces, arms relaxed',   workSec: 30 },
      { id: 'whipping-arms',     gif: '/workouts/daily-routine/whipping-arms.gif',   name: 'Whipping Arms Release',anim: 'whipping-arms',  cue: 'Let arms flop freely, shake it out',  workSec: 30 },
      { id: 'heart-openers',     gif: '/workouts/daily-routine/heart-openers.gif',   name: 'Heart Openers',        anim: 'heart-openers',  cue: 'Open chest wide, squeeze shoulder blades', workSec: 30 },
      // — 1 min block —
      { id: 'arm-swings',        gif: '/workouts/daily-routine/arm-swings.gif',      name: 'Arm Swings',           anim: 'arm-swings',     cue: 'Big forward & backward circles',      workSec: 60 },
      { id: 'spinal-waves',      gif: '/workouts/daily-routine/spinal-waves.gif',    name: 'Spinal Waves',         anim: 'spinal-waves',   cue: 'Roll through each vertebra slowly',   workSec: 60 },
      { id: 'dead-arms',         gif: '/workouts/daily-routine/dead-arms.gif',       name: 'Dead Arms',            anim: 'dead-arms',      cue: 'Twist torso, let arms swing freely',  workSec: 60 },
      { id: 'trunk-twists',      gif: '/workouts/daily-routine/trunk-twists.gif',    name: 'Trunk Twists',         anim: 'trunk-twists',   cue: 'Rotate from the hips, look behind',   workSec: 60 },
      { id: 'golf-arms',         gif: '/workouts/daily-routine/golf-arms.gif',       name: 'Golf Arms',            anim: 'golf-arms',      cue: 'Smooth rotational swing motion',      workSec: 60 },
      { id: 'marches-knee',      gif: '/workouts/daily-routine/marches-knee.gif',    name: 'Marches Knee Steps',   anim: 'marches',        cue: 'High knees, pump arms',               workSec: 60 },
      { id: 'windmill',          gif: '/workouts/daily-routine/windmill.gif',        name: 'Windmill',             anim: 'windmill',        cue: 'Opposite hand to foot, stay long',    workSec: 60 },
      { id: 'ballet-squats',     gif: '/workouts/daily-routine/ballet-squats.gif',   name: 'Ballet Squats',        anim: 'ballet-squat',   cue: 'Wide stance, toes out, back straight',workSec: 60 },
      { id: 'horse-stance',      gif: '/workouts/daily-routine/horse-stance.gif',    name: 'Horse Stance',         anim: 'horse-stance',   cue: 'Deep wide squat, hold strong',        workSec: 60 },
      { id: 'body-tapping',      gif: '/workouts/daily-routine/body-tapping.gif',    name: 'Body Tapping',         anim: 'body-tapping',   cue: 'Tap arms, chest, legs — wake up the body', workSec: 60 },
    ]
  },

  // ─── WORKOUT 4: 12 Steps Short Workout — 30s work / 10s rest ──────────────
  {
    id: 'twelve-steps',
    title: '#6 12 Steps',
    subtitle: '30 sec work · 10 sec rest',
    emoji: '⚡',
    thumb: '/workouts/twelve-steps-thumb.png',
    color: '#ef4444',       // red
    glow: 'rgba(239,68,68,0.3)',
    workSec: 30,
    restSec: 10,
    category: 'core',
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

  // ─── WORKOUT 7: Full Body — 20 min ──────────────────────────────────────────
  {
    id: 'full-body-1',
    title: '#7 Full Body',
    subtitle: '60/30 & 30/30 mix · 20 min',
    emoji: '💥',
    thumb: '/workouts/full-body-1-thumb.png',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.3)',
    workSec: 60,
    restSec: 30,
    category: 'fullbody',
    type: 'timed',
    exercises: [
      { id: 'fb-jumping-jacks',     gif: '/workouts/full-body-1/jumping-jacks.gif',      name: 'Jumping Jacks',        anim: 'jumps',           cue: 'Full arm extension, land soft' },
      { id: 'fb-burpees',           gif: '/workouts/full-body-1/burpees.gif',            name: 'Burpees',              anim: 'burpee',          cue: 'Drop, push, jump — full send' },
      { id: 'fb-lunge-jumps',       gif: '/workouts/full-body-1/lunge-jumps.gif',        name: 'Lunge Jumps',          anim: 'lunge',           cue: 'Alternate legs, explode up' },
      { id: 'fb-plank',             gif: '/workouts/full-body-1/plank.gif',              name: 'Plank',                anim: 'plank-hold',      cue: 'Straight line — squeeze everything' },
      { id: 'fb-steam-engine',      gif: '/workouts/full-body-1/steam-engine-squats.gif',name: 'Steam Engine Squats',  anim: 'squat',           cue: 'Elbow to knee as you squat' },
      { id: 'fb-reverse-crunch',    gif: '/workouts/full-body-1/reverse-crunch.gif',     name: 'Reverse Crunch',       anim: 'reverse-crunch',  cue: 'Lift hips, not just legs' },
      { id: 'fb-side-plank-r',      gif: '/workouts/full-body-1/side-plank-r.png',       name: 'Side Plank R',         anim: 'side-plank-r',    cue: 'Stack hips, reach up' },
      { id: 'fb-side-plank-l',      gif: '/workouts/full-body-1/side-plank-l.png',       name: 'Side Plank L',         anim: 'side-plank-l',    cue: 'Stack hips, reach up' },
      { id: 'fb-push-up-slow',      gif: '/workouts/full-body-1/push-up-slow.gif',       name: 'Push Up (Slow)',       anim: 'push-up',         cue: '3 sec down, 1 sec up' },
      { id: 'fb-supermans',         gif: '/workouts/full-body-1/supermans.gif',           name: 'Supermans',            anim: 'prone-cobra',     cue: 'Lift arms & legs together' },
      { id: 'fb-elbow-planks',      gif: '/workouts/full-body-1/elbow-planks.png',        name: 'Elbow Planks',         anim: 'plank-hold',      cue: 'Forearms flat, body straight', workSec: 30 },
      { id: 'fb-jump-ropes',        gif: '/workouts/full-body-1/jump-ropes.gif',          name: 'Jump Ropes',           anim: 'jumps',           cue: 'Light bounces, wrists spin' },
      { id: 'fb-plank-ups',         gif: '/workouts/full-body-1/plank-ups.gif',           name: 'Plank Ups',            anim: 'plank-knee',      cue: 'High plank to low plank' },
      { id: 'fb-calf-raise-r',      gif: '/workouts/full-body-1/calf-raise-r.gif',       name: 'Calf Raise R',         anim: 'calf-raise',      cue: 'Squeeze at top, slow lower', workSec: 30 },
      { id: 'fb-calf-raise-l',      gif: '/workouts/full-body-1/calf-raise-l.gif',       name: 'Calf Raise L',         anim: 'calf-raise',      cue: 'Squeeze at top, slow lower', workSec: 30 },
      { id: 'fb-squat-jumps',       gif: '/workouts/full-body-1/squat-jumps.gif',         name: 'Squat Jumps',          anim: 'squat',           cue: 'Deep squat, explode up', workSec: 30 },
      { id: 'fb-prone-cobra',       gif: '/workouts/full-body-1/prone-cobra.gif',         name: 'Prone Cobra',          anim: 'prone-cobra',     cue: 'Lift chest, squeeze glutes', workSec: 30 },
      { id: 'fb-push-ups',          gif: '/workouts/full-body-1/push-ups.gif',            name: 'Push Ups',             anim: 'push-up',         cue: 'Chest to floor, full extension', workSec: 30 },
      { id: 'fb-ankle-taps',        gif: '/workouts/full-body-1/ankle-taps.gif',          name: 'Ankle Taps',           anim: 'heel-tap',        cue: 'Side to side, feel the stretch', workSec: 30 },
      { id: 'fb-pike-push-ups',     gif: '/workouts/full-body-1/pike-push-ups.gif',       name: 'Pike Push Ups',        anim: 'pike-push-up',    cue: 'Hips high, head between arms', workSec: 30 },
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
  kegelWeek: 3,
  morningTime: '10:00',
  eveningTime: '18:00',
  notificationsEnabled: true,
  streakDays: 0,
  lastWorkoutDate: null,
  completedWorkouts: [],
}
