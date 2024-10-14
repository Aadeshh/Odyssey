import Link from "next/link";
import { useState,useEffect } from "react";
import { getTrendingTracks, getTrackStreamUrl } from "./services/audius";
import Image from 'next/image';
import {useRouter} from 'next/router';
import { useBackgroundMusic } from "./services/audioContext";
import {Howl} from 'howler';

function App() {
    const [username, setUsername] = useState("");
    const router = useRouter();
    useBackgroundMusic();
    const sound = new Howl({
        src: ['/assets/Odyssey.press enter confirm.wav'],
    });
    const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        sound.play();
        router.push(`/Tutorial?username=${username}`);

    };
    return (
        <div className="w-screen h-screen bg-black text-white overflow-hidden relative cursor-default">
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
            <Image src="/assets/back_home_button.png" width={50} height={50} alt="Logo" />
        </div>
        {/* Top-right Menu Button */}
        <div className="absolute top-4 right-4 z-20 cursor-pointer">
            <Image src="/assets/menu_burger_button.png" width={30} height={30} alt="Menu"  />
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer">
            <div className="w-3/4 h-3/4 border-4 border-purple-500 rounded-lg overflow-hidden relative game-area">
                <Image
                    src='/assets/1.welcome.soundromeda.odyssey.png'
                    layout="fill"
                    objectFit="cover"
                    alt="Welcome screen"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder=""
                        className="bg-transparent absolute top-[88.8%] left-[68%] w-[14%] h-[8%] cursor-pointer text-white text-xl text-center focus:outline-none"
                    />
                    <div 
                        onClick={handleEnter}
                        className="absolute top-[56.5%] left-[63%] w-[22.5%] h-[25%] cursor-pointer"
                    />
                </div>
            </div>
        </div>
    </div>
    );

}

export default App;

