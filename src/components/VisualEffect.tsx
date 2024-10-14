import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export interface VisualEffectProps {
    id: number;
    src: string;
    x: number;
    y: number;
    w: number;
    h: number;
    duration: number;
}

const VisualEffect: React.FC<VisualEffectProps> = ({ id,src, x, y, w, h, duration }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="absolute"
            style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
            }}
        >
            <Image src={src} alt="Visual Effect" width={100} height={100} />
        </div>
    );
};

export default VisualEffect;