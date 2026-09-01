export type TrainingPhase = "warmup" | "main" | "stretch";

export type DiagramKind =
  | "cardio" | "shoulder-circle" | "push" | "fly" | "overhead" | "pressdown"
  | "squat" | "bridge" | "leg-press" | "leg-curl" | "leg-extension" | "abduction"
  | "pulldown" | "row" | "rear-fly" | "lateral" | "chest-stretch" | "arm-stretch"
  | "hip-stretch" | "hamstring-stretch" | "glute-stretch" | "lat-stretch";

export interface PlanExercise {
  id: string;
  phase: TrainingPhase;
  name: string;
  englishName: string;
  dose: string;
  rest?: string;
  target: string;
  equipment: string;
  setup: string;
  steps: string[];
  cues: string[];
  mistake: string;
  safety: string;
  diagram: DiagramKind;
  guideUrl?: string;
  log?: { sets: number; reps: number };
}

export interface TrainingDay {
  id: "monday" | "wednesday" | "friday";
  weekday: string;
  title: string;
  focus: string;
  duration: string;
  summary: string;
  exercises: PlanExercise[];
  alternatives: PlanExercise[];
}

const equipmentGuide = "https://www.puregym.com/blog/how-to-use-gym-equipment/";
const aceLibrary = "https://www.acefitness.org/resources/everyone/exercise-library/";

