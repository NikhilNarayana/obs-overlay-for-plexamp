# obs-overlay-for-plexamp
![example of the overlay, showing World's End Rhapsody by Nujabes from Modal Soul](https://github.com/user-attachments/assets/cb1f83b4-a42a-42ce-9c76-17d2d5f9606a)

this overlay shows playback status of music from a Plex Media Server. it makes some weird assumptions, is a little hacky, and not very pretty, but does that job for me. if someone wants to make it look pretty, i would be happy to merge :)

## reason for hackiness
Plex reports playback time in a reasonable way for non-realtime applications, so i took the optimistic path and update the playback progress by a reasonable amount while waiting for a proper update from Plex. this does mean that the playback bar isn't 100% smooth but it's smooth enough in my opinion

## usage
- clone repo
- create a `.env` file with the following values
  - `VITE_PLEX_TOKEN`: your Plex token, google will help you find it
  - `VITE_PLEX_URI`: your Plex uri, this is best grabbed from something like Tautulli for CORS reasons. mine looks like 192-168-100-100.\<some random id\>.plex.direct
  - `VITE_PLEX_USER`: your Plex username
- run `npm i && npm run build`
- point an OBS browser source to the `dist/index.html` file with the size 2600x700
- adjust as needed

## libraries
- [@lukehagar/plexjs](https://github.com/LukeHagar/plexjs)
- [@ramonak/react-progress-bar](https://github.com/KaterinaLupacheva/react-progress-bar)
