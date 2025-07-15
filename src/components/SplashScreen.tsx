import { useEffect } from "react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="flex fixed inset-0 z-[9999] bg-black items-center justify-center">
            <video
                src="/assets/splash.mp4"
                autoPlay
                muted
                playsInline
                onEnded={onFinish}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
