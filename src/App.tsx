import "./App.css";
import { usePlexSession } from "./usePlex";
import ProgressBar from "@ramonak/react-progress-bar";

function App() {
  const status = usePlexSession();

  return (
    <div id="root">
      {/* <div id="bgimage"></div> */}
      <div id="info">
        <img id="album-art" src={status.info?.album_art}></img>
        <div id="track-info">
          <span id="track-name">{status.info?.track_name}</span>
          <ProgressBar
            width="1600px"
            height="20px"
            customLabel=" "
            bgColor="#5e63bb"
            completed={status.progress}
            maxCompleted={status.info?.total_length}
            transitionDuration="400ms"
            transitionTimingFunction="linear"
          />
          <span id="album-info">
            {status.info?.album_artist} - {status.info?.album_name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
