import { useRouter } from 'next/router';
import Image from 'next/image';
import { useBackgroundMusic } from '@/services/audioContext';
import {Howl} from 'howler';
export default function Menu() {
    const router = useRouter();
    const { username } = router.query;
    useBackgroundMusic();

    const handleNext = (page: string) => {
        router.push(`/${page}?username=${username}`);
    };
    const sound = new Howl({
        src: ['/assets/ui.Odyssey.back button.wav'], // Replace with the correct file path
    });
    const handleBack = () => {
        sound.play();
        router.push(`/SpaceGame?username=${username}`);
    };
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
                        src='/assets/6.menu.soundromeda.odyssey.png'
                        layout="fill"
                        objectFit="cover"
                        alt="Tutorial screen"
                    />
                    <h1 className="absolute font-roboto top-[12.5%] left-[14%] w-[40%] h-[5.5%] text-left cursor-pointer">
                        {username}
                    </h1>
                    <div 
                        onClick={() => handleNext("Wallet")}
                        className="absolute top-[16%] left-[43.25%] w-[53.5%] h-[9%] cursor-pointer"
                    />
                    <div 
                        onClick={() => handleNext("Shop")}
                        className="absolute top-[32%] left-[43.25%] w-[53.5%] h-[9%] cursor-pointer"
                    />
                    <div 
                        onClick={() => handleNext("CardsOfTheDay")}
                        className="absolute top-[48%] left-[43.25%] w-[53.5%] h-[9%] cursor-pointer"
                    />
                    <div 
                        onClick={() => handleNext("Leaderboard")}
                        className="absolute top-[63%] left-[43.25%] w-[53.5%] h-[9%] cursor-pointer"
                    />
                    <div 
                        onClick={() => handleNext("Soundromeda")}
                        className="absolute top-[78%] left-[43.25%] w-[53.5%] h-[9%] cursor-pointer"
                    />
                    
                </div>
            </div>
        </div>
    );
}