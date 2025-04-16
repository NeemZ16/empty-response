import React, { useRef, useState } from 'react';
import Phaser from 'phaser';
import { PhaserGame } from '../phaser/PhaserGame';
import { Link } from 'react-router-dom';  // so we can route to /login if needed
import { Button } from 'react-bootstrap'

function PhaserHome({ username, setUsername }) {
  const [canMoveSprite, setCanMoveSprite] = useState(true);
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

  const handleLogout = async () => {

    const endpoint = 'http://localhost:8000/logout'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (response.ok) { //successful logout
        //refresh the page and reset state username

        setUsername('')

        //currently, once username is empty logout button wont show
        //window.location.reload();

      } else {
        console.warn('Logout failed')
      }
    } catch (err) {
      console.error('Logout error', err)
    }
  }

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
            ?( 
              <>
                <h2>Welcome, {username}!</h2>

                <Button variant="link" onClick={handleLogout}>
                  Logout Here
                </Button>
              </>
            )
            :(       
              <>
                <Link to="/login">Login Here</Link>
                <br />
                <Link to="/register">Register Here</Link>
              </>
            )
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
