import React, { useRef, useState, useEffect } from "react";
import styles from "./MusicPlayer.module.scss";
import clsx from "clsx";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const AUDIO_SRC = "public/audio/main.mp3";

export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio
        .play()
        .catch((error) => console.error("Ошибка воспроизведения:", error));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.4;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  return (
    <div className={clsx(styles.musicPlayer)}>
      <audio ref={audioRef} src={AUDIO_SRC} loop />
      <button className={clsx(styles.musicPlayerButton)}
        onClick={togglePlayPause}
        style={{
         
        }}
      >
        {isPlaying ?  <FaVolumeUp /> : <FaVolumeMute />}
      </button>
    </div>
  );
};
