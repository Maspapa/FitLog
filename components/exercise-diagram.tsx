import type { DiagramKind } from "@/lib/training-plan";

export function ExerciseDiagram({ kind }: { kind: DiagramKind }) {
  return (
    <div className="exercise-diagram" role="img" aria-label="动作起始与结束姿势图解">
      <svg viewBox="0 0 320 150" aria-hidden="true">
        <rect className="diagram-panel" x="2" y="2" width="146" height="126" rx="15" />
        <rect className="diagram-panel end" x="172" y="2" width="146" height="126" rx="15" />
        <text x="15" y="20">起始</text><text x="185" y="20">结束</text>
        <Pose kind={kind} end={false} offset={0} />
        <path className="diagram-arrow" d="M151 65h15m-5-5 5 5-5 5" />
        <Pose kind={kind} end offset={170} />
        <text className="diagram-caption" x="160" y="146" textAnchor="middle">慢速移动 · 保持控制 · 疼痛即停</text>
      </svg>
    </div>
  );
}

function Pose({ kind, end, offset }: { kind: DiagramKind; end: boolean; offset: number }) {
  const p = `translate(${offset} 0)`;
  const head = <circle className="figure-head" cx="75" cy="41" r="9" />;
  const seatedBase = <><path className="equipment" d="M45 102h58M52 71v50M50 103h-9" /><path className="figure" d="M75 51v40M75 91h24l17 27M75 91 61 119" />{head}</>;
  const standingBase = <><path className="ground" d="M35 122h80" /><path className="figure" d="M75 51v39M75 90 58 121M75 90 92 121" />{head}</>;

  if (kind === "push") return <g transform={p}>{seatedBase}<path className="equipment" d="M116 47v66" /><path className="figure accent" d={end ? "M75 58 111 64M75 58 111 55" : "M75 58 91 66 107 58M75 58 91 50 107 58"} /><path className="motion" d={end ? "M93 38h22" : "M99 38h13"} /></g>;
  if (kind === "fly" || kind === "rear-fly") return <g transform={p}>{standingBase}<path className="figure accent" d={end ? "M75 58 37 66M75 58 113 66" : "M75 58 59 77M75 58 91 77"} /><path className="motion" d={end ? "M48 48 35 58M102 48l13 10" : "M49 79h16M101 79H85"} /></g>;
  if (kind === "overhead") return <g transform={p}>{seatedBase}<path className="figure accent" d={end ? "M75 58 58 28M75 58 92 28" : "M75 58 54 67M75 58 96 67"} /><path className="equipment" d={end ? "M48 25h20M82 25h20" : "M45 69h18M87 69h18"} /><path className="motion" d="M42 48V29m-5 5 5-5 5 5" /></g>;
  if (kind === "pressdown") return <g transform={p}>{standingBase}<path className="equipment" d="M107 25v75M98 25h18" /><path className="figure accent" d={end ? "M75 59 90 72 92 99M75 59 67 72 65 99" : "M75 59 90 72 83 53M75 59 67 72 74 53"} /><path className="motion" d="M105 67v27m-5-6 5 6 5-6" /></g>;
  if (kind === "leg-press") return <g transform={p}>{seatedBase}<path className="equipment" d="M119 38v80M113 43h12" /><path className="figure accent" d={end ? "M75 90 98 80 117 64" : "M75 90 99 102 116 83"} /><path className="motion" d="M99 55 117 42m-9-1 9 1-3 9" /></g>;
  if (kind === "leg-curl") return <g transform={p}>{seatedBase}<path className="equipment" d="M92 112h31" /><path className="figure accent" d={end ? "M75 90 102 94 93 116" : "M75 90 104 90 121 112"} /><path className="motion" d="M116 92q8 15-4 25" /></g>;
  if (kind === "leg-extension") return <g transform={p}>{seatedBase}<path className="equipment" d="M111 110h18" /><path className="figure accent" d={end ? "M75 90 103 90 126 91" : "M75 90 103 94 108 119"} /><path className="motion" d="M111 109q11-9 14-19" /></g>;
  if (kind === "bridge") return <g transform={p}><path className="ground" d="M25 121h100" /><circle className="figure-head" cx="38" cy={end ? 91 : 106} r="8" /><path className="figure accent" d={end ? "M46 94 78 76 104 96 121 121" : "M46 108 77 110 103 96 121 121"} /><path className="motion" d="M75 101V76m-5 7 5-7 5 7" /></g>;
  if (kind === "squat") return <g transform={p}>{head}<path className="ground" d="M32 122h88" /><path className="equipment" d="M105 91v30H83" /><path className="figure accent" d={end ? "M75 50 66 79 91 94 104 121M66 79 50 112" : "M75 50v39M75 89 58 121M75 89 92 121"} /><path className="motion" d="M111 53v25m-5-6 5 6 5-6" /></g>;
  if (kind === "abduction") return <g transform={p}>{seatedBase}<path className="figure accent" d={end ? "M75 91 49 103 42 120M75 91 101 103 108 120" : "M75 91 66 104 64 120M75 91 84 104 86 120"} /><path className="motion" d="M57 102 43 96M93 102l14-6" /></g>;
  if (kind === "pulldown") return <g transform={p}>{seatedBase}<path className="equipment" d="M35 26h80M42 26v96" /><path className="figure accent" d={end ? "M75 57 54 64 46 83M75 57 96 64 104 83" : "M75 57 53 32M75 57 97 32"} /><path className="motion" d="M118 40v34m-5-6 5 6 5-6" /></g>;
  if (kind === "row") return <g transform={p}>{seatedBase}<path className="equipment" d="M118 55v65" /><path className="figure accent" d={end ? "M75 60 90 72 70 70" : "M75 60 98 67 117 66"} /><path className="motion" d="M113 45H88m7-5-7 5 7 5" /></g>;
  if (kind === "lateral") return <g transform={p}>{standingBase}<path className="figure accent" d={end ? "M75 58 40 64M75 58 110 64" : "M75 58 60 89M75 58 90 89"} /><path className="motion" d="M43 82q-8-10-5-21M107 82q8-10 5-21" /></g>;
  if (kind === "cardio") return <g transform={p}><path className="equipment" d="M26 121h96M37 121l18-35h48l13 35M101 86l12-25" /><circle className="figure-head" cx={end ? 77 : 71} cy="39" r="9" /><path className="figure accent" d={end ? "M77 49 84 78 105 89M84 78 62 93 48 119M84 78 91 104 111 119" : "M71 49 67 79 50 88M67 79 88 94 102 119M67 79 58 104 42 119"} /><path className="motion" d="M51 66h38m-7-5 7 5-7 5" /></g>;
  if (kind === "shoulder-circle") return <g transform={p}>{standingBase}<path className="figure accent" d={end ? "M75 58 43 45M75 58 107 45" : "M75 58 47 75M75 58 103 75"} /><path className="motion" d="M37 69q-12-22 4-37m71 37q12-22-4-37" /></g>;
  if (kind === "chest-stretch") return <g transform={p}>{standingBase}<path className="equipment" d="M108 25v98" /><path className="figure accent" d={end ? "M75 58 98 50 108 63" : "M75 58 91 63 108 63"} /><path className="motion" d="M60 40h22m-6-5 6 5-6 5" /></g>;
  if (kind === "hip-stretch") return <g transform={p}><circle className="figure-head" cx="71" cy="42" r="9" /><path className="ground" d="M25 121h100" /><path className="figure accent" d={end ? "M71 51 79 82 104 95 119 121M79 82 54 96 38 121" : "M71 51 71 83 94 95 111 121M71 83 48 99 35 121"} /><path className="motion" d="M82 62h23m-6-5 6 5-6 5" /></g>;
  if (kind === "hamstring-stretch") return <g transform={p}><path className="equipment" d="M38 88h48v34M44 88v34" /><circle className="figure-head" cx={end ? 83 : 64} cy={end ? 55 : 42} r="9" /><path className="figure accent" d={end ? "M78 64 62 89 101 94 124 113M62 89 45 120" : "M64 51 62 88 101 94 124 113M62 88 45 120"} /><path className="motion" d="M91 38q-17 9-24 25" /></g>;
  if (kind === "glute-stretch") return <g transform={p}><path className="ground" d="M25 121h100" /><circle className="figure-head" cx="34" cy="100" r="8" /><path className="figure accent" d={end ? "M42 103 73 100 99 79M73 100 103 110 119 90M99 79 115 95" : "M42 103 72 104 98 91M72 104 102 111 119 99M98 91 113 104"} /><path className="motion" d="M109 67v17m-5-5 5 5 5-5" /></g>;
  if (kind === "lat-stretch") return <g transform={p}><path className="equipment" d="M91 76h35v46M101 76v46" /><circle className="figure-head" cx={end ? 77 : 73} cy={end ? 62 : 52} r="9" /><path className="figure accent" d={end ? "M72 70 54 92 75 107 88 121M54 92 43 121M72 71 99 76" : "M73 61 64 87 82 102 93 121M64 87 51 121M73 62 99 76"} /><path className="motion" d="M49 56v21m-5-5 5 5 5-5" /></g>;
  return <g transform={p}>{standingBase}<path className="figure accent" d={end ? "M75 58 45 58M75 58 91 39" : "M75 58 54 67M75 58 92 71"} /><path className="motion" d="M45 43h20m-6-5 6 5-6 5" /></g>;
}
