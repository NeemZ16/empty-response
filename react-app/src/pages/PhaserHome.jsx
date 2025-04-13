import React, { useRef, useState } from 'react';
import Phaser from 'phaser';
import { PhaserGame } from '../phaser/PhaserGame';
import { Link } from 'react-router-dom';  // so we can route to /login if needed


function PhaserHome({ username }) {
  const [canMoveSprite, setCanMoveSprite] = useState(true);
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

  //  Refs to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef();

  const changeScene = () => {
    const scene = phaserRef.current?.scene;
    if (scene) {
      scene.changeScene();
    }
  };

  const moveSprite = () => {
    const scene = phaserRef.current?.scene;
    if (scene && scene.scene.key === 'MainMenu') {
      scene.moveLogo(({ x, y }) => {
        setSpritePosition({ x, y });
      });
    }
  };

  const addSprite = () => {
    const scene = phaserRef.current?.scene;
    if (scene) {
      const x = Phaser.Math.Between(64, scene.scale.width - 64);
      const y = Phaser.Math.Between(64, scene.scale.height - 64);
      const star = scene.add.sprite(x, y, 'star');
      scene.add.tween({
        targets: star,
        duration: 500 + Math.random() * 1000,
        alpha: 0,
        yoyo: true,
        repeat: -1
      });
    }
  };

  // Event emitted from the PhaserGame component
  const currentScene = (scene) => {
    setCanMoveSprite(scene.scene.key !== 'MainMenu');
  };

  return (
    <div id="app">


      {/* The actual Phaser game */}
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />

      {/* sample controls */}
      <div>

        {/* 
          If the user is logged in (username != ""), show a greeting.
          Else, link them to /login. 
        */}
        <div>
          {username 
            ? <h2>Welcome, {username}!</h2>
            : <Link to="/login">Login Here</Link>
          }
        </div>

        <div>
          <button className="button" onClick={changeScene}>Change Scene</button>
        </div>
        
        <div>
          <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
        </div>
        
        <div>
          <button className="button" onClick={addSprite}>Add New Sprite</button>
        </div>
        
        <div className="spritePosition">
          <strong>Sprite Position:</strong>
          <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
        </div>
      </div>
    </div>
  );
}

export default PhaserHome;
