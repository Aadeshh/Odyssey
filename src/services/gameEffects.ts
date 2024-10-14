import {Howl} from 'howler';


const asteroidExplosionSound = new Howl({
    src: ['/assets/Odyssey.asteroid_explosion.wav'],
    loop: false,
});

const laserSound = new Howl({
    src: ['/assets/Odyssey.laser.wav'],
    volume: 1,
    loop: false,
});

const heroDeathSound = new Howl({
    src: ['/assets/Odyssey.hero_death.wav'],
    loop: false,
});

export const playAsteroidExplosion = (x:number, y:number) => {
    const sound = new Howl({
        src: ['/assets/Odyssey.asteroid_explosion.wav'],
        volume: 1,
        loop: false,
    });
    sound.play();
    // visual explosion effect at (x,y)
    
    return {
        id: Date.now(), // Add a unique id
        src:'/assets/zexplosion-d.asteroid.alt.gif',
        x,
        w:75,
        h:75,
        y,
        duration: 1000,
    }
    
}
export const playLaserEffect = (x:number, y:number) => {
    laserSound.play();
    //visual muzzle flash effect at (x,y)
    return {
        src:'/assets/flash.png',
        x,
        y,
        w: 20,
        h: 20,
        duration: 300,
    }
    
}
export const playHeroDeathEffect = (x:number, y:number) => {
    heroDeathSound.play();
    // visual explosion effect at (x,y)
    return {
        id: Date.now(), // Add a unique id
        src:'/assets/explosion-a_hero.pyramid.gif',
        x,
        y,
        w:100,
        h:100,
        duration: 500,
    }
}

// add UI effects as needed