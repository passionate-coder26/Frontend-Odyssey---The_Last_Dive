import { useEffect, useRef, useState, useCallback } from 'react'

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function createNoise(ctx) {
  const bufferSize = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.loop = true
  return src
}

function ramp(param, value, ctx, duration = 0.05) {
  param.setTargetAtTime(value, ctx.currentTime, duration)
}

// ─────────────────────────────────────────────
// ZONE AUDIO BUILDERS
// Each builder returns { start(), stop(), setVolume(v) }
// ─────────────────────────────────────────────

// SURFACE: waves + wind + seagull chirps + dolphin clicks
function buildSurface(ctx, masterGain) {
  const nodes = []
  const out = ctx.createGain()
  out.gain.value = 0
  out.connect(masterGain)

  // Ocean wave LFO on filtered noise
  const waveNoise = createNoise(ctx)
  const waveFilter = ctx.createBiquadFilter()
  waveFilter.type = 'bandpass'
  waveFilter.frequency.value = 300
  waveFilter.Q.value = 0.8
  const waveGain = ctx.createGain()
  waveGain.gain.value = 0.35
  waveNoise.connect(waveFilter)
  waveFilter.connect(waveGain)
  waveGain.connect(out)
  // LFO modulates waveGain
  const waveLFO = ctx.createOscillator()
  waveLFO.type = 'sine'
  waveLFO.frequency.value = 0.18
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.25
  waveLFO.connect(lfoGain)
  lfoGain.connect(waveGain.gain)
  nodes.push(waveNoise, waveLFO)

  // Wind: high-pass filtered noise
  const windNoise = createNoise(ctx)
  const windFilter = ctx.createBiquadFilter()
  windFilter.type = 'highpass'
  windFilter.frequency.value = 1800
  const windGain = ctx.createGain()
  windGain.gain.value = 0.06
  windNoise.connect(windFilter)
  windFilter.connect(windGain)
  windGain.connect(out)
  nodes.push(windNoise)

  // Seagull chirp scheduler
  let chirpTimer = null
  function scheduleChirp() {
    const delay = 4000 + Math.random() * 8000
    chirpTimer = setTimeout(() => {
      try {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = 1800 + Math.random() * 600
        g.gain.value = 0
        osc.connect(g)
        g.connect(out)
        const t = ctx.currentTime
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.06, t + 0.02)
        osc.frequency.linearRampToValueAtTime(2400 + Math.random() * 400, t + 0.08)
        g.gain.linearRampToValueAtTime(0, t + 0.15)
        osc.start(t)
        osc.stop(t + 0.2)
      } catch (_) {}
      scheduleChirp()
    }, delay)
  }

  // Dolphin click scheduler
  let clickTimer = null
  function scheduleClick() {
    const delay = 8000 + Math.random() * 15000
    clickTimer = setTimeout(() => {
      try {
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / 200)
        const src = ctx.createBufferSource()
        src.buffer = buf
        const g = ctx.createGain()
        g.gain.value = 0.07
        const filt = ctx.createBiquadFilter()
        filt.type = 'bandpass'
        filt.frequency.value = 8000
        src.connect(filt)
        filt.connect(g)
        g.connect(out)
        src.start()
      } catch (_) {}
      scheduleClick()
    }, delay)
  }

  return {
    start() {
      nodes.forEach(n => n.start && n.start())
      scheduleChirp()
      scheduleClick()
    },
    stop() {
      nodes.forEach(n => { try { n.stop() } catch (_) {} })
      clearTimeout(chirpTimer)
      clearTimeout(clickTimer)
    },
    setVolume(v) { ramp(out.gain, v, ctx, 1.5) }
  }
}

