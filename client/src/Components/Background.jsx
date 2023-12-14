import React, { useState, useEffect, useRef } from 'react';
import { VantaBirds } from 'vanta/dist/vanta.birds.min';
import * as THREE from 'three';

const Background = (props) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(VantaBirds({
        el: vantaRef.current,
        THREE: THREE,
        birdSize: 2,
      }));
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div className="vanta" ref={vantaRef}>
      <span>Foreground content goes here</span>
    </div>
  );
};

export default Background;
