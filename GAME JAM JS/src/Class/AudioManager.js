export class AudioManager {
    constructor() {
        this.sounds = {};
        this.muted = false;
    }

    loadSound(name, url) {
        const audio = new Audio(url);
        audio.preload = "auto";
        audio.load();
        this.sounds[name] = audio;
    }

    play(name, volume = 1) {
        if (this.muted || !this.sounds[name]) return;

        const sound = this.sounds[name].cloneNode();
        sound.volume = volume;

        sound.play().catch(err =>
            console.log("Erreur audio:", err)
        );
    }

    playLoop(name, volume = 1) {
        if (this.muted || !this.sounds[name]) return;

        const sound = this.sounds[name].cloneNode();
        sound.loop = true;
        sound.volume = volume;

        sound.play()
            .then(() => console.log("Musique lancée"))
            .catch(err => console.log("Erreur audio:", err));

        this.sounds[name] = sound;
    }


    stop(name) {
        if (!this.sounds[name]) return;

        const sound = this.sounds[name];
        sound.pause();
        sound.currentTime = 0;
    }

}