// TWILIGHT: pressure hum + bioluminescent pings + whale moan
function buildTwilight(ctx, masterGain) {
  const nodes = []
  const out = ctx.createGain()
  out.gain.value = 0
  out.connect(masterGain)

  // Pressure hum drone
  const hum = ctx.createOscillator()
  hum.type = 'sine'
  hum.frequency.value = 48
  const humGain = ctx.createGain()
  humGain.gain.value = 0.28
  hum.connect(humGain)
  humGain.connect(out)
  nodes.push(hum)

  // Sub-hum: adds thickness
  const subHum = ctx.createOscillator()
  subHum.type = 'triangle'
  subHum.frequency.value = 52
  const subGain = ctx.createGain()
  subGain.gain.value = 0.12
  subHum.connect(subGain)
  subGain.connect(out)
  nodes.push(subHum)

  // Bioluminescent ping scheduler
  let pingTimer = null
  function schedulePing() {
    const delay = 2000 + Math.random() * 5000
    pingTimer = setTimeout(() => {
      try {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = 600 + Math.random() * 800
        g.gain.value = 0
        osc.connect(g)
        g.connect(out)
        const t = ctx.currentTime
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.04, t + 0.01)
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.2)
        osc.start(t)
        osc.stop(t + 1.3)
      } catch (_) {}
      schedulePing()
    }, delay)
  }

  // Whale moan scheduler
  let whaleTimer = null
  function scheduleWhale() {
    const delay = 12000 + Math.random() * 20000
    whaleTimer = setTimeout(() => {
      try {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = 85
        g.gain.value = 0
        osc.connect(g)
        g.connect(out)
        const t = ctx.currentTime
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.15, t + 0.5)
        osc.frequency.linearRampToValueAtTime(55, t + 3)
        osc.frequency.linearRampToValueAtTime(75, t + 5)
        g.gain.linearRampToValueAtTime(0, t + 6)
        osc.start(t)
        osc.stop(t + 7)
      } catch (_) {}
      scheduleWhale()
    }, delay)
  }

  return {
    start() {
      nodes.forEach(n => n.start && n.start())
      schedulePing()
      scheduleWhale()
    },
    stop() {
      nodes.forEach(n => { try { n.stop() } catch (_) {} })
      clearTimeout(pingTimer)
      clearTimeout(whaleTimer)
    },
    setVolume(v) { ramp(out.gain, v, ctx, 1.8) }
  }
}

// MIDNIGHT: deep drone + heartbeat + anglerfish + hull creaks
function buildMidnight(ctx, masterGain) {
  const nodes = []
  const out = ctx.createGain()
  out.gain.value = 0
  out.connect(masterGain)

  // Deep pressure drone 30Hz
  const drone = ctx.createOscillator()
  drone.type = 'sine'
  drone.frequency.value = 30
  const droneGain = ctx.createGain()
  droneGain.gain.value = 0.35
  drone.connect(droneGain)
  droneGain.connect(out)
  nodes.push(drone)

  // Heartbeat — two thumps every 2.4s
  let heartTimer = null
  function scheduleHeart() {
    heartTimer = setInterval(() => {
      ;[0, 0.22].forEach(offset => {
        try {
          const osc = ctx.createOscillator()
          const g = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.value = 58
          g.gain.value = 0
          osc.connect(g)
          g.connect(out)
          const t = ctx.currentTime + offset
          g.gain.setValueAtTime(0, t)
          g.gain.linearRampToValueAtTime(0.22, t + 0.04)
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
          osc.start(t)
          osc.stop(t + 0.3)
        } catch (_) {}
      })
    }, 2400)
  }

  // Anglerfish lure ping
  let anglerTimer = null
  function scheduleAngler() {
    const delay = 5000 + Math.random() * 10000
    anglerTimer = setTimeout(() => {
      try {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = 1100 + Math.random() * 200
        g.gain.value = 0
        osc.connect(g)
        g.connect(out)
        const t = ctx.currentTime
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.05, t + 0.01)
        g.gain.exponentialRampToValueAtTime(0.001, t + 2.5)
        osc.frequency.linearRampToValueAtTime(900, t + 2)
        osc.start(t)
        osc.stop(t + 3)
      } catch (_) {}
      scheduleAngler()
    }, delay)
  }

  // Hull creak schedule
  let creakTimer = null
  function scheduleCreak() {
    const delay = 6000 + Math.random() * 12000
    creakTimer = setTimeout(() => {
      try {
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2)
        const src = ctx.createBufferSource()
        src.buffer = buf
        const filt = ctx.createBiquadFilter()
        filt.type = 'bandpass'
        filt.frequency.value = 120 + Math.random() * 80
        filt.Q.value = 8
        const g = ctx.createGain()
        g.gain.value = 0.18
        src.connect(filt)
        filt.connect(g)
        g.connect(out)
        src.start()
      } catch (_) {}
      scheduleCreak()
    }, delay)
  }

  return {
    start() {
      nodes.forEach(n => n.start && n.start())
      scheduleHeart()
      scheduleAngler()
      scheduleCreak()
    },
    stop() {
      nodes.forEach(n => { try { n.stop() } catch (_) {} })
      clearInterval(heartTimer)
      clearTimeout(anglerTimer)
      clearTimeout(creakTimer)
    },
    setVolume(v) { ramp(out.gain, v, ctx, 2) }
  }
}

