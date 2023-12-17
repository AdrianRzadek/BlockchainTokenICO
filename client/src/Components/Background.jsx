import React, { useEffect, useRef, useState } from 'react'
import p5 from 'p5'
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.net.min'
import "../App.scss";
const Background = (props) => {

    const [vantaEffect, setVantaEffect] = useState(null)
    const myRef = useRef(null)
    useEffect(() => {
      if (!vantaEffect) {
        setVantaEffect(WAVES({
          el: myRef.current,
          THREE: THREE,
          p5:p5,
         
          color: 0xff0000,
          backgroundColor: 0x0,
        }))
      }
      return () => {
        if (vantaEffect) vantaEffect.destroy()
      }
    }, [vantaEffect])
    return <div ref={myRef} className='Background'>
      
    </div>
  }
export default Background;