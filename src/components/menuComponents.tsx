import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useBackgroundMusic } from '@/services/audioContext';
import {Howl} from 'howler';

interface PageLayoutProps {
  imageSrc: string;
  altText: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ imageSrc, altText }) => {
  const router = useRouter();
  const { username } = router.query;
  useBackgroundMusic();
  const sound = new Howl({
    src: ['/assets/ui.Odyssey.back button.wav'], 
  });
  const handleBack = () => {
    sound.play();
    router.push(`/SpaceGame?username=${username}`);
  };

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
            src={imageSrc}
            layout="fill"
            objectFit="contain"
            alt={altText}
          />
        </div>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <button 
          onClick={handleBack}
          className="bg-transparent border-none cursor-pointer"
        >
          <Image 
            src="/assets/back_home_button.png" 
            width={50} 
            height={50} 
            alt="Back to Game" 
          />
        </button>
      </div>
    </div>
  );
};

export const WalletPage: React.FC = () => (
  <PageLayout 
    imageSrc="/assets/wallet.png" 
    altText="Wallet Page"
  />
  
);

export const Shop: React.FC = () => (
  <PageLayout 
    imageSrc="/assets/shop.png" 
    altText="SHop"
  />
);

export const CardsOfTheDayPage: React.FC = () => (
  <PageLayout 
    imageSrc="/assets/COD.png" 
    altText="Cards of the Day Page"
  />
);

export const LeaderboardPage: React.FC = () => (
  <PageLayout 
    imageSrc="/assets/leaderboard.png" 
    altText="Leaderboard Page"
  />
);

export const SoundromedaPage: React.FC = () => (
  <PageLayout 
    imageSrc="/assets/soundromeda.png" 
    altText="Soundromeda Page"
  />
);