// ABYSS: warning beeps + grinding + breathing + O2 alert
function buildAbyss(ctx, masterGain) {
  const nodes = []
  const out = ctx.createGain()
  out.gain.value = 0
  out.connect(masterGain)

  // Sub-rumble for structural tension
  const rumble = ctx.createOscillator()
  rumble.type = 'sawtooth'
  rumble.frequency.value = 22
  const rumbleFilter = ctx.createBiquadFilter()
  rumbleFilter.type = 'lowpass'
  rumbleFilter.frequency.value = 60
  const rumbleGain = ctx.createGain()
  rumbleGain.gain.value = 0.18
  rumble.connect(rumbleFilter)
  rumbleFilter.connect(rumbleGain)
  rumbleGain.connect(out)
  nodes.push(rumble)

  // Critical warning beeps
  let beepTimer = null
  function scheduleBeep() {
    const delay = 1500 + Math.random() * 3000
    beepTimer = setTimeout(() => {
      try {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'square'
        osc.frequency.value = 880
        g.gain.value = 0
        osc.connect(g)
        g.connect(out)
        const t = ctx.currentTime
        g.gain.setValueAtTime(0.07, t)
        g.gain.setValueAtTime(0, t + 0.08)
        // Double beep
        g.gain.setValueAtTime(0.07, t + 0.14)
        g.gain.setValueAtTime(0, t + 0.22)
        osc.start(t)
        osc.stop(t + 0.25)
      } catch (_) {}
      scheduleBeep()
    }, delay)
  }

  // Deep grinding/structural stress
  let grindTimer = null
  function scheduleGrind() {
    const delay = 8000 + Math.random() * 16000
    grindTimer = setTimeout(() => {
      try {
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < d.length; i++) {
          const env = Math.sin(Math.PI * i / d.length)
          d[i] = (Math.random() * 2 - 1) * env * 0.6
        }
        const src = ctx.createBufferSource()
        src.buffer = buf
        const filt = ctx.createBiquadFilter()
        filt.type = 'bandpass'
        filt.frequency.value = 200
        filt.Q.value = 3
        const g = ctx.createGain()
        g.gain.value = 0.22
        src.connect(filt)
        filt.connect(g)
        g.connect(out)
        src.start()
      } catch (_) {}
      scheduleGrind()
    }, delay)
  }

  // O2 high-pitch alert (very subtle, high freq)
  const o2Alert = ctx.createOscillator()
  o2Alert.type = 'sine'
  o2Alert.frequency.value = 2200
  const o2LFO = ctx.createOscillator()
  o2LFO.type = 'square'
  o2LFO.frequency.value = 1.2
  const o2LFOGain = ctx.createGain()
  o2LFOGain.gain.value = 0.02
  const o2Gain = ctx.createGain()
  o2Gain.gain.value = 0
  o2LFO.connect(o2LFOGain)
  o2LFOGain.connect(o2Gain.gain)
  o2Alert.connect(o2Gain)
  o2Gain.connect(out)
  nodes.push(o2Alert, o2LFO)

  return {
    start() {
      nodes.forEach(n => n.start && n.start())
      scheduleBeep()
      scheduleGrind()
      // Allow O2 alert to subtly be heard in abyss
      ramp(o2Gain.gain, 0.025, ctx, 2)
    },
    stop() {
      nodes.forEach(n => { try { n.stop() } catch (_) {} })
      clearTimeout(beepTimer)
      clearTimeout(grindTimer)
    },
    setVolume(v) { ramp(out.gain, v, ctx, 2) }
  }
}

