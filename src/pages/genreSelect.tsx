import { useState } from "react";
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useBackgroundMusic } from "@/services/audioContext";
import {Howl} from 'howler';

export const RADIO_GENRES = {
    "House 4evr": ["House", "Deep House", "Progressive House", "Tech House", "Future House"],
    "Bass Dropper": ["Dubstep", "Trap", "Jersey Club", "Moombahton", "Future Bass"],
    "Energy UP": ["Techno", "Hardstyle", "Trance", "Electro"],
    "Beat Breaker": ["Drum & Bass", "Jungle", "Glitch Hop"],
    "Nostalgiacore": ["Vaporwave", "Lo-Fi", "Disco House"],
    "Lyrical Legends": ["Hip-Hop/Rap", "R&B/Soul"],
    "Latin Heat": ["Latin"],
    "Island Grooves": ["Reggae", "Dancehall"],
    "Pop Iconic": ["Pop", "Hyperpop"],
    "Headbanger's Ball": ["Rock", "Metal", "Punk", "Alternative"],
    "A Strum & A Story": ["Folk", "Acoustic", "Country"],
    "Smooth Operator": ["Jazz", "Blues", "Funk"],
    "Cinematic Escape": ["Classical", "Ambient", "Soundtrack", "Downtempo"],
    "Global Sounds": ["Experimental", "Tropical House", "Devotional", "World"],
};

export default function GenreSelect() {
    const router = useRouter();
    const {username} = router.query;
    const [selectedRadio, setSelectedRadio] = useState('');
    useBackgroundMusic();
    
    // const handleGenreChange = (event) => {
    //     event.stopPropagation(); // Prevents event bubbling in case the modal is closing
    //     const newGenre = event.target.value;
    //     if (newGenre !== selectedGenre) {
    //         setSelectedGenre(newGenre);
    //         router.push(`/SpaceGame?genre=${newGenre}`);
    //     }
    // };
    const soundback = new Howl({
        src: ['/assets/ui.Odyssey.back button.wav'], 
    });

    const handleBack = () => {
        soundback.play();
        router.push(`/Tutorial?username=${username}`);
    };
    const soundNext = new Howl({
        src: ['/assets/Odyssey.press enter confirm.wav'], 
    })
    const handleSelection = (selection: string, isRadio: boolean) => {
        const genre = isRadio ? selection : `${selectedRadio}/${selection}`;
        soundNext.play();
        router.push(`/SpaceGame?genre=${genre}&username=${username as string}`);
    };
    

    // const handlePlay = () => {
    //     if (selectedGenre) {
    //         router.push(`/SpaceGame?genre=${selectedGenre}`);
    //     }
    // }


    return (
        <div className="w-screen h-screen bg-black text-white overflow-hidden relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
            <Image
                src='/assets/stars.png'
                layout="fill"
                objectFit="cover"
                alt="Space background"
            />
        </div>
        {/* Top-left Logo */}
        <div className="absolute top-4 left-4 z-20">
            <Image src="/assets/back_home_button.png" width={50} height={50} alt="Logo" onClick={handleBack} />
        </div>
        {/* Top-right Menu Button */}
        <div className="absolute top-4 right-4 z-20 cursor-pointer">
            <Image src="/assets/menu_burger_button.png" width={30} height={30} alt="Menu" />
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border-4 border-purple-500 rounded-lg overflow-hidden relative game-area cursor-pointer">
                <Image
                    src='/assets/3.genre.soundromeda.odyssey.png'
                    layout="fill"
                    objectFit="cover"
                    alt="Genre select screen"
                />
                <div className="absolute inset-0">
                    <div 
                        className="absolute top-[30.5%] left-[14%] w-[50%] h-[9%] cursor-pointer"
                        onClick={() => handleSelection("House 4evr",true)}
                    />
                    <div 
                        className="absolute top-[45.5%] left-[14%] w-[50%] h-[9%] cursor-pointer"
                        onClick={() => handleSelection("Lyrical Legends",true)}
                    />
                    <div 
                        className="absolute top-[60.4%] left-[14%] w-[50%] h-[9%] cursor-pointer"
                        onClick={() => handleSelection("Nostalgiacore",true)}
                    />
                    <div 
                        className="absolute top-[75.2%] left-[14%] w-[50%] h-[9%] cursor-pointer"
                        onClick={() => handleSelection("Headbanger's Ball",true)}
                    />
                </div>
                    
                {/* <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 p-4">
                        {Object.entries(RADIO_GENRES).map(([radio, genres]) => (
                            <div key={radio} className="relative">
                                <div
                                    onClick={() => handleSelection(radio, true)}
                                    className="w-full h-12 cursor-pointer"
                                />
                                {selectedRadio === radio && (
                                    <div className="mt-2">
                                        {genres.map((genre) => (
                                            <div
                                                key={genre}
                                                onClick={() => handleSelection(genre, false)}
                                                className="w-full h-8 cursor-pointer mb-1"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </div>
    </div>
);
};


