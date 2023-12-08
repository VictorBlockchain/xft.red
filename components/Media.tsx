import React, { useState } from 'react';
import ReactPlayer from 'react-player';

function MediaComponent({ url, type }: any) {
  const [showControls, setShowControls] = useState(type === 'video');

  const handleReady = () => {
    if (type === 'audio') {
      setShowControls(true);
    }
  };
  const playerConfig = {
    file: {
      attributes: {
        controlsList: 'nodownload',
      },
    },
  };
  return (
    <div className="player-wrapper">
      <ReactPlayer
        className="react-player"
        url={url}
        width="100%"
        height="100%"
        controls={showControls}
        onReady={handleReady}
        config={playerConfig}
      />
    </div>
  );
}

export default MediaComponent;
