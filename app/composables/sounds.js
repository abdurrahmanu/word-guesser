export function useSounds() {
    const wordGuesser = useGameStore()
    const {useSound} = storeToRefs(wordGuesser)

    const winAudio = new Audio('/win.mp3')
    const revealAudio = new Audio('/reveal.wav')
    revealAudio.volume = 0.5

    const playAlarm = () => {
    if (!useSound.value) return
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const osc = ctx.createOscillator()
        osc.type = 'square'
        osc.frequency.setValueAtTime(400, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5)
        osc.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.5)
    } catch(e) { console.error("Audio API failed", e) }
    }

    const playWinSound = () => {
        if (!useSound.value) return
        try {
            winAudio.currentTime = 0; 
            winAudio.play();
        } catch(e) { 
            console.error("Failed to play audio", e); 
        }
    };

    const playRevealSound = () => {
        if (!useSound.value) return
        try {
            revealAudio.currentTime = 0; 
            revealAudio.play();
        } catch(e) { 
            console.error("Failed to play audio", e); 
        }
    };

    const playForfeitSound = () => {
        if (!useSound.value) return
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // 'sawtooth' gives a harsh, buzzy sound perfect for a penalty or loss
        osc.type = 'sawtooth'; 

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        // --- Pitch Envelope (The Deflate) ---
        // Start at a medium pitch and slide down very low over 1.5 seconds
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 1.5);

        // --- Volume Envelope (The Fade) ---
        // Start at 30% volume and fade out smoothly
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 1.5);

        osc.start(now);
        osc.stop(now + 1.5);
    } catch(e) { 
        console.error("Audio API failed", e); 
    }
    };

     const playTransferTurnSound = () => {
        if (!useSound.value) return
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // A 'sine' wave is very smooth and clean—perfect for subtle UI sounds
        osc.type = 'sine'; 

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        osc.frequency.setValueAtTime(440, now);           // Note A4
        osc.frequency.setValueAtTime(587.33, now + 0.05); // Note D5 (jumps up after 50ms)

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.02); // Quick ramp up to avoid clicks
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15); // Fast fade out

        osc.start(now);
        osc.stop(now + 0.15);
    } catch(e) { 
        console.error("Audio API failed", e); 
    }
    };

     const playKillTurnSound = () => {
    if (!useSound.value) return
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'square'; 

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        // --- Pitch (The Motor Speed) ---
        // Dropped to 15Hz. This is sub-audio, meaning you will hear
        // individual, rapid clicks rather than a smooth tone.
        osc.frequency.setValueAtTime(15, now); 

        // --- Volume Envelope (The Buzz) ---
        // Bumped the volume slightly to 0.5 to ensure the heavy clicks punch through
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.02); 
        gainNode.gain.setValueAtTime(0.5, now + 0.25);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3); 

        osc.start(now);
        osc.stop(now + 0.3);
    } catch(e) { 
        console.error("Audio API failed", e); 
    }
    };

     const vibrateOnIndexPress = () => {
    if (!useSound.value) return
        try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Changed to 'square' for a mechanical, phone-motor feel
        osc.type = 'square'; 

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        // --- Pitch (The Motor Speed) ---
        // A steady 75Hz creates a tight, convincing physical vibration sound.
        // No sliding pitch this time!
        osc.frequency.setValueAtTime(75, now); 

        // --- Volume Envelope (The Buzz) ---
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02); // Fast ramp up
        gainNode.gain.setValueAtTime(0.3, now + 0.25);          // Hold steady
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3); // Sharp cutoff

        osc.start(now);
        osc.stop(now + 0.3);
    } catch(e) { 
        console.error("Audio API failed", e); 
    }
    };

    return {
        playForfeitSound,
        playAlarm,
        playKillTurnSound,
        playRevealSound,
        playTransferTurnSound,
        playWinSound,
        vibrateOnIndexPress
    }
}
