export interface LyftaExerciseMedia {
  page: string;
  source: "Lyfta" | "Hammer Strength";
  video?: string;
  poster?: string;
}

// 2026-09-07 按当前动作核对来源。没有对应素材时保留文字与原站入口，不混用其他器械演示。
const EXERCISE_MEDIA: Record<string, LyftaExerciseMedia> = {
  "Cable curl": {"page":"https://www.lyfta.app/exercise/cable-curl-6xk","source":"Lyfta","video":"https://apilyfta.com/static/GymvisualMP4/08681201-Cable-Curl-(male)_Upper-Arms-FIX_.mp4"},
  "Machine fly": {"page":"https://www.lyfta.app/exercise/lever-seated-fly-18","source":"Lyfta","video":"https://apilyfta.com/static/GymvisualMP4/05961201-Lever-Seated-Fly_Chest-FIX_.mp4"},
  "Reverse pec deck": {"page":"https://www.lyfta.app/exercise/lever-seated-reverse-fly-12","source":"Lyfta","video":"https://apilyfta.com/static/GymvisualMP4/06021201-Lever-Seated-Reverse-Fly_Shoulders.mp4"},
  "Lat pulldown": {"page":"https://www.lyfta.app/exercise/cable-wide-grip-lat-pulldown-7v7","source":"Lyfta","video":"https://apilyfta.com/static/GymvisualMP4/22911201-Cable-Wide-Grip-Lat-Pulldown-(female)_Back.mp4"},
  "Seated cable row": {"page":"https://www.lyfta.app/exercise/cable-seated-row-6x3","source":"Lyfta","video":"https://apilyfta.com/static/GymvisualMP4/08611201-Cable-Seated-Row_Back-FIX_.mp4"},
  "Easy cardio": {
    "page": "https://www.lyfta.app/exercise/elliptical-machine-walk-7sl",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/21921201-Elliptical-Machine-Walk_Cardio.mp4"
  },
  "Shoulder circles": {
    "page": "https://www.lyfta.app/exercise/shoulder-circle-9gi",
    "source": "Lyfta",
    "poster": "https://apilyfta.com/static/GymvisualPNG/43951101-Shoulder-Circle_Back_small.png"
  },
  "Lever chest press": {
    "page": "https://www.lyfta.app/exercise/lever-chest-press-0u",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/05771201-Lever-Chest-Press_Chest.mp4"
  },
  "Smith incline push-up": {
    "page": "https://www.lyfta.app/exercise/incline-push-up-on-a-smith-bar-male-qsm",
    "source": "Lyfta"
  },
  "Shoulder press machine": {
    "page": "https://www.lyfta.app/exercise/lever-shoulder-press-2q",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/08691201-Lever-Shoulder-Press-(plate-loaded)-(VERSION-2)_Shoulders_.mp4"
  },
  "Lever seated crunch": {
    "page": "https://www.lyfta.app/exercise/lever-seated-crunch-70a",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/14521201-Lever-Seated-Crunch_Waist.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/14521101-Lever-Seated-Crunch_Waist_small.png"
  },
  "Doorway chest stretch": {
    "page": "https://www.lyfta.app/exercise/doorway-chest-stretch-male-qxq",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/75531201-Doorway-Chest-Stretch-(male)_Chest_.mp4"
  },
  "Overhead triceps stretch": {
    "page": "https://www.lyfta.app/exercise/overhead-triceps-stretch-6r1",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/06431201-Overhead-Triceps-Stretch_Upper-Arms.mp4"
  },
  "Incline treadmill walk": {
    "page": "https://www.lyfta.app/exercise/walking-on-incline-treadmill-8x5",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/36661201-Walking-on-Incline-Treadmill_Cardio_.mp4"
  },
  "Wall push-up": {
    "page": "https://www.lyfta.app/exercise/decline-push-up-against-wall-8s0",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/34911201-Decline-Push-Up-against-Wall_Chest.mp4"
  },
  "Cable external rotation": {
    "page": "https://www.lyfta.app/exercise/cable-standing-shoulder-external-rotation-85u",
    "source": "Lyfta",
    "poster": "https://apilyfta.com/static/GymvisualPNG/26751101-Cable-Standing-Shoulder-External-Rotation-(female)_Back_small.png"
  },
  "Triceps pushdown": {
    "page": "https://www.lyfta.app/exercise/triceps-pushdown-7e",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/02411201-Cable-Triceps-Pushdown-(V-bar-attachment)_Upper-Arms.mp4"
  },
  "Dumbbell lateral raise": {
    "page": "https://www.lyfta.app/exercise/dumbbell-lateral-raise-6iq",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/03341201-Dumbbell-Lateral-Raise_shoulder-FIX_.mp4"
  },
  "Across chest shoulder stretch": {
    "page": "https://www.lyfta.app/exercise/across-chest-shoulder-stretch-7nh",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/19801201-Across-Chest-Shoulder-Stretch_Back_.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/19801101-Across-Chest-Shoulder-Stretch_Back_small.png"
  },
  "Elbows back stretch": {
    "page": "https://www.lyfta.app/exercise/elbows-back-stretch-6ls",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/04441201-Elbows-Back-Stretch-(female)_Chest.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/04441101-Elbows-Back-Stretch_Chest_small.png"
  },
  "Neck side stretch": {
    "page": "https://www.lyfta.app/exercise/neck-side-stretch-79z",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/14031201-Neck-Side-Stretch_Neck.mp4"
  },
  "Bodyweight squat": {
    "page": "https://www.lyfta.app/exercise/squat-3k",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/11971201-Bodyweight-Squat-(male)_Thighs-SIDE-POV_.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/11971101-Squat-m_Thighs_small.png"
  },
  "Bodyweight good morning": {
    "page": "https://www.lyfta.app/exercise/bodyweight-good-morning-qhy",
    "source": "Lyfta",
    "poster": "https://apilyfta.com/static/GymvisualPNG/55551101-Bodyweight-Good-Morning_Hips_small.png"
  },
  "Seated leg press": {
    "page": "https://www.lyfta.app/exercise/lever-seated-leg-press-7uk",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/22671201-Lever-Seated-Leg-Press_Thighs.mp4"
  },
  "Hip thrust machine": {
    "page": "https://www.lyfta.app/exercise/lever-hip-thrust-8tw",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/35491201-Lever-Hip-Thrust-(plate-loaded)-(female)_Hips_.mp4"
  },
  "Seated leg curl": {
    "page": "https://www.lyfta.app/exercise/lever-seated-leg-curl-11",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/05991201-Lever-Seated-Leg-Curl_Thighs.mp4"
  },
  "Leg extension": {
    "page": "https://www.lyfta.app/exercise/lever-leg-extension-0b",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/05851201-Lever-Leg-Extension_Thighs.mp4"
  },
  "Seated hip abduction": {
    "page": "https://www.lyfta.app/exercise/lever-seated-hip-abduction-19",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/05971201-Lever-Seated-Hip-Abduction_Hips.mp4"
  },
  "Standing quad stretch": {
    "page": "https://www.lyfta.app/exercise/standing-quadriceps-stretch-6c2",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/10591201-Standing-Quadriceps-Stretch_Thighs_.mp4"
  },
  "Standing hamstring stretch": {
    "page": "https://www.lyfta.app/exercise/standing-hamstring-stretch-6v3",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/07891201-Standing-Hamstring-Stretch-(female)_Thighs_.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/07891101-Standing-Hamstring-Stretch_Thighs_small.png"
  },
  "Smith machine squat": {
    "page": "https://www.lyfta.app/exercise/smith-squat-21",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/07701201-Smith-Squat_Hips_.mp4"
  },
  "Seated hip adduction": {
    "page": "https://www.lyfta.app/exercise/lever-seated-hip-adduction-10",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/05981201-Lever-Seated-Hip-Adduction_Thighs.mp4"
  },
  "Dumbbell Romanian deadlift": {
    "page": "https://www.lyfta.app/exercise/dumbbell-romanian-deadlift--7t1",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/22221201-Dumbbell-Romanian-Deadlift-(female)_Hips.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/22221101-Dumbbell-Romanian-Deadlift-(female)_Hips_small.png"
  },
  "Goblet squat": {
    "page": "https://www.lyfta.app/exercise/goblet-squat-ge",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/17601201-Dumbbell-Goblet-Squat_Thighs.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/17601101-Dumbbell-Goblet-Squat_Thighs-FIX_small.png"
  },
  "Wall calf stretch": {
    "page": "https://www.lyfta.app/exercise/calf-stretch-with-hands-against-wall-793",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/13771201-Calf-Stretch-With-Hands-Against-Wall_Calves_.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/13771101-Calf-Stretch-With-Hands-Against-Wall_Calves_small.png"
  },
  "Standing hip flexor stretch": {
    "page": "https://www.lyfta.app/exercise/standing-hip-flexor-stretch-7mm",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/19491201-Standing-Hip-Flexor-Stretch_Hips.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/19491101-Standing-Hip-Flexor-Stretch_Hips_small.png"
  },
  "Side lunge stretch": {
    "page": "https://www.lyfta.app/exercise/side-lunge-stretch-6t7",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/07111201-Side-Lunge-Stretch-(female)_Thighs.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/07111101-Side-Lunge-Stretch_Thighs_small.png"
  },
  "Lever row": {
    "page": "https://www.lyfta.app/exercise/lever-row-3v",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/12371201-Lever-Row-(plate-loaded)_Back_.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/12371101-Lever-Row-(plate-loaded)_Back_small.png"
  },
  "Lever high row": {
    "page": "https://www.lyfta.app/exercise/lever-high-row-0y",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/05811201-Lever-High-Row-(plate-loaded)_Back.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/05811101-Lever-High-Row-(plate-loaded)_Back_small.png"
  },
  "Cable face pull": {
    "page": "https://www.lyfta.app/exercise/cable-standing-face-pull-qi1",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/56091201-Cable-Standing-Face-Pull_Shoulders_.mp4"
  },
  "Dynamic back stretch": {
    "page": "https://www.lyfta.app/exercise/dynamic-back-stretch-6lo",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/04401201-Dynamic-Back-Stretch-(female)_Back.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/04401101-Dynamic-Back-Stretch_Back_small.png"
  },
  "D.Y. row": {
    "page": "https://shop.lifefitness.com/products/hammer-strength-plate-loaded-iso-lateral-d-y-row",
    "source": "Hammer Strength"
  },
  "Hammer curl": {
    "page": "https://www.lyfta.app/exercise/hammer-curl-8v",
    "source": "Lyfta",
    "video": "https://apilyfta.com/static/GymvisualMP4/03121201-Dumbbell-Hammer-Curl-(version-2)_Upper-Arms-FIX_.mp4",
    "poster": "https://apilyfta.com/static/GymvisualPNG/03121101-Dumbbell-Hammer-Curl-II_Upper-Arms_small.png"
  }
};

export function lyftaExerciseMedia(englishName: string): LyftaExerciseMedia {
  return EXERCISE_MEDIA[englishName] ?? { page: "https://www.lyfta.app/exercises", source: "Lyfta" };
}

export function lyftaExerciseUrl(englishName: string): string {
  return lyftaExerciseMedia(englishName).page;
}
