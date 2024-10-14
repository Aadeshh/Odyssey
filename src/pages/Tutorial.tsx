import { useRouter } from 'next/router';
import Image from 'next/image';
import { useBackgroundMusic } from '@/services/audioContext';
import {Howl} from 'howler';

export default function Tutorial() {
    const router = useRouter();
    const { username } = router.query;
    useBackgroundMusic();
    
    const soundNext = new Howl({
        src: ['/assets/Odyssey.press enter confirm.wav'], 
    });
    const handleNext = () => {
        soundNext.play();
        router.push(`/genreSelect?username=${username}`);
    };
    const soundback = new Howl({
        src: ['/assets/ui.Odyssey.back button.wav'], 
    });

    const handleBack = () => {
        soundback.play();
        router.push(`/?username=${username}`);
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
                        src='/assets/2.tutorial.welcome.soundromeda.odyssey.png'
                        layout="fill"
                        objectFit="cover"
                        alt="Tutorial screen"
                    />
                    <div 
                        onClick={handleNext}
                        className="absolute top-[84.5%] left-[1%] w-[22%] h-[5.5%] cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}