// HADAL: subsonic rumble + Kraken reveals + cinematic phases
function buildHadal(ctx, masterGain) {
  const nodes = []
  const out = ctx.createGain()
  out.gain.value = 0
  out.connect(masterGain)

  // Subsonic Kraken presence — felt not heard
  const kraken = ctx.createOscillator()
  kraken.type = 'sine'
  kraken.frequency.value = 14
  const krakenFilter = ctx.createBiquadFilter()
  krakenFilter.type = 'lowpass'
  krakenFilter.frequency.value = 40
  const krakenGain = ctx.createGain()
  krakenGain.gain.value = 0.5
  kraken.connect(krakenFilter)
  krakenFilter.connect(krakenGain)
  krakenGain.connect(out)

  // Second harmonic for richness
  const kraken2 = ctx.createOscillator()
  kraken2.type = 'triangle'
  kraken2.frequency.value = 18
  const kraken2Gain = ctx.createGain()
  kraken2Gain.gain.value = 0.25
  kraken2.connect(kraken2Gain)
  kraken2Gain.connect(out)
  nodes.push(kraken, kraken2)

  // Bio pings — accelerate as Kraken reveals
  let pingTimer = null
  let pingInterval = 4000
  function schedulePing() {
    pingTimer = setTimeout(() => {
      try {
        const freq = 300 + Math.random() * 500
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        g.gain.value = 0
        osc.connect(g)
        g.connect(out)
        const t = ctx.currentTime
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.06, t + 0.01)
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.5)
        osc.start(t)
        osc.stop(t + 2)
      } catch (_) {}
      schedulePing()
    }, pingInterval)
  }

  // Phase sound controllers
  const phaseGain = ctx.createGain()
  phaseGain.gain.value = 0
  phaseGain.connect(out)
  let phaseNodes = []

  function stopPhaseNodes() {
    phaseNodes.forEach(n => { try { n.stop() } catch (_) {} })
    phaseNodes = []
    ramp(phaseGain.gain, 0, ctx, 0.5)
  }

  function playTerror() {
    stopPhaseNodes()
    // Harsh dissonant cluster
    ;[55, 58.3, 73.4, 110].forEach(freq => {
      const o = ctx.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = freq
      o.connect(phaseGain)
      o.start()
      phaseNodes.push(o)
    })
    ramp(phaseGain.gain, 0.3, ctx, 0.3)
    pingInterval = 800
  }

  function playFrightened() {
    stopPhaseNodes()
    // Accelerating heartbeat
    let beat = 0
    const rapidHeart = setInterval(() => {
      beat++
      const bpm = Math.min(160, 80 + beat * 4)
      ;[0, 0.15].forEach(off => {
        try {
          const o = ctx.createOscillator()
          const g = ctx.createGain()
          o.type = 'sine'
          o.frequency.value = 62
          g.gain.value = 0
          o.connect(g)
          g.connect(out)
          const t = ctx.currentTime + off
          g.gain.setValueAtTime(0.3, t)
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
          o.start(t)
          o.stop(t + 0.25)
        } catch (_) {}
      })
      if (beat > 30) clearInterval(rapidHeart)
      // use bpm variable to silence lint warning
      void bpm
    }, 60000 / 100)
    phaseNodes.push({ stop: () => clearInterval(rapidHeart) })
  }

  function playPhotograph() {
    stopPhaseNodes()
    ramp(phaseGain.gain, 0, ctx, 0.1)
    pingInterval = 6000
  }

  function playRecognition() {
    stopPhaseNodes()
    // Warm harmonious chord emerging (C major-ish)
    ;[130.8, 164.8, 196, 261.6].forEach((freq, i) => {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = freq
      o.connect(phaseGain)
      o.start()
      phaseNodes.push(o)
    })
    ramp(phaseGain.gain, 0.12, ctx, 2)
    pingInterval = 3000
  }

  function playElena() {
    stopPhaseNodes()
    // Melancholic minor melody (D minor-ish — D, F, A, C)
    const melody = [146.8, 174.6, 220, 261.6, 220, 174.6, 146.8]
    melody.forEach((freq, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = freq
      g.gain.value = 0
      o.connect(g)
      g.connect(out)
      const t = ctx.currentTime + i * 1.2
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.06, t + 0.1)
      g.gain.linearRampToValueAtTime(0, t + 1.0)
      o.start(t)
      o.stop(t + 1.2)
      phaseNodes.push(o)
    })
    pingInterval = 4000
  }

  function playFarewell() {
    stopPhaseNodes()
    // Deep resonant bell (432 Hz - A)
    const bell = ctx.createOscillator()
    bell.type = 'sine'
    bell.frequency.value = 216
    const bellGain = ctx.createGain()
    bellGain.gain.value = 0
    bell.connect(bellGain)
    bellGain.connect(out)
    const t = ctx.currentTime
    bellGain.gain.setValueAtTime(0, t)
    bellGain.gain.linearRampToValueAtTime(0.2, t + 0.05)
    bellGain.gain.exponentialRampToValueAtTime(0.001, t + 8)
    bell.start(t)
    bell.stop(t + 9)
    phaseNodes.push(bell)
    pingInterval = 6000
  }

  function playEpilogue() {
    stopPhaseNodes()
    // Gentle ambient pad
    ;[82.4, 110, 130.8].forEach(freq => {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = freq
      o.connect(phaseGain)
      o.start()
      phaseNodes.push(o)
    })
    ramp(phaseGain.gain, 0.08, ctx, 3)
    pingInterval = 5000
  }

  function playFinal() {
    stopPhaseNodes()
    // Single pure tone fading to silence
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = 528 // "love frequency"
    const g = ctx.createGain()
    g.gain.value = 0.15
    o.connect(g)
    g.connect(out)
    o.start()
    phaseNodes.push(o)
    ramp(g.gain, 0, ctx, 8)
    pingInterval = 12000
  }

  const PHASE_MAP = {
    terror: playTerror,
    frightened: playFrightened,
    photograph: playPhotograph,
    recognition: playRecognition,
    elena: playElena,
    farewell: playFarewell,
    epilogue: playEpilogue,
    final: playFinal,
  }

  return {
    start() {
      nodes.forEach(n => n.start && n.start())
      schedulePing()
    },
    stop() {
      nodes.forEach(n => { try { n.stop() } catch (_) {} })
      stopPhaseNodes()
      clearTimeout(pingTimer)
    },
    setVolume(v) { ramp(out.gain, v, ctx, 2.5) },
    setPhase(phase) {
      if (phase && PHASE_MAP[phase]) PHASE_MAP[phase]()
    }
  }
}

