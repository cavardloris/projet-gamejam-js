export class AudioManager {
    constructor() {
        this.sounds = {};
        this.loops = {}; // Pour stocker les sons en boucle séparément
        this.muted = false;
    }

    loadSound(name, url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(url);
            audio.preload = "auto";
            audio.addEventListener(
                "canplaythrough",
                () => {
                    this.sounds[name] = audio;
                    console.log(`Son "${name}" préchargé ✓`);
                    resolve();
                },
                { once: true },
            );

            audio.addEventListener("error", (e) => {
                console.error(`Erreur de chargement du son "${name}":`, e);
                reject(e);
            });

            audio.load();
        });
    }

    stopAll() {
        for (const sound of Object.values(this.loops)) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    play(name, volume = 1) {
        if (this.muted || !this.sounds[name]) return;
        this.stopAll();

        const sound = this.sounds[name];
        sound.volume = volume;
        sound.currentTime = 0;
        console.log("Lecture du son:", name);

        const now = performance.now();

        sound
            .play()
            .then(() => {
                const elapsed = performance.now() - now;
                console.log(`Son "${name}" joué en ${elapsed.toFixed(2)} ms ✓`);
            })
            .catch((err) => console.log("Erreur audio:", err));
    }

    playLoop(name, volume = 1) {
        if (this.muted || !this.sounds[name]) return;
        this.stopAll();

        const sound = this.sounds[name];
        sound.loop = true;
        sound.volume = volume;

        console.log("Lecture en boucle du son:", name);

        const now = performance.now();

        sound
            .play()
            .then(() => console.log("Musique lancée"))
            .then(() => {
                const elapsed = performance.now() - now;
                console.log(
                    `Son "${name}" joué en boucle en ${elapsed.toFixed(2)} ms ✓`,
                );
            })
            .catch((err) => console.log("Erreur audio:", err));

        this.loops[name] = sound; // Stocke dans loops au lieu d'écraser sounds
    }

    stop(name) {
        if (!this.loops[name]) return;

        const sound = this.loops[name];
        sound.pause();
        sound.currentTime = 0;
        delete this.loops[name];
    }

    isLoopPlaying(name) {
        return this.loops[name] && !this.loops[name].paused;
    }
}
