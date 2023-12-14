import React, { useState, useEffect, useRef } from 'react';
import BIRDS from 'vanta/dist/vanta.birds.min';
import * as THREE from 'three'; // Import Three.js

const Background = (props) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(BIRDS({
        el: myRef.current
      }));
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={myRef}>
      Foreground content goes here

    </div>
  );
};

export default Background;