export const TRAINING_DAYS: TrainingDay[] = [
  {
    id: "monday", weekday: "周一", title: "胸与推", focus: "胸 · 肩前束 · 肱三头肌", duration: "约 60–70 分钟",
    summary: "先让肩关节和肩胛进入状态，再用固定轨迹器械练推力。全程不追求大重量。",
    exercises: [
      {
        id: "m-cardio", phase: "warmup", name: "椭圆机或快走", englishName: "Easy cardio", dose: "5–7 分钟", target: "升高体温、让呼吸微微加快", equipment: "椭圆机 / 跑步机",
        setup: "选择能自然迈步的阻力或坡度，站稳后再启动。强度以能完整说出一句话为准。",
        steps: ["前 2 分钟保持非常轻松。", "中间 3 分钟略微加速，但不要喘。", "最后 1–2 分钟放慢，准备活动肩部。"],
        cues: ["肩膀放松", "脚掌稳定", "不要扶着把手吊住身体"], mistake: "一开始就调高阻力，身体还没热便进入疲劳。", safety: "若头晕、胸闷或异常气短，立即停止。", diagram: "cardio", guideUrl: equipmentGuide,
      },
      {
        id: "m-shoulder", phase: "warmup", name: "肩绕环与肩胛后缩", englishName: "Shoulder circles", dose: "各 10 次 × 2 轮", target: "肩关节、肩胛控制", equipment: "无需器械",
        setup: "站直，双脚与髋同宽，肋骨不要向前翻。先做小圈，再逐渐放大。",
        steps: ["双肩缓慢向上、向后、向下绕圈 10 次。", "手臂伸向两侧做小幅绕环，正反各 10 次。", "最后把肩胛骨轻轻向后下方夹紧 2 秒，再放松。"],
        cues: ["动作慢", "脖子保持长", "只到无痛范围"], mistake: "为了画大圈而耸肩、塌腰或甩动手臂。", safety: "出现夹痛时缩小幅度；持续疼痛不要进行推举。", diagram: "shoulder-circle", guideUrl: aceLibrary,
      },
      {
        id: "m-wall-push", phase: "warmup", name: "墙面俯卧撑", englishName: "Wall push-up", dose: "10 次 × 2 组", rest: "30 秒", target: "胸、肱三头肌、肩胛稳定", equipment: "墙面",
        setup: "面向墙站立，手掌略宽于肩、与胸口同高，向后退约一臂距离。",
        steps: ["收紧腹部，让头、背、骨盆和脚踝接近一条直线。", "吸气屈肘，胸口缓慢靠近墙面。", "呼气推墙回到起点，手肘不要锁死。"],
        cues: ["手肘斜向下约 45°", "肩膀远离耳朵", "身体整块移动"], mistake: "只把头伸向墙，或手肘完全向两侧张开。", safety: "肩前侧有锐痛时停止，并把手位调低或咨询教练。", diagram: "push", guideUrl: aceLibrary,
      },
      {
        id: "m-chest-press", phase: "main", name: "坐姿推胸机", englishName: "Seated chest press", dose: "3 组 × 8–12 次", rest: "90 秒", target: "胸大肌为主，肩前束和肱三头辅助", equipment: "坐姿推胸机",
        setup: "调座椅让握把与胸口中部齐平；双脚踩稳，后脑、上背和臀部贴靠垫。先用很轻重量试 8 次。",
        steps: ["吸气准备，肩胛轻轻向后下方固定。", "呼气把握把平稳推向前方，肘部仍保留一点弯曲。", "吸气用 2–3 秒慢慢回程，握把回到胸侧即止。"],
        cues: ["胸口对准握把", "手腕保持直", "每次回程都可控"], mistake: "耸肩、挺腰借力，或重量落到底后撞击配重片。", safety: "肩前侧不舒服时缩小回程幅度；锐痛立即停止。", diagram: "push", guideUrl: "https://www.puregym.com/exercises/chest/bench-press/seated-chest-press/", log: { sets: 3, reps: 12 },
      },
      {
        id: "m-fly", phase: "main", name: "蝴蝶机夹胸", englishName: "Machine fly", dose: "3 组 × 10–15 次", rest: "60–75 秒", target: "胸大肌", equipment: "蝴蝶机 / 夹胸机",
        setup: "座椅高度让肘部或握把与胸口中部齐平；背部贴垫，起始位置只要胸部有轻微拉伸即可。",
        steps: ["胸口抬起但不挺腰，肩胛保持后下。", "呼气把双臂沿弧线合向胸前，像抱住一棵树。", "在中间停 1 秒，再吸气缓慢打开。"],
        cues: ["肘角度保持不变", "用胸夹，不用手甩", "回程慢于合拢"], mistake: "把手臂开得过深，或为了合拢而让肩膀向前滚。", safety: "肩前侧被拉扯时减少开合幅度并减重。", diagram: "fly", guideUrl: "https://www.puregym.com/exercises/chest/chest-fly/machine-fly/", log: { sets: 3, reps: 15 },
      },
      {
        id: "m-incline", phase: "main", name: "上斜推胸机", englishName: "Incline chest press machine", dose: "3 组 × 8–12 次", rest: "90 秒", target: "上胸、肩前束、肱三头肌", equipment: "上斜推胸机；没有则继续坐姿推胸机",
        setup: "调座椅使握把起点位于上胸而不是颈部；背部完整贴垫，选择比平推更轻的重量。",
        steps: ["肩胛向后下固定，手腕叠在肘部上方。", "呼气沿器械轨迹向前上方推起。", "吸气缓慢回到肘部略低于肩的位置。"],
        cues: ["不要耸肩", "肋骨收住", "左右同时发力"], mistake: "座椅过低导致握把朝脸部推，或腰离开靠垫。", safety: "如果健身房器械轨迹让肩部不适，直接换回普通推胸机。", diagram: "push", guideUrl: "https://www.puregym.com/exercises/chest/bench-press/seated-chest-press/", log: { sets: 3, reps: 12 },
      },
      {
        id: "m-shoulder-press", phase: "main", name: "器械推肩", englishName: "Shoulder press machine", dose: "2–3 组 × 8–12 次", rest: "90 秒", target: "三角肌、肱三头肌", equipment: "推肩机",
        setup: "调座椅让握把略低于肩；优先选择掌心相对的中立握法，脚掌和背部贴稳。",
        steps: ["吸气收紧腹部，肩膀保持向下。", "呼气把握把推到头顶，肘部不要完全锁死。", "吸气缓慢下降，停在舒适深度。"],
        cues: ["头在双臂中间", "不塌腰", "先轻重量学习轨迹"], mistake: "为了推起而抬臀、过度挺腰或把肩膀顶向耳朵。", safety: "肩峰区域出现夹痛时停止，不要硬推过疼痛点。", diagram: "overhead", guideUrl: "https://www.puregym.com/exercises/arms-and-shoulders/shoulder-press/shoulder-press-machine/", log: { sets: 3, reps: 12 },
      },
      {
        id: "m-triceps", phase: "main", name: "绳索下压", englishName: "Triceps pushdown", dose: "3 组 × 10–15 次", rest: "60 秒", target: "肱三头肌", equipment: "龙门架 + 绳索",
        setup: "滑轮调到最高，双手握绳；退半步，膝盖微屈，躯干略前倾但背部中立。",
        steps: ["把上臂贴近身体，肘部固定在肋骨旁。", "呼气只伸直肘关节，底部把绳端稍向两侧分开。", "吸气慢慢回到前臂接近水平的位置。"],
        cues: ["肘不乱跑", "肩膀放松", "配重片不相撞"], mistake: "用整个身体向下压、肘部前后摆动或手腕弯折。", safety: "肘关节不适时减重，并避免用力锁死。", diagram: "pressdown", guideUrl: "https://www.puregym.com/exercises/arms-and-shoulders/tricep-extension/tricep-pushdowns/", log: { sets: 3, reps: 15 },
      },
      {
        id: "m-chest-stretch", phase: "stretch", name: "门框胸肌拉伸", englishName: "Doorway chest stretch", dose: "每侧 20–30 秒 × 2", target: "胸大肌、肩前侧", equipment: "门框 / 立柱",
        setup: "前臂贴住门框，肘部略低于肩，前后站成弓步。",
        steps: ["肩膀向后下方放松。", "身体缓慢向前移动，直到胸前出现温和拉伸。", "自然呼吸，不弹震；换边重复。"],
        cues: ["拉伸感不是疼痛", "肋骨不要外翻", "动作缓慢"], mistake: "把肘抬得过高，或扭转身体强行追求幅度。", safety: "肩前侧刺痛时立刻退出拉伸。", diagram: "chest-stretch", guideUrl: aceLibrary,
      },
      {
        id: "m-triceps-stretch", phase: "stretch", name: "头顶肱三头肌拉伸", englishName: "Overhead triceps stretch", dose: "每侧 20–30 秒 × 2", target: "肱三头肌、背阔肌上部", equipment: "无需器械",
        setup: "站直或坐直，一只手沿背后向下，另一只手轻扶该侧肘部。",
        steps: ["收紧腹部，避免腰部前拱。", "轻轻把肘部引向头后，直到上臂后侧有拉伸感。", "自然呼吸后换边。"],
        cues: ["头不要前伸", "不要压颈部", "轻柔保持"], mistake: "用力扳动肘部，或为了够到背部而过度塌腰。", safety: "肩或肘出现锐痛时立即放下手臂，不要继续拉伸。", diagram: "arm-stretch", guideUrl: aceLibrary,
      },
    ],
    alternatives: [
      {
        id: "m-alt-rower-warmup", phase: "warmup", name: "划船机上肢热身", englishName: "Easy rowing warm-up", dose: "5 分钟", target: "全身升温、肩胛节奏", equipment: "划船机",
        setup: "脚带固定在前脚掌最宽处，阻力放在中低档；握把放松，先用慢节奏熟悉腿—身—手的顺序。",
        steps: ["先蹬腿，再让躯干略向后，最后把手拉到下胸。", "回程先伸手、再前倾躯干、最后屈膝。", "保持能正常说话的轻松强度，不追求速度。"],
        cues: ["腿身手发力", "手身腿回程", "肩膀放松"], mistake: "只用手臂猛拉，或还没伸手就让膝盖顶上来。", safety: "腰部不适时改用快走；脚带和座椅稳定后再开始。", diagram: "cardio", guideUrl: equipmentGuide,
      },
      {
        id: "m-alt-incline-push", phase: "warmup", name: "上斜俯卧撑", englishName: "Incline push-up", dose: "8–12 次 × 2 组", rest: "30 秒", target: "胸、肱三头肌、肩胛稳定", equipment: "史密斯杠 / 稳固长凳",
        setup: "双手略宽于肩放在固定支撑面上，向后走到身体从头到脚接近直线；支撑越高越轻松。",
        steps: ["收腹夹臀，肩膀保持远离耳朵。", "吸气屈肘，让胸口而不是下巴靠近支撑面。", "呼气推回起点，手肘不完全锁死。"],
        cues: ["身体整块移动", "肘部约 45°", "支撑必须稳固"], mistake: "塌腰、只伸头，或用会滑动的凳子作为支撑。", safety: "确认史密斯杠已锁牢；肩前侧锐痛时提高支撑面。", diagram: "push", guideUrl: "https://www.puregym.com/exercises/chest/press-up/incline-push-ups/",
      },
      {
        id: "m-alt-external-rotation", phase: "warmup", name: "绳索肩外旋", englishName: "Cable external rotation", dose: "每侧 12 次 × 2 组", rest: "30 秒", target: "肩袖、肩关节稳定", equipment: "龙门架 + 单手柄",
        setup: "滑轮调到肘部高度并用最轻重量；侧身站立，上臂贴住肋骨，肘部弯曲 90°。",
        steps: ["肩胛轻轻向后下方固定。", "保持肘部贴身，把前臂向身体外侧旋转。", "到无痛终点停一下，再慢慢回到腹部前方。"],
        cues: ["肘部贴身", "重量极轻", "只转肩不转腰"], mistake: "肘部离开身体，或转动整个躯干来拉动配重。", safety: "这不是力量挑战；肩内出现夹痛时立即停止。", diagram: "shoulder-circle", guideUrl: aceLibrary,
      },
      {
        id: "m-alt-smith-incline", phase: "main", name: "史密斯上斜卧推", englishName: "Smith incline bench press", dose: "3 组 × 8–12 次", rest: "90 秒", target: "上胸、肩前束、肱三头肌", equipment: "史密斯机 + 上斜凳",
        setup: "把凳子调到约 20–30°，移动到杠铃下方；躺下时杠铃落点应在上胸，不是颈部。先用空杆确认凳子位置和挂钩方向。",
        steps: ["双脚踩稳，肩胛向后下夹紧，旋开挂钩。", "吸气把杠铃缓慢降向锁骨下方，肘部斜向下。", "呼气推回起点，保留一点肘部弯曲后重新挂好。"],
        cues: ["先试空杆", "杠铃对准上胸", "肩胛不离凳"], mistake: "凳子角度过高变成肩推，或杠铃落向颈部。", safety: "先确认两侧安全限位；不熟悉挂钩时请教练协助。", diagram: "push", guideUrl: "https://www.puregym.com/exercises/chest/bench-press/barbell-incline-bench-press/", log: { sets: 3, reps: 12 },
      },
      {
        id: "m-alt-db-press", phase: "main", name: "哑铃卧推", englishName: "Dumbbell bench press", dose: "3 组 × 8–12 次", rest: "90 秒", target: "胸大肌、肱三头肌、肩前束", equipment: "平凳 + 哑铃",
        setup: "先坐在凳边，把哑铃放在大腿上；借大腿轻推帮助躺下，双脚踩稳，哑铃位于胸口两侧。",
        steps: ["肩胛压向凳面，手腕保持在肘部正上方。", "呼气沿轻微弧线向上推，顶端哑铃接近但不碰撞。", "吸气缓慢下放到上臂与躯干约 45°。"],
        cues: ["肩胛贴凳", "手腕叠在肘上", "左右同步"], mistake: "肘部完全横向展开，或结束时从高处把哑铃扔到地面。", safety: "先选能独立起落的轻重量；肩部不适可用中立握法。", diagram: "push", guideUrl: "https://www.puregym.com/exercises/chest/bench-press/dumbbell-bench-press/", log: { sets: 3, reps: 12 },
      },
      {
        id: "m-alt-cable-fly", phase: "main", name: "绳索夹胸", englishName: "Cable fly", dose: "3 组 × 10–15 次", rest: "60–75 秒", target: "胸大肌", equipment: "双侧龙门架 + 单手柄",
        setup: "两侧滑轮调到略低于肩，使用很轻重量；站到中间，一脚在前，双手握柄并保持肘部微屈。",
        steps: ["胸口打开，肩胛稳定，身体保持不动。", "呼气把双手沿弧线合到胸前，像抱住圆桶。", "吸气缓慢打开，手肘到躯干两侧即止。"],
        cues: ["肘角度固定", "胸部带动合拢", "回程不被配重拉走"], mistake: "重量太大导致身体前倾、手臂变成推举。", safety: "先分别拿好两侧手柄再站到中间；肩前侧拉痛时缩小幅度。", diagram: "fly", guideUrl: "https://www.puregym.com/exercises/chest/chest-fly/cable-flyes/", log: { sets: 3, reps: 15 },
      },
      {
        id: "m-alt-assisted-dip", phase: "main", name: "助力双杠臂屈伸", englishName: "Machine assisted dip", dose: "3 组 × 8–12 次", rest: "90 秒", target: "胸下部、肱三头肌", equipment: "引体 / 双杠助力机",
        setup: "选择足够大的助力重量，跪上踏板后握住双杠；身体轻微前倾练胸，保持直立则更偏肱三头。",
        steps: ["肩膀向后下固定，肘部朝身后弯曲。", "吸气缓慢下降到上臂接近水平或舒适深度。", "呼气压住把手回到起点，肘部不猛烈锁死。"],
        cues: ["助力宁多勿少", "肩膀远离耳朵", "下降慢"], mistake: "助力太少导致耸肩和身体下坠，或下降得过深。", safety: "上下踏板时抓稳把手；肩前侧夹痛应立即停止。", diagram: "push", guideUrl: "https://www.puregym.com/exercises/chest/chest-dips/", log: { sets: 3, reps: 12 },
      },
      {
        id: "m-alt-triceps-machine", phase: "main", name: "器械肱三头伸展", englishName: "Machine triceps extension", dose: "3 组 × 10–15 次", rest: "60 秒", target: "肱三头肌", equipment: "肱三头伸展机",
        setup: "调座椅让肘关节对准器械转轴，胸口或背部贴稳靠垫；手腕保持自然直线。",
        steps: ["上臂贴住支撑垫，吸气准备。", "呼气伸直肘部，底部不要猛烈锁死。", "吸气慢慢回到肘部弯曲、仍能控制的位置。"],
        cues: ["肘轴对准转轴", "上臂不抬", "回程慢"], mistake: "座椅高度错误，或用肩膀和身体压动握把。", safety: "肘尖疼痛时减重并缩短伸直幅度。", diagram: "pressdown", guideUrl: "https://www.puregym.com/exercises/arms-and-shoulders/tricep-extension/", log: { sets: 3, reps: 15 },
      },
      {
        id: "m-alt-band-shoulder-stretch", phase: "stretch", name: "弹力带肩部拉伸", englishName: "Banded shoulder stretch", dose: "8 次慢速往返", target: "胸肩前侧、肩关节活动度", equipment: "轻弹力带 / 毛巾",
        setup: "双手宽握弹力带举在身前，站直并收住肋骨；握距要宽到能够无痛越过头顶。",
        steps: ["手臂伸直，把弹力带慢慢举过头顶。", "只在无痛范围继续向身后移动。", "沿原路线回到身前，整个过程不耸肩、不塌腰。"],
        cues: ["握距宁宽", "动作慢", "肋骨收住"], mistake: "握得太窄，强行把肩关节压过疼痛点。", safety: "肩部曾脱位或出现夹痛时跳过，改做温和胸肌拉伸。", diagram: "arm-stretch", guideUrl: aceLibrary,
      },
      {
        id: "m-alt-thread-needle", phase: "stretch", name: "穿针式胸椎旋转", englishName: "Thread the needle", dose: "每侧 6–8 次", target: "胸椎、肩后侧、上背", equipment: "瑜伽垫",
        setup: "四点跪姿，手腕在肩下、膝盖在髋下；腹部轻收，骨盆尽量保持朝向地面。",
        steps: ["一只手从另一侧手臂下方穿过，肩膀向地面靠近。", "呼气停在舒适旋转位置。", "吸气沿原路打开胸口，完成次数后换边。"],
        cues: ["旋转来自上背", "骨盆不侧翻", "呼吸带动动作"], mistake: "用腰部塌陷换取幅度，或把重量全部压在颈部。", safety: "肩膀无法承重时只做坐姿胸椎旋转。", diagram: "lat-stretch", guideUrl: aceLibrary,
      },
      {
        id: "m-alt-cross-body", phase: "stretch", name: "肩后侧横拉", englishName: "Cross-body shoulder stretch", dose: "每侧 20–30 秒 × 2", target: "三角肌后束、肩后侧", equipment: "无需器械",
        setup: "站直或坐直，一只手臂横放胸前；另一只手扶住上臂，不直接压肘关节。",
        steps: ["肩膀向下放松，胸口保持朝前。", "轻轻把手臂拉近胸口。", "肩后侧有温和牵拉后保持，换边重复。"],
        cues: ["不扭身体", "肩膀向下", "轻柔保持"], mistake: "身体随手臂转动，或用力压住肘关节。", safety: "肩关节内部出现刺痛或麻木时立即松开。", diagram: "arm-stretch", guideUrl: aceLibrary,
      },
    ],
  },
  {
    id: "wednesday", weekday: "周三", title: "腿与臀", focus: "股四头肌 · 腘绳肌 · 臀肌", duration: "约 65–75 分钟",
    summary: "先练髋膝协同，再覆盖腿前、腿后和臀部。所有器械都先调座椅，再插配重销。",
    exercises: [
      {
        id: "w-bike", phase: "warmup", name: "固定自行车", englishName: "Stationary bike", dose: "6–8 分钟", target: "膝髋热身、升高体温", equipment: "固定自行车",
        setup: "调座椅使脚踏最低点时膝盖仍有轻微弯曲；脚掌前部踩在踏板中央。",
        steps: ["前 2 分钟轻阻力慢骑。", "中间 3–4 分钟略加阻力，保持顺畅踩踏。", "最后 1–2 分钟减速，呼吸恢复。"],
        cues: ["膝盖朝脚尖方向", "骨盆不左右晃", "阻力不要过大"], mistake: "座椅过低导致膝盖过度弯曲，或只用脚尖猛踩。", safety: "膝盖疼痛时先检查座椅高度并减阻力。", diagram: "cardio", guideUrl: equipmentGuide,
      },
      {
        id: "w-squat", phase: "warmup", name: "徒手箱式深蹲", englishName: "Box squat", dose: "10 次 × 2 组", rest: "30 秒", target: "髋膝协调、臀腿激活", equipment: "长凳 / 箱子",
        setup: "背对长凳站立，双脚约肩宽、脚尖略向外，长凳距离以坐下时小腿接近竖直为准。",
        steps: ["吸气收腹，臀部像找椅子一样向后下方移动。", "膝盖沿脚尖方向弯曲，轻触长凳但不要完全放松。", "呼气踩稳全脚掌站起，顶端不夹臀过度后仰。"],
        cues: ["全脚掌着地", "膝盖跟随脚尖", "胸口保持打开"], mistake: "膝盖向内塌、脚跟离地，或直接跌坐在长凳上。", safety: "膝或腰有锐痛时缩小深度，必要时请教练现场调整。", diagram: "squat", guideUrl: aceLibrary,
      },
      {
        id: "w-bridge", phase: "warmup", name: "臀桥", englishName: "Glute bridge", dose: "12 次 × 2 组", rest: "30 秒", target: "臀大肌激活", equipment: "瑜伽垫",
        setup: "仰卧屈膝，脚跟距臀部约一脚长，双脚与髋同宽，手臂放在身体两侧。",
        steps: ["轻收腹，让腰部保持自然中立。", "呼气踩脚跟抬起骨盆，直到肩—髋—膝接近直线。", "顶端夹臀 1 秒，吸气慢慢放下。"],
        cues: ["力量来自臀部", "膝盖不内扣", "不要把腰顶得过高"], mistake: "用腰部反弓代替髋伸，或脚离臀太远导致腿后侧抽筋。", safety: "腰痛时降低高度；腿后侧抽筋可把脚向臀部移近。", diagram: "bridge", guideUrl: "https://www.puregym.com/exercises/glutes/glute-bridge/glute-bridges/",
      },
      {
        id: "w-leg-press", phase: "main", name: "坐姿腿举", englishName: "Seated leg press", dose: "3 组 × 10–12 次", rest: "90–120 秒", target: "股四头肌、臀肌、腘绳肌", equipment: "坐姿腿举机",
        setup: "双脚放在踏板中部、与肩同宽；调座椅使起始膝角约 90°，腰背完整贴垫。",
        steps: ["吸气收紧腹部，膝盖对准第二脚趾。", "呼气用全脚掌推开踏板，顶端膝盖保留微屈。", "吸气用 2–3 秒回程，在腰部即将离垫前停止。"],
        cues: ["脚跟不离板", "膝盖不锁死", "腰背贴垫"], mistake: "下放过深导致骨盆卷起，或双手推膝盖帮助完成。", safety: "膝盖刺痛时减重并缩小幅度；不要锁膝。", diagram: "leg-press", guideUrl: "https://www.puregym.com/exercises/legs/quad-exercises/leg-presses/seated-leg-press/", log: { sets: 3, reps: 12 },
      },
      {
        id: "w-leg-curl", phase: "main", name: "坐姿腿弯举", englishName: "Seated leg curl", dose: "3 组 × 10–15 次", rest: "60–75 秒", target: "腘绳肌（大腿后侧）", equipment: "坐姿腿弯举机",
        setup: "膝关节轴线对准器械转轴；上压垫贴稳大腿，脚踝垫位于跟腱上方。",
        steps: ["背部贴垫，抓住把手固定身体。", "呼气把脚跟向下后方卷，底部停 1 秒。", "吸气慢慢伸膝回程，不让配重片撞击。"],
        cues: ["髋部不抬起", "脚踝放松", "回程可控"], mistake: "座椅没调好导致膝轴错位，或用臀部离座来借力。", safety: "膝后侧不适时立即检查转轴和压垫位置。", diagram: "leg-curl", guideUrl: "https://www.puregym.com/exercises/legs/hamstring-exercises/hamstring-curls/seated-leg-curl/", log: { sets: 3, reps: 15 },
      },
      {
        id: "w-leg-extension", phase: "main", name: "腿屈伸", englishName: "Leg extension", dose: "2–3 组 × 10–15 次", rest: "60–75 秒", target: "股四头肌（大腿前侧）", equipment: "腿屈伸机",
        setup: "膝轴对准器械转轴，脚垫放在脚踝上方；背部和臀部贴垫，重量从轻开始。",
        steps: ["抓住把手，呼气伸直双膝。", "接近伸直时停 1 秒，但不要猛烈锁死。", "吸气用 2–3 秒回到起点。"],
        cues: ["脚尖自然朝前", "臀部贴座", "慢放比快踢重要"], mistake: "用惯性踢起重物，或把脚垫放在胫骨中段。", safety: "膝前侧疼痛时减重、缩短伸直范围或跳过此动作。", diagram: "leg-extension", guideUrl: "https://www.puregym.com/exercises/legs/quad-exercises/leg-extensions/", log: { sets: 3, reps: 15 },
      },
      {
        id: "w-hip-thrust", phase: "main", name: "臀推机", englishName: "Hip thrust machine", dose: "3 组 × 8–12 次", rest: "90 秒", target: "臀大肌", equipment: "臀推机；没有则做垫上臀桥",
        setup: "按器械说明调节靠垫和髋部护垫；脚掌与髋同宽，顶端时小腿尽量接近竖直。",
        steps: ["下巴微收、肋骨收住，吸气降低髋部。", "呼气踩稳脚跟把髋部推高。", "顶端夹臀 1 秒，骨盆保持中立，再慢慢下降。"],
        cues: ["顶端看膝盖方向", "腰不反弓", "脚跟持续发力"], mistake: "用腰椎过伸追求高度，或脚放太远导致大腿后侧主导。", safety: "腰部不适时改做低幅度臀桥；护垫压迫骨盆时重新调整。", diagram: "bridge", guideUrl: "https://www.puregym.com/exercises/glutes/hip-thrusts/bodyweight-hip-thrust/", log: { sets: 3, reps: 12 },
      },
      {
        id: "w-abduction", phase: "main", name: "坐姿髋外展", englishName: "Seated hip abduction", dose: "3 组 × 12–15 次", rest: "60 秒", target: "臀中肌、臀小肌", equipment: "髋外展机",
        setup: "膝外侧贴住垫片，背部贴靠垫；从能控制的较小开合幅度和轻重量开始。",
        steps: ["收紧腹部，双手握住把手。", "呼气把双膝向外打开，顶端停 1 秒。", "吸气慢慢合回，配重片不要完全落下。"],
        cues: ["骨盆不摇晃", "膝盖对称打开", "回程更慢"], mistake: "身体猛烈前后摆动，用惯性甩开双腿。", safety: "髋外侧夹痛时减小幅度；不要为了开得更大而弹震。", diagram: "abduction", guideUrl: "https://www.puregym.com/exercises/legs/inner-outer-thigh/", log: { sets: 3, reps: 15 },
      },
      {
        id: "w-hip-flexor", phase: "stretch", name: "跪姿髋屈肌拉伸", englishName: "Kneeling hip-flexor stretch", dose: "每侧 20–30 秒 × 2", target: "髂腰肌、股直肌", equipment: "瑜伽垫",
        setup: "单膝跪地，另一脚踩在前方；两侧髋骨朝正前方，躯干直立。",
        steps: ["先轻轻收紧后侧腿的臀部。", "骨盆微微后卷，再整体向前移动少许。", "感到后侧腿髋前方拉伸后保持并换边。"],
        cues: ["不是向前塌腰", "臀部收紧", "幅度小而准确"], mistake: "大幅向前冲，让腰椎代替髋部伸展。", safety: "前侧膝下垫软垫；髋部夹痛时停止。", diagram: "hip-stretch", guideUrl: aceLibrary,
      },
      {
        id: "w-hamstring", phase: "stretch", name: "坐姿腘绳肌拉伸", englishName: "Seated hamstring stretch", dose: "每侧 20–30 秒 × 2", target: "大腿后侧", equipment: "长凳",
        setup: "坐在长凳边缘，一腿向前伸、脚跟着地，另一腿屈曲踩稳。",
        steps: ["背部保持自然直，脚尖轻轻勾起。", "从髋部向前折叠，而不是弓背低头。", "大腿后侧有温和拉伸时保持，再换边。"],
        cues: ["胸口向前", "膝盖可微屈", "不弹震"], mistake: "为了摸脚尖而弓背，导致拉伸跑到腰部。", safety: "坐骨神经样刺麻感出现时立即退出。", diagram: "hamstring-stretch", guideUrl: aceLibrary,
      },
      {
        id: "w-glute-stretch", phase: "stretch", name: "仰卧 4 字臀肌拉伸", englishName: "Figure-four stretch", dose: "每侧 20–30 秒 × 2", target: "臀肌、髋外侧", equipment: "瑜伽垫",
        setup: "仰卧屈膝，把一侧脚踝放在另一侧大腿上，形成数字 4。",
        steps: ["双手抱住支撑腿的大腿后侧。", "轻轻把腿拉向胸口，同时保持头和肩放松。", "臀部有拉伸感时保持，换边。"],
        cues: ["脚踝主动勾起", "尾骨贴地", "自然呼吸"], mistake: "用手直接压膝盖，或让头颈悬空紧张。", safety: "膝关节不适时减小髋外旋角度。", diagram: "glute-stretch", guideUrl: aceLibrary,
      },
    ],
    alternatives: [
      {
        id: "w-alt-treadmill-warmup", phase: "warmup", name: "跑步机坡度走", englishName: "Incline treadmill walk", dose: "5–7 分钟", target: "升高体温、激活臀腿", equipment: "跑步机",
        setup: "先站到跑带两侧再启动，速度从慢走开始；适应后加到 2–4% 小坡度，保持能正常说话。",
        steps: ["前 2 分钟平地慢走。", "中间 3 分钟略加坡度并自然摆臂。", "最后 1–2 分钟恢复平地，呼吸放缓。"],
        cues: ["身体直立", "脚步自然", "不吊着扶手"], mistake: "坡度过高后整个人趴在扶手上，臀腿反而不工作。", safety: "调速时扶稳；膝踝疼痛时取消坡度并减速。", diagram: "cardio", guideUrl: equipmentGuide,
      },
      {
        id: "w-alt-good-morning", phase: "warmup", name: "徒手早安式", englishName: "Bodyweight good morning", dose: "10 次 × 2 组", rest: "30 秒", target: "髋铰链、臀腿后侧", equipment: "无需器械",
        setup: "双脚与髋同宽，手放在髋部或胸前；膝盖微屈，脊柱保持自然，先练很小幅度。",
        steps: ["臀部向后推，躯干从髋部整体前倾。", "大腿后侧有拉伸时停止，背部仍保持自然。", "呼气夹臀把髋部向前送，回到站直。"],
        cues: ["臀部向后", "小腿近似不动", "背部保持长"], mistake: "把动作做成弯腰低头，或膝盖不断向前蹲。", safety: "腰痛时缩小幅度；无法找到髋铰链可先请教练示范。", diagram: "squat", guideUrl: aceLibrary,
      },
      {
        id: "w-alt-band-walk", phase: "warmup", name: "弹力带侧向走", englishName: "Banded lateral walk", dose: "每侧 10 步 × 2 轮", rest: "30 秒", target: "臀中肌、膝关节稳定", equipment: "小环弹力带",
        setup: "弹力带套在膝盖上方，双脚与髋同宽；髋膝轻微弯曲，脚尖保持朝前。",
        steps: ["保持弹力带张力，向一侧迈出小步。", "另一只脚跟进但不要完全并拢。", "完成 10 步后反向返回，骨盆始终保持水平。"],
        cues: ["步子小", "膝盖不内扣", "脚尖朝前"], mistake: "左右摇摆身体，或每一步都让双脚并拢使弹力带失去张力。", safety: "膝外侧疼痛时把弹力带移到膝上并减小阻力。", diagram: "abduction", guideUrl: aceLibrary,
      },
      {
        id: "w-alt-hack-squat", phase: "main", name: "哈克深蹲机", englishName: "Hack squat", dose: "3 组 × 8–12 次", rest: "90–120 秒", target: "股四头肌、臀肌", equipment: "哈克深蹲机",
        setup: "肩膀和背部贴稳靠垫，双脚放在踏板中上部、约肩宽；先不加片确认安全把手和限位位置。",
        steps: ["解开安全把手，吸气屈膝下蹲。", "膝盖沿脚尖方向移动，降到腰背仍贴垫的深度。", "呼气用全脚掌推起，顶端膝盖保留微屈。"],
        cues: ["背部贴垫", "膝盖跟脚尖", "全脚掌发力"], mistake: "双脚放得太低导致脚跟抬起，或顶端锁死膝盖。", safety: "先学会安全把手；膝前侧疼痛时把脚位略上移并减重。", diagram: "squat", guideUrl: "https://www.puregym.com/exercises/legs/quad-exercises/squats/hack-squat/", log: { sets: 3, reps: 12 },
      },
      {
        id: "w-alt-smith-squat", phase: "main", name: "史密斯深蹲", englishName: "Smith machine squat", dose: "3 组 × 8–12 次", rest: "90–120 秒", target: "股四头肌、臀肌", equipment: "史密斯机",
        setup: "杠铃放在斜方肌上部而不是颈椎，双脚略向前；先用空杆确认旋转挂钩和两侧安全限位。",
        steps: ["吸气收紧腹部，旋开挂钩。", "臀部向后下方移动，膝盖始终跟随脚尖。", "呼气踩稳全脚掌站起，稳定后转腕重新挂钩。"],
        cues: ["空杆先练挂钩", "杠不压颈部", "脚掌不抬"], mistake: "脚站得太靠后、膝盖内扣，或没有设置安全限位。", safety: "第一次必须请巡场教练确认杠位和限位；腰膝锐痛立即停止。", diagram: "squat", guideUrl: aceLibrary, log: { sets: 3, reps: 12 },
      },
      {
        id: "w-alt-lying-curl", phase: "main", name: "俯卧腿弯举", englishName: "Lying leg curl", dose: "3 组 × 10–15 次", rest: "60–75 秒", target: "腘绳肌", equipment: "俯卧腿弯举机",
        setup: "膝盖略伸出长凳边缘，脚垫位于脚踝上方；髋部压住垫面，握紧把手。",
        steps: ["呼气把脚跟卷向臀部，髋骨保持贴垫。", "顶端停 1 秒，不用腰部抬起换幅度。", "吸气用 2–3 秒放回，配重片不相撞。"],
        cues: ["髋部贴垫", "脚踝放松", "慢慢下放"], mistake: "脚垫压在小腿中段，或通过抬臀、塌腰完成动作。", safety: "膝后侧不舒服时重新调整转轴和脚垫。", diagram: "leg-curl", guideUrl: "https://www.puregym.com/exercises/legs/hamstring-exercises/hamstring-curls/lying-leg-curl/", log: { sets: 3, reps: 15 },
      },
      {
        id: "w-alt-adduction", phase: "main", name: "坐姿髋内收", englishName: "Seated hip adduction", dose: "3 组 × 12–15 次", rest: "60 秒", target: "大腿内收肌群", equipment: "髋内收机",
        setup: "大腿内侧贴住垫片，选择能舒适打开的起始角度；背部贴垫，先用轻重量。",
        steps: ["双手握住把手固定骨盆。", "呼气把双腿平稳合拢，中心停 1 秒。", "吸气慢慢打开到大腿内侧有轻微拉伸。"],
        cues: ["骨盆不晃", "双腿同时合拢", "打开要慢"], mistake: "开度设得过大，或身体前后甩动借力。", safety: "腹股沟刺痛时立即停止，不要强行拉开。", diagram: "abduction", guideUrl: "https://www.puregym.com/exercises/legs/inner-outer-thigh/", log: { sets: 3, reps: 15 },
      },
      {
        id: "w-alt-calf", phase: "main", name: "站姿提踵机", englishName: "Machine calf raise", dose: "3 组 × 12–15 次", rest: "60 秒", target: "腓肠肌、比目鱼肌", equipment: "站姿提踵机",
        setup: "前脚掌踩在踏板边缘，肩垫调到站直时能稳定承重；膝盖保持轻微弯曲。",
        steps: ["脚跟缓慢下降到小腿有拉伸感。", "呼气用前脚掌把脚跟抬到最高，停 1 秒。", "吸气控制下降，不在底部弹震。"],
        cues: ["脚踝直上直下", "顶端停一下", "全程可控"], mistake: "只做很短的弹跳幅度，或脚踝向外翻。", safety: "先确认肩垫和安全把手；跟腱疼痛时停止。", diagram: "squat", guideUrl: "https://www.puregym.com/exercises/legs/calf-exercises/", log: { sets: 3, reps: 15 },
      },
      {
        id: "w-alt-quad-stretch", phase: "stretch", name: "站姿股四头肌拉伸", englishName: "Standing quad stretch", dose: "每侧 20–30 秒 × 2", target: "大腿前侧、髋前侧", equipment: "墙面辅助",
        setup: "一手扶墙站稳，另一手握住同侧脚踝；两侧膝盖靠近，支撑腿保持微屈。",
        steps: ["轻收腹并夹紧被拉伸侧臀部。", "膝盖指向地面，脚跟温和靠近臀部。", "大腿前侧有牵拉时保持，慢慢放下后换边。"],
        cues: ["膝盖并拢", "骨盆微后卷", "不要拽脚"], mistake: "为了拉得更远而塌腰，或把膝盖甩向身体外侧。", safety: "膝盖弯曲不适时改用侧卧版本，别强拉脚踝。", diagram: "hip-stretch", guideUrl: aceLibrary,
      },
      {
        id: "w-alt-calf-stretch", phase: "stretch", name: "墙面小腿拉伸", englishName: "Standing calf stretch", dose: "每侧 20–30 秒 × 2", target: "腓肠肌、跟腱周围", equipment: "墙面",
        setup: "双手扶墙，一脚向后迈；后脚脚尖朝前、脚跟踩地，前腿自然弯曲。",
        steps: ["保持后腿膝盖伸直，身体整体向墙靠近。", "后侧小腿出现温和牵拉后保持。", "再稍弯后膝可拉到更深层的小腿，随后换边。"],
        cues: ["后脚跟贴地", "脚尖朝前", "不弹震"], mistake: "后脚向外转或脚跟离地，让拉伸失去目标。", safety: "跟腱出现锐痛时立即退出，不在台阶边缘压脚跟。", diagram: "hamstring-stretch", guideUrl: "https://www.puregym.com/exercises/legs/calf-exercises/",
      },
      {
        id: "w-alt-adductor-stretch", phase: "stretch", name: "长凳内收肌拉伸", englishName: "Bench adductor stretch", dose: "每侧 20–30 秒 × 2", target: "大腿内侧、腹股沟周围", equipment: "长凳 / 软垫",
        setup: "跪在软垫上，把一侧腿向旁边伸出并放到低长凳上；双手撑地或扶住固定物。",
        steps: ["脊柱保持自然，臀部缓慢向后移动。", "伸出侧大腿内侧有温和拉伸时停止。", "自然呼吸后缓慢回正，再换边。"],
        cues: ["臀部向后", "骨盆保持正", "幅度温和"], mistake: "快速压向最低点，或让骨盆整块向一侧翻转。", safety: "腹股沟刺痛时立即停止；长凳必须稳固。", diagram: "glute-stretch", guideUrl: aceLibrary,
      },
    ],
  },
  {
    id: "friday", weekday: "周五", title: "背与肩", focus: "背阔肌 · 菱形肌 · 三角肌中后束", duration: "约 60–70 分钟",
    summary: "先学会肩胛下沉和后缩，再完成下拉、划船和肩部孤立训练。避免用腰部摆动借力。",
    exercises: [
      {
        id: "f-rower", phase: "warmup", name: "划船机轻划", englishName: "Easy rowing", dose: "5–6 分钟", target: "全身升温、背部节奏预热", equipment: "划船机",
        setup: "脚带固定在脚掌最宽处，握把放松；阻力档位保持中低，不追求速度。",
        steps: ["蹬腿让座椅后移，躯干随后略向后，最后把手拉到下胸。", "回程先伸手，再躯干前倾，最后屈膝滑回。", "保持匀速，呼吸微微加快即可。"],
        cues: ["腿—身—手发力", "手—身—腿回程", "肩膀放松"], mistake: "一开始就用手猛拉，或回程时膝盖挡住双手。", safety: "腰部不适时改用椭圆机或快走。", diagram: "cardio", guideUrl: equipmentGuide,
      },
      {
        id: "f-pull-apart", phase: "warmup", name: "弹力带拉开", englishName: "Band pull-apart", dose: "12 次 × 2 组", rest: "30 秒", target: "肩胛后缩、肩后束", equipment: "轻阻力弹力带",
        setup: "双手比肩略宽握带，手臂抬到胸口高度，肘部保留微屈。",
        steps: ["肋骨收住，肩膀向下。", "呼气把弹力带向两侧拉开，直到接近胸口。", "夹肩胛 1 秒后慢慢回到起点。"],
        cues: ["手腕直", "不耸肩", "胸口不前顶"], mistake: "用身体后仰增加幅度，或选择过重弹力带。", safety: "肩前侧疼痛时降低手臂高度和阻力。", diagram: "rear-fly", guideUrl: aceLibrary,
      },
      {
        id: "f-scap-pull", phase: "warmup", name: "轻重量直臂下压", englishName: "Straight-arm pulldown warm-up", dose: "12 次 × 2 组", rest: "30 秒", target: "背阔肌、肩胛下沉感", equipment: "龙门架直杆",
        setup: "滑轮调高，用极轻重量；退后半步，髋部微屈，手臂几乎伸直。",
        steps: ["先把肩膀从耳朵旁向下放。", "呼气沿大腿方向压下直杆。", "吸气缓慢回到与眼睛同高，不让肩膀耸起。"],
        cues: ["肘角度不变", "腋下发力", "重量宁轻勿重"], mistake: "变成肱三头下压，或用躯干上下摆动。", safety: "肩部夹痛时缩小上举幅度。", diagram: "pulldown", guideUrl: "https://www.puregym.com/exercises/back/lat-exercises/lat-pulldown/",
      },
      {
        id: "f-lat-pulldown", phase: "main", name: "高位下拉", englishName: "Lat pulldown", dose: "3 组 × 8–12 次", rest: "90 秒", target: "背阔肌、肱二头肌", equipment: "高位下拉机",
        setup: "大腿压垫固定腿部；握距略宽于肩，坐直并轻微后倾约 10°。先把肩膀向下放。",
        steps: ["吸气稳定躯干，胸口略抬。", "呼气让肘部向下靠近肋骨，把横杆拉到上胸附近。", "吸气慢慢伸臂回程，顶端仍保持控制。"],
        cues: ["肘向下，不是手向下", "横杆拉到胸前", "身体不摆动"], mistake: "把横杆拉到颈后、过度后仰，或用惯性猛拽。", safety: "绝不做颈后下拉；肩部不适时用中立窄握把。", diagram: "pulldown", guideUrl: "https://www.puregym.com/exercises/back/lat-exercises/lat-pulldown/", log: { sets: 3, reps: 12 },
      },
      {
        id: "f-seated-row", phase: "main", name: "坐姿划船", englishName: "Seated cable row", dose: "3 组 × 8–12 次", rest: "90 秒", target: "中背、背阔肌、肩后束", equipment: "坐姿划船机 / 低位绳索",
        setup: "脚掌踩稳，膝盖微屈；使用中立握把，坐骨压在座椅上，脊柱保持自然。",
        steps: ["手臂伸直时保持胸口打开，不含胸追求距离。", "呼气把肘部沿身体两侧向后拉，握把靠近肚脐上方。", "肩胛轻夹 1 秒，吸气慢慢伸臂。"],
        cues: ["先肩胛后缩再屈肘", "胸口不塌", "躯干基本不动"], mistake: "身体大幅前后摇摆，或耸肩把握把拉向胸口过高。", safety: "腰部不适时选择带胸垫的划船机。", diagram: "row", guideUrl: "https://www.puregym.com/exercises/back/rows/seated-cable-row/", log: { sets: 3, reps: 12 },
      },
      {
        id: "f-supported-row", phase: "main", name: "胸托划船机", englishName: "Chest-supported row", dose: "3 组 × 10–12 次", rest: "75–90 秒", target: "中上背、菱形肌", equipment: "胸托划船机",
        setup: "调座椅使胸垫支撑胸骨下方、握把约在下胸高度；胸口贴垫但能自然呼吸。",
        steps: ["伸臂时肩胛可自然前移，但胸口不离垫。", "呼气把肘部向后拉，手腕与前臂保持一线。", "顶端停 1 秒，吸气控制回程。"],
        cues: ["胸贴垫", "肩膀远离耳朵", "肘部向后"], mistake: "为了拉得更远而抬胸离垫，或用手腕勾动重量。", safety: "胸垫压迫不适时调低重量和位置；无法调整就换坐姿划船。", diagram: "row", guideUrl: "https://www.puregym.com/exercises/back/rows/incline-row/", log: { sets: 3, reps: 12 },
      },
      {
        id: "f-reverse-fly", phase: "main", name: "反向蝴蝶机", englishName: "Reverse pec deck", dose: "3 组 × 12–15 次", rest: "60–75 秒", target: "三角肌后束、上背", equipment: "反向蝴蝶机",
        setup: "面对靠垫坐下，调座椅让握把与肩同高；胸口贴垫，使用轻重量。",
        steps: ["手臂抬平、肘部微屈，肩膀保持向下。", "呼气沿水平弧线把双臂打开。", "肩胛轻夹后吸气慢慢合回。"],
        cues: ["手臂像门扇打开", "脖子放松", "不用背部后仰"], mistake: "重量太重导致耸肩，或肘部大幅弯曲变成划船。", safety: "肩前侧疼痛时降低握把高度或缩小幅度。", diagram: "rear-fly", guideUrl: "https://www.puregym.com/exercises/arms-and-shoulders/rear-delt-exercises/rear-delt-flyes/", log: { sets: 3, reps: 15 },
      },
      {
        id: "f-lateral", phase: "main", name: "器械侧平举", englishName: "Lateral raise machine", dose: "3 组 × 12–15 次", rest: "60 秒", target: "三角肌中束", equipment: "侧平举机；没有则用很轻哑铃",
        setup: "坐稳并调节垫片贴在上臂外侧；手臂自然下垂，重量从最轻档开始。",
        steps: ["肩膀放松，呼气把上臂向两侧抬起。", "抬到接近肩高或舒适高度即停。", "吸气用 2–3 秒缓慢下降。"],
        cues: ["由肘部带动", "不耸肩", "手臂略在身体前方"], mistake: "抬得远高于肩、身体摆动，或选择无法慢放的重量。", safety: "肩部夹痛时只抬到无痛高度；不要硬过疼痛弧。", diagram: "lateral", guideUrl: "https://www.puregym.com/exercises/arms-and-shoulders/lateral-raises/", log: { sets: 3, reps: 15 },
      },
      {
        id: "f-lat-stretch", phase: "stretch", name: "长凳背阔肌拉伸", englishName: "Bench lat stretch", dose: "20–30 秒 × 2", target: "背阔肌、胸椎", equipment: "长凳",
        setup: "跪在长凳前，双肘或双手放在凳面，臀部位于膝盖上方。",
        steps: ["双手靠近，拇指朝上。", "臀部缓慢向后移，同时胸口向地面下沉。", "腋下到背部侧面有拉伸感时保持。"],
        cues: ["肋骨收住", "腰不塌", "自然呼吸"], mistake: "用腰部过度下沉来换取幅度，或让肩膀出现夹痛。", safety: "肩部疼痛时把双手分开并减小下沉幅度。", diagram: "lat-stretch", guideUrl: aceLibrary,
      },
      {
        id: "f-shoulder-stretch", phase: "stretch", name: "横跨身体肩后侧拉伸", englishName: "Cross-body shoulder stretch", dose: "每侧 20–30 秒 × 2", target: "三角肌后束、肩后侧", equipment: "无需器械",
        setup: "站直或坐直，胸口朝向正前方；一只手臂抬到胸前，肘部保持微屈。",
        steps: ["另一只手扶在上臂处，不要直接压肘关节。", "把手臂轻轻引向胸前，肩膀保持向下。", "肩后侧有温和拉伸感时保持，换边。"],
        cues: ["身体朝前", "不耸肩", "轻柔拉近"], mistake: "扭转躯干，或用力压肘导致关节不适。", safety: "肩关节内部出现刺痛时停止。", diagram: "arm-stretch", guideUrl: aceLibrary,
      },
    ],
    alternatives: [
      {
        id: "f-alt-bike-warmup", phase: "warmup", name: "固定自行车轻骑", englishName: "Easy stationary bike", dose: "5–6 分钟", target: "全身升温、低冲击热身", equipment: "固定自行车",
        setup: "调座椅使踏板最低点时膝盖仍略微弯曲；阻力使用中低档，上身保持放松。",
        steps: ["前 2 分钟低阻力慢骑。", "中间 2–3 分钟略微加速，让身体暖起来。", "最后 1 分钟放慢并活动肩膀。"],
        cues: ["肩膀放松", "骨盆稳定", "呼吸不急促"], mistake: "座椅过低让膝盖弯曲过多，或为了加速左右摇晃身体。", safety: "膝盖不适时检查座椅高度并减阻力。", diagram: "cardio", guideUrl: equipmentGuide,
      },
      {
        id: "f-alt-scap-pullup", phase: "warmup", name: "肩胛引体向上", englishName: "Scapular pull-up", dose: "6–10 次 × 2 组", rest: "30 秒", target: "肩胛下沉、下拉动作准备", equipment: "引体杠 / 助力机",
        setup: "双手握杠，使用助力机或双脚轻触地面减轻负荷；手臂保持伸直，身体不摆动。",
        steps: ["先从肩膀靠近耳朵的放松位置开始。", "不屈肘，把肩胛向下拉，让身体微微上升。", "停 1 秒后慢慢回到放松位置。"],
        cues: ["肘部始终直", "肩膀向下", "幅度很小"], mistake: "把动作做成半个引体，或靠摆腿让身体上升。", safety: "握力不足时使用助力机；肩部夹痛时改做轻重量直臂下压。", diagram: "pulldown", guideUrl: aceLibrary,
      },
      {
        id: "f-alt-cat-cow", phase: "warmup", name: "猫牛式", englishName: "Cat-cow", dose: "8–10 次慢速往返", target: "脊柱活动、呼吸配合", equipment: "瑜伽垫",
        setup: "四点跪姿，手腕在肩膀下方、膝盖在髋部下方；手指张开，颈部保持自然。",
        steps: ["吸气抬胸、尾骨微抬，让脊柱温和伸展。", "呼气推开地面、收下巴和尾骨，让背部拱起。", "跟随呼吸缓慢往返，不追求极限幅度。"],
        cues: ["一节一节移动", "跟随呼吸", "肩膀远离耳朵"], mistake: "快速甩动腰部，或仰头过多挤压颈椎。", safety: "手腕不适可用拳撑或前臂支撑；腰痛时减小幅度。", diagram: "shoulder-circle", guideUrl: aceLibrary,
      },
      {
        id: "f-alt-assisted-pullup", phase: "main", name: "助力引体向上", englishName: "Assisted pull-up", dose: "3 组 × 6–10 次", rest: "90 秒", target: "背阔肌、肱二头肌", equipment: "引体 / 双杠助力机",
        setup: "选择足够大的助力重量，双手略宽于肩握杠；抓稳后再跪上踏板，先让身体安静悬垂。",
        steps: ["肩膀先向下远离耳朵，胸口略抬。", "呼气让肘部向身体两侧下压，把上胸拉向横杆。", "吸气慢慢伸直手臂，保持肩胛可控后重复。"],
        cues: ["助力宁多勿少", "肘向下", "身体不摆"], mistake: "用蹬腿和摆动上冲，或耸肩缩着脖子。", safety: "上下踏板时始终抓稳；肩部夹痛时改做中立握高位下拉。", diagram: "pulldown", guideUrl: "https://www.puregym.com/exercises/back/pull-ups/", log: { sets: 3, reps: 10 },
      },
      {
        id: "f-alt-one-arm-pulldown", phase: "main", name: "单臂高位下拉", englishName: "Single-arm lat pulldown", dose: "每侧 3 组 × 10–12 次", rest: "60 秒", target: "背阔肌、左右侧控制", equipment: "龙门架 + 单手柄",
        setup: "滑轮调高，单膝跪地或坐在长凳上；工作侧手臂充分上伸，躯干保持朝前。",
        steps: ["先把工作侧肩胛向下放。", "呼气让肘部沿身体侧面拉向髋部。", "吸气缓慢上伸，感受背阔肌拉长后换边。"],
        cues: ["肘拉向髋", "身体不侧弯", "肩膀不耸"], mistake: "躯干大幅侧倾，把动作变成用体重拉手柄。", safety: "使用轻重量并远离配重片；肩部不适时缩短上伸幅度。", diagram: "pulldown", guideUrl: "https://www.puregym.com/exercises/back/lat-exercises/lat-pulldown/single-arm-lat-pulldown/", log: { sets: 3, reps: 12 },
      },
      {
        id: "f-alt-face-pull", phase: "main", name: "绳索面拉", englishName: "Cable face pull", dose: "3 组 × 12–15 次", rest: "60 秒", target: "肩后束、肩袖、上背", equipment: "龙门架 + 绳索",
        setup: "滑轮调到脸部高度，双手拇指朝向自己握绳；退后让绳索产生张力，膝盖微屈。",
        steps: ["肩膀放松，肋骨收住。", "呼气把绳索拉向眉眼高度，同时把绳端分向耳朵两侧。", "肩胛轻夹后吸气慢慢伸臂。"],
        cues: ["绳端拉向耳朵", "肘部抬起", "身体不后仰"], mistake: "重量太重导致腰部后仰，或把绳索拉向胸口变成划船。", safety: "先检查绳索卡扣；肩部疼痛时降低肘部高度和重量。", diagram: "rear-fly", guideUrl: "https://www.puregym.com/exercises/arms-and-shoulders/rear-delt-exercises/face-pulls/", log: { sets: 3, reps: 15 },
      },
      {
        id: "f-alt-db-lateral", phase: "main", name: "哑铃侧平举", englishName: "Dumbbell lateral raise", dose: "3 组 × 12–15 次", rest: "60 秒", target: "三角肌中束", equipment: "轻重量哑铃",
        setup: "站直或坐直，哑铃放在身体两侧略靠前；膝盖和肘部都保持轻微弯曲。",
        steps: ["肩膀保持向下，呼气由肘部带动手臂抬起。", "抬到接近肩高或无痛高度停一下。", "吸气用 2–3 秒缓慢放回。"],
        cues: ["肘部带动", "哑铃宁轻勿重", "不耸肩"], mistake: "用身体甩动，或把手抬得远高于肘部像倒水。", safety: "肩部出现疼痛弧时降低高度；不要用惯性冲过疼痛点。", diagram: "lateral", guideUrl: "https://www.puregym.com/exercises/arms-and-shoulders/lateral-raises/", log: { sets: 3, reps: 15 },
      },
      {
        id: "f-alt-back-extension", phase: "main", name: "器械背伸", englishName: "Machine back extension", dose: "3 组 × 10–15 次", rest: "60–75 秒", target: "竖脊肌、臀肌", equipment: "坐姿背伸机",
        setup: "调座椅和背垫，让器械转轴接近髋部；胸前交叉双臂或握住把手，先用最轻档。",
        steps: ["腹部轻收，保持脊柱自然，不含胸。", "呼气用臀部和背部把躯干推向后方。", "到身体接近直立即停，吸气控制回到起点。"],
        cues: ["不是猛甩", "顶端不过伸", "腹部保持张力"], mistake: "追求大幅后仰挤压腰椎，或快速弹回。", safety: "腰椎已有疼痛或放射性麻痛时跳过此动作并咨询专业人员。", diagram: "row", guideUrl: aceLibrary, log: { sets: 3, reps: 15 },
      },
      {
        id: "f-alt-bench-child", phase: "stretch", name: "长凳婴儿式", englishName: "Bench child's pose", dose: "20–30 秒 × 2", target: "背阔肌、上背、肩部", equipment: "长凳",
        setup: "跪在长凳前，双手或前臂放在凳面，膝盖垫软垫；臀部位于膝盖上方。",
        steps: ["手臂向前延伸，拇指朝上。", "臀部缓慢向后坐，同时胸口向地面下沉。", "腋下和上背有温和拉伸时自然呼吸。"],
        cues: ["肋骨收住", "腰部不塌", "肩膀放松"], mistake: "用腰部大幅下沉来换取肩部活动范围。", safety: "肩部夹痛时把双手分开并缩小下沉幅度。", diagram: "lat-stretch", guideUrl: aceLibrary,
      },
      {
        id: "f-alt-thread-needle", phase: "stretch", name: "穿针式上背拉伸", englishName: "Thread the needle", dose: "每侧 6–8 次", target: "胸椎旋转、菱形肌、肩后侧", equipment: "瑜伽垫",
        setup: "四点跪姿，手腕在肩下、膝盖在髋下；腹部轻收，让骨盆尽量稳定。",
        steps: ["一只手从另一只手臂下方穿过。", "肩膀和头侧面轻轻靠近垫面。", "呼气停顿后沿原路打开胸口，完成次数再换边。"],
        cues: ["旋转上背", "骨盆不翻", "颈部放松"], mistake: "把全部重量压到颈部，或用腰部侧弯代替旋转。", safety: "肩无法承重时改成坐姿胸椎旋转。", diagram: "lat-stretch", guideUrl: aceLibrary,
      },
      {
        id: "f-alt-neck-stretch", phase: "stretch", name: "颈侧温和拉伸", englishName: "Neck side stretch", dose: "每侧 15–20 秒 × 2", target: "上斜方肌、颈部侧面", equipment: "无需器械",
        setup: "坐直或站直，一只手自然垂向地面；另一只手只轻放在头侧，不主动用力下压。",
        steps: ["肩膀向下放松，目光保持朝前。", "把耳朵缓慢靠向对侧肩膀。", "颈侧有轻微牵拉时保持，再缓慢回正换边。"],
        cues: ["手不下压", "肩膀向下", "幅度很小"], mistake: "用手猛拉头部，或同时低头和转头制造更大幅度。", safety: "出现眩晕、头痛、麻木或放射痛时立即停止。", diagram: "arm-stretch", guideUrl: aceLibrary,
      },
    ],
  },
];

export const PHASE_LABELS: Record<TrainingPhase, { title: string; subtitle: string }> = {
  warmup: { title: "热身", subtitle: "先让体温、关节和动作轨迹准备好" },
  main: { title: "器械训练", subtitle: "稳定、可控，每组留 2–3 次余力" },
  stretch: { title: "拉伸收尾", subtitle: "只要温和牵拉，不弹震、不忍痛" },
};
