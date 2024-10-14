import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'
// import Link from 'next/link';
// import ReactModal from 'react-modal';
// import GenreSelect from './genreSelect';
import { getTrendingTracks, getTrackStreamUrl } from "../services/audius";
import Image from 'next/image';
import { playAsteroidExplosion, playLaserEffect, playHeroDeathEffect } from '../services/gameEffects';
import as from '/public/assets/asteroid.png';
import stars from '/public/assets/stars.png';
import l from '/public/assets/shoot1.png';
import ship from '/public/assets/ship.png';
import VisualEffectComponent from '../components/VisualEffect';
import {RADIO_GENRES} from './genreSelect';
import { useBackgroundMusic } from '@/services/audioContext';
import { Howl } from 'howler';
import VisualEffect, { VisualEffectProps } from '../components/VisualEffect';

interface Laser {
    rotation: any;
    x: number;
    y: number;
    angle: number;
  }
  
  
//#region State Initialization
function SpaceGame() {

    // Main
    const router = useRouter()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [backgroundImage, setBackgroundImage] = useState('/assets/background1.png');
    const [backgroundIndex, setBackgroundIndex] = useState(0);
    const [visualEffects, setVisualEffects] = useState<VisualEffectProps[]>([]);
    const {username} = router.query;

    // Modals
    const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
    const toggleGenreModal = () => setIsGenreModalOpen(!isGenreModalOpen);

    // Audius and Audio
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [playingTrack, setPlayingTrack] = useState<{ id: string } | null>(null);
    const [tracks, setTracks] = useState<{ id: string }[]>([]);
    const [playedIndices, setPlayedIndicies] = useState(new Set());
    const [streamUrl, setStreamUrl] = useState<string | null>(null);
    const [paused, setPaused] = useState(true);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);
    const preloadAudioRef = useRef<HTMLAudioElement | null>(null);
    const [nextDisabled, setNextDisabled] = useState(false);
    const { genre } = router.query;

    // Game
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const [asteroids, setAsteroids] = useState<{ id: number; x: number; y: number; speed: number; }[]>([]);
    const [difficulty, setDifficulty] = useState(5);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [coinsLeft, setCoinsLeft] = useState(3);
    const [lastAsteroidSpawnTime, setLastAsteroidSpawnTime] = useState(0);
    const [lastFireTime, setLastFireTime] = useState(0);
    const [showVibes, setShowVibes] = useState(false);
    const [fadeInClass, setFadeInClass] = useState('opacity-0');
    useBackgroundMusic(false);

    // Player
    const [shipPosition, setShipPosition] = useState({ x: 50, y: 90 });
    const [shipRotation, setShipRotation] = useState(0);
    const [targetPosition, setTargetPosition] = useState({ x: 50, y: 90 });
    const [lasers, setLasers] = useState<Laser[]>([]);
    const [lives, setLives] = useState(1);

    //#endregion

    const resetGame = () => {
        setScore(0);
        setLives(1);
        setAsteroids([]);
        setLasers([]);
        setGameOver(false);
        setPaused(false);
        setDifficulty(5);
        setShipPosition({ x: 50, y: 90 }); // Reset ship position
    };
    const sound = new Howl({
        src: ['/assets/ui.Odyssey.back button.wav'], // Replace with the correct file path
    });

    const handleBack = () => {
        sound.play();
        router.push(`/genreSelect?username=${username}`);
    };

    const handleExit = () => {
        
        if (window.confirm("Are you sure you want to exit the game? You will return to the main page.")) {
            setPaused(true);
            if (audioRef.current) {
                if (audioRef.current) {
                    (audioRef.current as HTMLAudioElement).pause();
                }
            }
            // Navigate to the main page or landing page
            router.push('/'); // Adjust this URL to your main page
        }
    };


    //#region Ship Movement Control
    useEffect(() => {
        let animationFrameId: number;

        const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
            if (gameAreaRef.current) {
                const rect = (gameAreaRef.current as HTMLElement).getBoundingClientRect();
                const targetX = ((e.clientX - rect.left) / rect.width) * 100;
                const targetY = ((e.clientY - rect.top) / rect.height) * 100;

                // Ensure the ship stays within bounds
                const clampedTargetX = Math.min(Math.max(targetX, 0), 100);
                const clampedTargetY = Math.min(Math.max(targetY, 0), 100);

                // Set a new target position
                setTargetPosition({ x: clampedTargetX, y: clampedTargetY });
            }
        };

        const smoothFollow = () => {
            setShipPosition((prevPosition) => {
                const lerp = 0.05; // Adjust this value for faster or slower movement
                const newX = prevPosition.x + (targetPosition.x - prevPosition.x) * lerp;
                const newY = prevPosition.y + (targetPosition.y - prevPosition.y) * lerp;

                // Calculate the new angle to smoothly rotate the ship towards the target
                const deltaX = targetPosition.x - prevPosition.x;
                const deltaY = targetPosition.y - prevPosition.y;
                const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

                // Add an offset if your sprite is not initially pointing right
                setShipRotation(angle + 90); // Adjust this offset (e.g., +90) as needed based on your sprite's orientation
                return { x: newX, y: newY };
            });

            // Request the next frame for smooth movement
            animationFrameId = requestAnimationFrame(smoothFollow);
        };


        window.addEventListener('mousemove', handleMouseMove);
        animationFrameId = requestAnimationFrame(smoothFollow);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [shipPosition, targetPosition]);

    // New useEffect for handling mouse leave and enter
    useEffect(() => {
        const handleMouseLeave = () => {
            setPaused(true);  // Pause the game
            if (audioRef.current) {
                fadeOutAudio();  // Fade out and pause the audio
            }
        };

        const handleMouseEnter = () => {
            setPaused(false);  // Resume the game
            if (audioRef.current) {
                fadeInAudio();  // Fade in and play the audio
            }
        };

        if (gameAreaRef.current) {
            gameAreaRef.current.addEventListener('mouseleave', handleMouseLeave);
            gameAreaRef.current.addEventListener('mouseenter', handleMouseEnter);
        }

        return () => {
            if (gameAreaRef.current) {
                gameAreaRef.current.removeEventListener('mouseleave', handleMouseLeave);
                gameAreaRef.current.removeEventListener('mouseenter', handleMouseEnter);
            }
        };
    }, []);


    // Disable user right click

    useEffect(() => {
        const disableRightClick = (e: { preventDefault: () => void; }) => {
            e.preventDefault();  // Prevent right-click menu
        };

        if (gameAreaRef.current) {
            // Add event listener to disable right-click
            gameAreaRef.current.addEventListener('contextmenu', disableRightClick);
        }

        return () => {
            // Clean up the event listener when the component unmounts
            if (gameAreaRef.current) {
                gameAreaRef.current.removeEventListener('contextmenu', disableRightClick);
            }
        };
    }, [gameAreaRef]);

    //#endregion

    //#region Laser and Asteroid Movement
    // const handleKeyDown = (e) => {
    //     if (e.key === 'ArrowLeft') {
    //         setShipPosition({ x: shipPosition.x - 5, y: shipPosition.y });
    //     } else if (e.key === 'ArrowRight') {
    //         setShipPosition({ x: shipPosition.x + 5, y: shipPosition.y });
    //     } else if (e.key === 'ArrowUp') {
    //         setShipPosition({ x: shipPosition.x, y: shipPosition.y - 5 });
    //     } else if (e.key === 'ArrowDown') {
    //         setShipPosition({ x: shipPosition.x, y: shipPosition.y + 5 });
    //     }
    // };

    useEffect(() => {
        if (!paused && !gameOver) {
            const interval = setInterval(() => {
                setLasers(prevLasers =>
                    prevLasers.map(laser => ({
                        ...laser,
                        // Laser Speed
                        x: laser.x + Math.cos(laser.angle) * 7,
                        y: laser.y + Math.sin(laser.angle) * 7
                    })).filter(laser => laser.y > 0 && laser.y < 100 && laser.x > 0 && laser.x < 100) // Keep lasers within bounds
                );

                setAsteroids(prevAsteroids => {
                    return prevAsteroids.map(asteroid => {
                        const newY = asteroid.y + asteroid.speed;
                        if (newY > 100) {
                            return { ...asteroid, y: 0, x: Math.random() * 100 };
                        }
                        return { ...asteroid, y: newY };
                    });
                });
                checkCollisions();
                const currentTime = Date.now();
                const minFireRate = 200; // Set a minimum fire rate (maximum speed)
                const fireRate = Math.max(500 - difficulty * 50, minFireRate);
                if (currentTime - lastFireTime > fireRate) {
                    fireLaser();
                    setLastFireTime(currentTime);
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [paused, lasers, asteroids, difficulty, lastFireTime, lastAsteroidSpawnTime]);


    //#endregion

    //#region Laser Firing

    const fireLaser = () => {
        if (!paused) {
            const deltaX = targetPosition.x - shipPosition.x;
            const deltaY = targetPosition.y - shipPosition.y;
            const angle = Math.atan2(deltaY, deltaX); // Calculate angle towards cursor (in radians)
            const angleInDegrees = (angle * 180) / Math.PI; // Convert to degrees
            const effect = playLaserEffect(shipPosition.x, shipPosition.y);
            //addVisualEffect(effect);
            // Add the laser with direction and angle
            setLasers(prevLasers => [
                ...prevLasers,
                {
                    x: shipPosition.x,
                    y: shipPosition.y,
                    angle: angle, // Store the angle of movement (in radians)
                    rotation: angleInDegrees + 90 // Store the rotation (adjust for sprite's initial orientation)
                }
            ]);
            
        }
    };



    //#endregion

    //#region Collision Detection

    const checkCollisions = () => {
        setLasers(prevLasers => prevLasers.filter(laser => {
            const hitAsteroid = asteroids.find(asteroid => 
                Math.abs(asteroid.x - laser.x) < 5 && 
                Math.abs(asteroid.y - laser.y) < 5
            );
            if (hitAsteroid) {
                setScore(prev => prev + 10);
                setAsteroids(prevAsteroids => 
                    prevAsteroids.filter(asteroid => asteroid.id !== hitAsteroid.id)
                );
                const effect = playAsteroidExplosion(hitAsteroid.x, hitAsteroid.y);
                addVisualEffect(effect);
                return false;
            }
            return true;
        }));

        // handle ship collision
        const shipCollision = asteroids.find(asteroid =>
            Math.abs(asteroid.x - shipPosition.x) < 5 && Math.abs(asteroid.y - shipPosition.y) < 5
        );

        if (shipCollision) {
            setLives(prev => prev - 1);
            setAsteroids(prev => prev.filter(a => a.id !== shipCollision.id));
            if (lives <= 1) {
                setGameOver(true);
                setPaused(true);
            }
            const effect = playHeroDeathEffect(shipCollision.x, shipCollision.y);
            addVisualEffect(effect);
        }
    };
    const VisualEffectComponent = ({ effect }: { effect: VisualEffectProps }) => {
        return <VisualEffect {...effect} />;
    };

    const addVisualEffect = (effect: VisualEffectProps) => {
        const newEffect = { ...effect, id: Date.now() }; // Add a unique id to the effect
        setVisualEffects(prev => [...prev, newEffect]);
        setTimeout(() => {
            setVisualEffects(prev => prev.filter(e => e.id !== newEffect.id));
        }, effect.duration);
    };
    //#endregion

    //#region Audius Track Handling

    // Fetch tracks when the component mounts or when genre changes
    useEffect(() => {
        const fetchTracks = async () => {
            if (genre) {
                let genresToFetch: string[];
                type RadioGenreKey = keyof typeof RADIO_GENRES;
                genresToFetch = RADIO_GENRES[genre as RadioGenreKey];
                // if (RADIO_GENRES[genre as RadioGenreKey]) {
                //     // Fetch all genres under the radio category
                //     genresToFetch = RADIO_GENRES[genre as RadioGenreKey];
                // } else {
                //     // Fetch the specific selected genre
                //     genresToFetch = genre;
                // }
    
                try {
                    const allTracks = await Promise.all(genresToFetch.map(getTrendingTracks));
                    const shuffledTracks = shuffleTracks(allTracks.flat());
                    setTracks(shuffledTracks.map(track => ({ id: track.id })));
    
                    if (shuffledTracks.length > 0) {
                        playTrack(shuffledTracks[0], 0); // Play the first track
                    }
                } catch (error) {
                    console.error("Error fetching tracks:", error);
                    setError("Error fetching tracks");
                }
            }
        };
    
        fetchTracks();
    }, [genre]);

    function shuffleTracks(tracks: { id: string }[]) {
        for (let i = tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
        }
        return tracks;
    }

    // Set audio volume when the volume state changes
    // useEffect(() => {
    //     if (audioRef.current instanceof HTMLAudioElement) {
    //         audioRef.current.volume = volume;
    //     }
    // }, [volume]);

    // useEffect(() => {
    //     console.log(genre);
    //     playRandomTrackByGenre(genre as string);
    // }, [genre]);

    const playRandomTrackByGenre = async (selectedGenre: any) => {
        try {
            const fetchedTracks = await getTrendingTracks(selectedGenre);
            setTracks(fetchedTracks);
            if (fetchedTracks.length > 0) {
                await playTrack(fetchedTracks[0], 0);
            }
        } catch (err) {
            console.error("Error fetching tracks:", err);
        }
    };

    const playTrack = async (track: { id: string }, index: number) => {
        setPlayingTrack(track);
        setCurrentTrackIndex(index);
        const prevStreamURL = streamUrl;
        const s = await getTrackStreamUrl(track.id);
        setStreamUrl(s ?? prevStreamURL);

        // Preload the next track
        preloadNextTrack(index + 1);
    };
    
    const preloadNextTrack = async (index: number) => {
        if (index < tracks.length) {
            const nextTrack = tracks[index];
            const nextStreamURL = await getTrackStreamUrl(nextTrack.id);
            if (preloadAudioRef.current && nextStreamURL !== null) {
                preloadAudioRef.current.src = nextStreamURL;
                preloadAudioRef.current.load(); // Preload the next track
            }
        }
    };

    const playRandomTrack = async (availableTracks: string | any[]) => {
        try {
            if (playedIndices.size >= availableTracks.length) {

                setError("No more tracks to play.");// if all tracks are played
                return;
            }
            let randIdx: number;
            do {// avoid replays
                randIdx = Math.floor(Math.random() * availableTracks.length);
            } while (playedIndices.has(randIdx));

            setPlayedIndicies((prev) => new Set(prev).add(randIdx));
            const selected = availableTracks[randIdx];
            setPlayingTrack(selected);
            const streamURL = await getTrackStreamUrl(selected.id);
            setStreamUrl(streamURL);
        } catch (err) {
            console.error("Error playing track:", err);
            setError("Error playing track");
        }
    };

    const soundNext = new Howl({
        src: ['/assets/ui.Odyssey.genre confirm_next track.wav'],
    })

    function isHTMLAudioElement(obj: any): obj is HTMLAudioElement {
        return obj instanceof HTMLAudioElement;
    }

    const handleNextTrack = () => {
        if (!nextDisabled && audioRef.current && preloadAudioRef.current) {
            // Disable the button for 5 seconds
            setNextDisabled(true);
            soundNext.play();
            // Swap the preloaded audio to the main audio element
            if (isHTMLAudioElement(audioRef.current) && isHTMLAudioElement(preloadAudioRef.current)) {
                (audioRef.current as HTMLAudioElement).src = (preloadAudioRef.current as HTMLAudioElement).src;
                (audioRef.current as HTMLAudioElement).play();
            }
            
            setPaused(false);

            // Clear all asteroids when pressing NEXT

            // Randomly select a new background
            const backgrounds = [
                '/assets/background1.png', '/assets/background2.png', '/assets/background3.png',
                '/assets/background4.png', '/assets/background5.png', '/assets/background6.png',
                '/assets/background7.png', '/assets/background8.png', '/assets/background9.png'
            ];
            setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
            setBackgroundImage(backgrounds[backgroundIndex]);

            // Play the preloaded track and set it as the current track
            const nextIndex = currentTrackIndex + 1;
            if (nextIndex < tracks.length) {
                setPlayingTrack(tracks[nextIndex]);
                setCurrentTrackIndex(nextIndex);

                // Preload the following track
                preloadNextTrack(nextIndex + 1);
            }

            // Set a 5-second timer to re-enable the button
            setTimeout(() => {
                setNextDisabled(false);
            }, 5000);
        }
    };




    const fadeOutAudio = (duration = 250) => {
        if (!audioRef.current) return;
        const audio = audioRef.current as HTMLAudioElement; // Add type assertion here
        let volume = audio.volume;
        const step = volume / (duration / 50);
        const fadeOutInterval = setInterval(() => {
            if (volume > 0) {
                volume = Math.max(0, volume - step);
                audio.volume = volume;
            } else {
                clearInterval(fadeOutInterval);
                audio.pause();
            }
        }, 50); // Interval for smooth fade out
    }

    // Fade in audio over a given duration
    const fadeInAudio = (duration = 250) => {
        if (!audioRef.current) return;
        let volume = 0;
        const audio = audioRef.current as HTMLAudioElement;
        audio.volume = 0;
        audio.play();
        const step = 1 / (duration / 50);
        const fadeInInterval = setInterval(() => {
            if (volume < 1) {
                volume = Math.min(1, volume + step);
                audio.volume = volume;
            } else {
                clearInterval(fadeInInterval);
            }
        }, 50); // Interval for smooth fade in
    };

    //#endregion

    //#region Track Like, Pause, and Coins Handling

    useEffect(() => {
        if (coinsLeft === 0) {
          router.push(`/OutOfCoins?username=${username}`);
        }
      }, [coinsLeft]);
    
    const soundGenre = new Howl({src: ["/assets/Odyssey.press enter confirm.wav"]});
    const handleGenreOpen = () => {
        soundGenre.play();
        router.push(`/genreSelect?username=${username as string}`);
    }
    
    const soundVibes = new Howl({
        src: ["/assets/Odyssey.thats_a_viiibe.wav"],
    })

    const handleLike = () => {
        if (coinsLeft > 0) {
            setCoinsLeft(prev => prev - 1);
            
        }
        setFadeInClass('opacity-100'); // Set it to fade in
        setShowVibes(true);
        soundVibes.play();
        setTimeout(() => {
            setFadeInClass('opacity-0'); // Set it to fade out
            setTimeout(() => setShowVibes(false), 1000); // Remove after fade-out
        }, 2000); 
    };

    const handlePause = () => {
        setPaused(prev => !prev);
        if (audioRef.current) {
            if (paused) {
                fadeInAudio();
            } else {
                fadeOutAudio();
            }
        }
    };

    //#endregion

    //#region Asteroid Game Logic
    useEffect(() => {
        //if(!paused){
            const asteroidSpawnInterval = setInterval(() => {
                spawnAsteroid(); 
            }, 5000); 
        
            return () => clearInterval(asteroidSpawnInterval); 
        //}
    }, []);
    const spawnAsteroid = () => {
        let newAsteroidz: {
            id: number; 
            x: number; // percentage for x-axis
            y: number; // start from top as a number
            speed: number;
        }[] = [];
        // Spawn based on difficulty, set random speeds
        for (let i = 0; i < difficulty; i++) {
            newAsteroidz.push({
                id: Date.now()+i,
                x: Math.random() * 100, // percentage for x-axis
                y: 0, // start from top as a number
                speed: Math.random() * 2 + 1, // random speed, could alter based on difficulty
                
            });
        }
        setAsteroids(prev => [...prev, ...newAsteroidz]);
    };

    useEffect(() => {
        if (!paused) {
            
            const moveInterval = setInterval(() => {
                setAsteroids((prevAsteroidz) => {
                    return prevAsteroidz
                        .map((asteroid) => ({
                            ...asteroid,
                            y: asteroid.y + asteroid.speed, // Update y position numerically
                        }))
                        .filter(asteroid => asteroid.y <= 100);
                });
            }, 100);
            return () => {
                clearInterval(moveInterval);
                
            }
        }
    }, [asteroids, paused]);

    const increaseDifficulty = () => {
        spawnAsteroid();
        setDifficulty(prev => prev + 1);
    };

    //#endregion

    //#region Game Render


    return (
        <div className="w-screen h-screen bg-black text-white overflow-hidden relative font-roboto">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={stars}
                    layout="fill"
                    objectFit="cover"
                    alt="Space background"
                />
            </div>

            {/* Game Area */}
            <div className="absolute inset-0 top-10 bottom-10  z-10 flex items-center justify-center">
                <div
                    ref={gameAreaRef}
                    className="w-3/4 h-3/4 border-4 border-purple-500 rounded-lg overflow-hidden relative game-area"
                >
                    {/* Game Background */}
                    <div className="absolute inset-0">
                        <Image
                            src={backgroundImage}
                            layout="fill"
                            objectFit="cover"
                            alt="Game area background"
                        />
                    </div>

                    {/* Asteroids */}
                    {asteroids.map(asteroid => (
                        <div
                            key={asteroid.id}
                            className="absolute w-16 h-16"
                            style={{
                                left: `${asteroid.x}%`,
                                top: `${asteroid.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <Image
                                src={as}
                                layout="fill"
                                objectFit="contain"
                                alt="Asteroid"
                            />
                        </div>
                    ))}
                    {/* Visual Effects */}
                    {visualEffects.map((effect) => (
                        <VisualEffect key={effect.id} {...effect} />
                    ))}               
                    {/* Lasers */}
                    {lasers.map((laser, index) => (
                        <div
                            key={index}
                            className="absolute w-2 h-8"
                            style={{
                                left: `${laser.x}%`,
                                top: `${laser.y}%`,
                                transform: `translate(-50%, -50%) rotate(${laser.rotation}deg)`, // Apply the rotation
                            }}
                        >
                            <Image
                                src={l}
                                layout="fill"
                                objectFit="contain"
                                alt="Laser"
                            />
                        </div>
                    ))}

                    {/* Player Ship */}
                    {lives > 0 && <div
                        className="absolute w-20 h-20 "
                        style={{
                            left: `${shipPosition.x}%`,
                            top: `${shipPosition.y}%`,
                            transform: `translate(-50%, -50%) rotate(${shipRotation}deg)`, // Apply rotation
                        }}
                    >
                        <Image
                            src={ship}
                            layout="fill"
                            objectFit="contain"
                            alt="Player ship"
                        />
                    </div>}

                </div>
            </div>

            {/* <ReactModal
                isOpen={isGenreModalOpen}
                onRequestClose={toggleGenreModal}
                contentLabel="Select Genre"
                className="Modal"
                overlayClassName="Overlay"
            >
                <GenreSelect closeModal={toggleGenreModal} />
            </ReactModal> */}


            //#region UI

            {/* UI Overlay */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-opacity-70 bg-black p-2">
                <div className="flex justify-between items-center">
                    {/* Top-left Logo */}
                    <div className="flex-none left-0">
                        <Image src="/assets/back_home_button.png" width={50} height={50} alt="Logo" onClick={handleBack} />
                    </div>
                    {/* Menu */}
                    <div className="absolute top-4 right-4 z-20 cursor-pointer">
                        <Image src="/assets/menu_burger_button.png" width={30} height={30} alt="Logo" onClick={() => router.push(`/Menu?username=${username}`)} />
                    </div>
                    {/* Now Playing and Genre */}
                    <div className="mt-15"> 
                        <Image
                        src="/assets/now playing and genre buttons.png"
                        layout="fill"
                        objectFit="contain"
                        alt="Now Playing Background"
                        />
                    </div>
                    <div 
                        className="absolute text-white text-sm truncate text-center font-roboto" 
                        style={{ 
                            top: '25%', 
                            left: '36%', 
                            width: '15%', 
                            height: '100%' 
                        }}
                    >
                        {playingTrack?.id}
                    </div>

                    
                    <div 
                        className="absolute text-white text-sm truncate cursor-pointer text-center font-roboto" 
                        onClick={handleGenreOpen}
                        style={{ 
                            top: '25%', 
                            right: '25%', 
                            width: '15%', 
                            height: '100%' 
                        }}
                    >
                        {router.query.genre}
                    </div>
                </div>
            </div>

                <div className="relative flex justify-between items-center">

                {/* Control Buttons */}
                <div className="absolute bottom-4 top-20 left-0 right-0 z-20 flex justify-between items-center px-4">
                    <button onClick={handleNextTrack} className="flex-none">
                        <Image src="/assets/next button.png" width={175} height={200} alt="Next" />
                    </button>
                    <button onClick={handlePause} className="flex-none">
                        <Image 
                            src={paused ? "/assets/play button.png" : "/assets/pause button.png"}
                            width={175} 
                            height={200} 
                            alt={paused ? "Play" : "Pause"} 
                        />
                    </button>
                    <button onClick={handleLike} className="flex-none relative" disabled={coinsLeft === 0}>
                        <Image src="/assets/vibe button.png" width={175} height={200} alt="Vibe" />
                        <div className="absolute bottom-0 left-0 right-0 text-center">
                            <span className="text-green-400 text-sm">
                                {coinsLeft} {coinsLeft === 1 ? 'vibe' : 'vibes'} left
                            </span>
                        </div>
                    </button>
                </div>
            </div>
            {showVibes &&(
                <div className={`absolute z-30 transition-opacity duration-1000 ${fadeInClass}`} style={{ top: '7%', left: '84.5%', width: '40%', height: '15%' }}>
                    <Image
                        src="/assets/vibesss.png"
                        width={100}
                        height={100}
                        alt="Fade-in effect"
                    />
                </div>
            )}                
            {/* Game Over Screen */}
            {gameOver && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="text-center">
                        <h2 className="text-4xl mb-4">Game Over</h2>
                        <p className="text-2xl mb-4">Final Score: {score}</p>
                        <button
                            className="px-4 py-2 bg-purple-700 rounded text-white hover:bg-purple-600"
                            onClick={resetGame}
                        >
                            Restart
                        </button>
                    </div>
                </div>
            )}

            {/* Score Display */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-2xl z-30 items-center">
                {/* Score */}
                <div className='flex'>
                    {[...Array(lives)].map((_, index) => (
                        <div key={index}>
                            <Image
                                src="/assets/ship.png"
                                width={40}
                                height={40}
                                alt="Heart"
                            />
                        </div>
                    ))}
                </div>

                {/* Volume Slider
                <div className="flex items-right">
                    <label htmlFor="volume" className="text-xs text-white mr-2">Volume:</label>
                    <input
                        id="volume"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-32"
                    />
                </div> */}
            </div>

            <audio ref={audioRef} src={streamUrl ?? ''} autoPlay={!paused} />
            <audio ref={preloadAudioRef} style={{ display: 'none' }} /> {/* Hidden preloading audio */}


            {/* Error Display */}
            {error && <div className="absolute bottom-4 right-4 text-red-500 z-30">{error}</div>}

            {/* Exit Button */}
            <div className="absolute bottom-4 right-4 z-30">
                <Image 
                    src="/assets/Exit button.png" 
                    width={25} 
                    height={25} 
                    alt="Exit" 
                    onClick={handleExit}
                    className="cursor-pointer"
                />
            </div>
        </div>
    );
};
//#endregion

export default SpaceGame;

