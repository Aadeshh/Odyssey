import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useBackgroundMusic } from '@/services/audioContext';
import {Howl} from 'howler';

const OutOfCoinsScreen: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  
  const soundNext = new Howl({
    src: ['/assets/Odyssey.press enter confirm.wav'], 
  });

  const handleGoToMenu = () => {
    soundNext.play();
    router.push(`/Menu?username=${username}`);
  };
  useBackgroundMusic();

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/stars.png"
          layout="fill"
          objectFit="cover"
          alt="Space background"
        />
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="relative w-3/4 h-3/4">
          <Image
            src="/assets/5.congrats.soundromeda.odyssey.png"
            layout="fill"
            objectFit="contain"
            alt="Out of Coins"
          />
        </div>
        <div 
          onClick={handleGoToMenu}
          className="bg-transparent border-none absolute top-[75.5%] left-[68.75%] w-[14.5%] h-[4%] cursor-pointer"
        >
        </div>
      </div>
    </div>
  );
};

export default OutOfCoinsScreen;