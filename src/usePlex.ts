import { PlexAPI } from "@lukehagar/plexjs";
import { useEffect, useState } from "react";

const plexAPI = new PlexAPI({
  ip: import.meta.env.VITE_PLEX_URI,
  accessToken: import.meta.env.VITE_PLEX_TOKEN,
});

type TrackInfo = {
  album_name: string | undefined;
  album_artist: string | undefined;
  track_name: string | undefined;
  album_art: string | undefined;
  total_length: number | undefined;
  progress: number | undefined;
};

export function usePlexSession() {
  const [progress, setProgress] = useState(0);
  const [info, setInfo] = useState<TrackInfo | undefined>();
  useEffect(() => {
    const username = import.meta.env.VITE_PLEX_USER;
    const fetchSessions = async function () {
      const resp = await plexAPI.sessions.getSessions();
      const sessions = resp.object?.mediaContainer?.metadata ?? [];
      for (const session of sessions) {
        // ignore other users and non-music playback
        if (session?.user?.title !== username || session?.type !== "track") {
          console.log("failed to find valid session");
          continue;
        }

        // because of this the initial UI state can be empty until the user hits play
        if (session.player?.state !== "playing") {
          continue;
        }

        const album_name = session.parentTitle;
        const album_artist = session.grandparentTitle;
        const track_name = session.title;
        let album_art = info?.album_art;

        if (album_name !== info?.album_name) {
          const src = `https://${import.meta.env.VITE_PLEX_URI}:32400${
            session.thumb
          }`;
          const options = {
            headers: {
              "X-Plex-Token": import.meta.env.VITE_PLEX_TOKEN,
              "Access-Control-Allow-Origin": "*", // CORS is a bit of mystery to me lol
            },
            method: "GET",
          };
          const resp = await fetch(src, options);
          const blob = await resp.blob();
          album_art = URL.createObjectURL(blob);

          // i had the idea of blurring the cover and using it as a background
          // but it didn't work as well as i hoped so i nixed it
          // const info = document.getElementById("bgimage");
          // if (info) {
          //     console.log("found info");
          //     info.style.backgroundImage = `url(${album_art})`;
          // }
        }

        const curr_progress = session.viewOffset ?? 0;
        const total_length = session.duration ?? 1;
        const track_info: TrackInfo = {
          album_name,
          album_artist,
          track_name,
          album_art,
          total_length,
          progress: curr_progress,
        };

        // viewOffset hasn't been updated so let's assume the interval time has passed
        if (curr_progress === info?.progress) {
          setProgress(progress + 500);
        } else {
          // jump to whatever the last client reported time is
          setProgress(curr_progress);
        }

        setInfo(track_info);
      }
    };
    const interval = setInterval(fetchSessions, 500);
    return () => clearInterval(interval);
  });

  return { progress, info };
}