// DIVER BREATHING — global throughout the dive
function buildBreathing(ctx, masterGain) {
  const out = ctx.createGain()
  out.gain.value = 0
  out.connect(masterGain)

  // Breathing: amplitude-modulated bandpass noise
  const noise = createNoise(ctx)
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 400
  filter.Q.value = 1.5
  const breathGain = ctx.createGain()
  breathGain.gain.value = 0.15

  const lfo = ctx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 0.28 // ~17 breaths/min at surface
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.12

  noise.connect(filter)
  filter.connect(breathGain)
  breathGain.connect(out)
  lfo.connect(lfoGain)
  lfoGain.connect(breathGain.gain)

  return {
    start() { noise.start(); lfo.start() },
    stop() { try { noise.stop() } catch (_) {} try { lfo.stop() } catch (_) {} },
    setVolume(v) { ramp(out.gain, v, ctx, 1) },
    setBreathRate(rate) {
      // rate: 0 (slow/peaceful) → 1 (panic)
      ramp(lfo.frequency, 0.2 + rate * 0.5, ctx, 2)
    }
  }
}

// ─────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────
export function useAudioManager(scrollData) {
  const ctxRef = useRef(null)
  const zonesRef = useRef({})        // { surface, twilight, midnight, abyss, hadal }
  const breathingRef = useRef(null)
  const startedRef = useRef(false)
  const currentZoneRef = useRef(-1)
  const currentPhaseRef = useRef(null)
  const isMobileRef = useRef(typeof window !== 'undefined' && window.matchMedia('(pointer:coarse)').matches)

  const [isMuted, setIsMuted] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  // ── Bootstrap AudioContext on first user interaction ──
  const initAudio = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true

    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx

    // Master compressor → destination
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -18
    compressor.knee.value = 6
    compressor.ratio.value = 4
    compressor.attack.value = 0.003
    compressor.release.value = 0.25
    compressor.connect(ctx.destination)

    const masterGain = ctx.createGain()
    masterGain.gain.value = isMobileRef.current ? 0.65 : 1.0
    masterGain.connect(compressor)

    // Build zone soundscapes
    const z = {
      surface:  buildSurface(ctx, masterGain),
      twilight: buildTwilight(ctx, masterGain),
      midnight: buildMidnight(ctx, masterGain),
      abyss:    buildAbyss(ctx, masterGain),
      hadal:    buildHadal(ctx, masterGain),
    }
    Object.values(z).forEach(zone => zone.start())
    zonesRef.current = z

    // Breathing
    const br = buildBreathing(ctx, masterGain)
    br.start()
    breathingRef.current = br

    // Store master gain ref for mute
    ctxRef.current._masterGain = masterGain

    // Give surface a starting fade in
    z.surface.setVolume(0.9)
    br.setVolume(0.18)

    setIsStarted(true)
  }, [])

  // ── Tab visibility ──
  useEffect(() => {
    const onVis = () => {
      if (!ctxRef.current) return
      if (document.hidden) ctxRef.current.suspend()
      else ctxRef.current.resume()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // ── Wire first-interaction ──
  useEffect(() => {
    const events = ['click', 'keydown', 'touchstart', 'scroll']
    const handle = () => { initAudio(); events.forEach(e => window.removeEventListener(e, handle)) }
    events.forEach(e => window.addEventListener(e, handle, { passive: true }))
    return () => events.forEach(e => window.removeEventListener(e, handle))
  }, [initAudio])

  // ── Zone crossfade & breathing logic ──
  useEffect(() => {
    if (!isStarted || !scrollData) return
    const z = zonesRef.current
    const br = breathingRef.current
    if (!z.surface) return

    const { zoneIndex, progress } = scrollData

    // Cross-fade zones
    if (zoneIndex !== currentZoneRef.current) {
      currentZoneRef.current = zoneIndex

      // Set all to 0
      z.surface.setVolume(0)
      z.twilight.setVolume(0)
      z.midnight.setVolume(0)
      z.abyss.setVolume(0)
      z.hadal.setVolume(0)

      switch (zoneIndex) {
        case 0:
          z.surface.setVolume(0.9)
          br.setVolume(0.15)
          br.setBreathRate(0)
          break
        case 1:
          z.twilight.setVolume(0.85)
          br.setVolume(0.22)
          br.setBreathRate(0.2)
          break
        case 2:
          z.midnight.setVolume(0.9)
          br.setVolume(0.28)
          br.setBreathRate(0.5)
          break
        case 3:
          z.abyss.setVolume(0.85)
          br.setVolume(0.35)
          br.setBreathRate(0.85)
          break
        case 4:
          z.hadal.setVolume(0.75)
          br.setVolume(0.2)
          br.setBreathRate(0.3)
          break
        default:
          break
      }
    }

    // Hadal ending phase audio
    if (zoneIndex === 4 && scrollData.endingPhase && scrollData.endingPhase !== currentPhaseRef.current) {
      currentPhaseRef.current = scrollData.endingPhase
      z.hadal.setPhase?.(scrollData.endingPhase)

      // Breathing adjustments per ending phase
      switch (scrollData.endingPhase) {
        case 'terror':      br.setBreathRate(1); break
        case 'frightened':  br.setBreathRate(1); break
        case 'photograph':  br.setVolume(0); break   // silence
        case 'recognition': br.setBreathRate(0.1); br.setVolume(0.12); break
        case 'elena':       br.setBreathRate(0); br.setVolume(0.1); break
        case 'final':       br.setVolume(0); break
        default: break
      }
    }
  }, [isStarted, scrollData])

  // ── Mute / unmute ──
  const toggleMute = useCallback(() => {
    if (!ctxRef.current) { initAudio(); return }
    const masterGain = ctxRef.current._masterGain
    if (!masterGain) return
    setIsMuted(prev => {
      const next = !prev
      masterGain.gain.setTargetAtTime(next ? 0 : (isMobileRef.current ? 0.65 : 1.0), ctxRef.current.currentTime, 0.1)
      return next
    })
  }, [initAudio])

  return { isMuted, toggleMute, isStarted }
}
