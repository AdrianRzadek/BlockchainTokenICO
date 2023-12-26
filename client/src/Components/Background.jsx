import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import anime from 'animejs/lib/anime.es.js';
import "../App.scss";

const Background = () => { 
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);
  const combinedCanvasRef = useRef(null);
  const ctxRef = useRef(null);

  const initCombinedAnimation = () => {
    const c = combinedCanvasRef.current;
    const ctx = c.getContext("2d");
    ctxRef.current = ctx;

    let cH;
    let cW;
    let bgColor = "#FF6138";
    let animations = [];

    function resizeCanvas() {
      cW = window.innerWidth;
      cH = window.innerHeight;
      c.width = cW * devicePixelRatio;
      c.height = cH * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    addClickListeners();

    function addClickListeners() {
      document.addEventListener("touchstart", handleEvent);
      document.addEventListener("mousedown", handleEvent);
    }
    function handleEvent(e) {
  if (!ctxRef.current) return;

  const currentColor = ctxRef.current.fillStyle;
  const nextColor = colorPicker.next();
  const targetR = calcPageFillRadius(e.pageX, e.pageY);
  const rippleSize = Math.min(200, cW * 0.4);
  const minCoverDuration = 750;

  const pageFill = new Circle({
    x: e.pageX,
    y: e.pageY,
    r: 0,
    fill: nextColor,
  });

  const fillAnimation = anime({
    targets: pageFill,
    r: targetR,
    duration: Math.max(targetR / 2, minCoverDuration),
    easing: "easeOutQuart",
    complete: function() {
      bgColor = pageFill.fill;
      removeAnimation(fillAnimation);
    },
  });

  const ripple = new Circle({
    x: e.pageX,
    y: e.pageY,
    r: 0,
    fill: currentColor,
    stroke: {
      width: 3,
      color: currentColor,
    },
    opacity: 1,
  });

  const rippleAnimation = anime({
    targets: ripple,
    r: rippleSize,
    opacity: 0,
    easing: "easeOutExpo",
    duration: 900,
    complete: removeAnimation,
  });

  const particles = [];
  for (let i = 0; i < 32; i++) {
    const particle = new Circle({
      x: e.pageX,
      y: e.pageY,
      fill: currentColor,
      r: anime.random(24, 48),
    });
    particles.push(particle);
  }

  const particlesAnimation = anime({
    targets: particles,
    x: function(particle) {
      return particle.x + anime.random(rippleSize, -rippleSize);
    },
    y: function(particle) {
      return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
    },
    r: 0,
    easing: "easeOutExpo",
    duration: anime.random(1000, 1300),
    complete: removeAnimation,
  });

  animations.push(fillAnimation, rippleAnimation, particlesAnimation);
}

    const colorPicker = (function () {
        
      var colors = ["#FF6138", "#FFBE53", "#2980B9", "#282741"];
      var index = 0;
      function next() {
        index = index++ < colors.length - 1 ? index : 0;
        return colors[index];
      }
      function current() {
        return colors[index];
      }
      return {
        next: next,
        current: current,
      };
    })();

    const extend = (a, b) => {
      for (let key in b) {
        if (b.hasOwnProperty(key)) {
          a[key] = b[key];
        }
      }
      return a;
    };

    function handleEvent(e) {
      // Check if ctx is still valid before using it
      if (!ctxRef.current) return;

      const currentColor = ctxRef.current.fillStyle;
      const nextColor = colorPicker.next();
      const targetR = calcPageFillRadius(e.pageX, e.pageY);
      const rippleSize = Math.min(200, cW * 0.4);
      const minCoverDuration = 750;



      const pageFill = new Circle({
        x: e.pageX,
        y: e.pageY,
        r: 0,
        fill: nextColor,
      });

      const fillAnimation = anime({
        targets: pageFill,
        r: targetR,
        duration: Math.max(targetR / 2, minCoverDuration),
        easing: "easeOutQuart",
        complete: function () {
          bgColor = pageFill.fill;
          removeAnimation(fillAnimation);
        },
      });

      const ripple = new Circle({
        x: e.pageX,
        y: e.pageY,
        r: 0,
        fill: currentColor,
        stroke: {
          width: 3,
          color: currentColor,
        },
        opacity: 1,
      });

      const rippleAnimation = anime({
        targets: ripple,
        r: rippleSize,
        opacity: 0,
        easing: "easeOutExpo",
        duration: 900,
        complete: removeAnimation,
      });

      const particles = [];
      for (let i = 0; i < 32; i++) {
        const particle = new Circle({
          x: e.pageX,
          y: e.pageY,
          fill: currentColor,
          r: anime.random(24, 48),
        });
        particles.push(particle);
      }

      const particlesAnimation = anime({
        targets: particles,
        x: function (particle) {
          return particle.x + anime.random(rippleSize, -rippleSize);
        },
        y: function (particle) {
          return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
        },
        r: 0,
        easing: "easeOutExpo",
        duration: anime.random(1000, 1300),
        complete: removeAnimation,
      });

      animations.push(fillAnimation, rippleAnimation, particlesAnimation);
    }

    function removeAnimation(animation) {
      const index = animations.indexOf(animation);
      if (index > -1) animations.splice(index, 1);
    }

    function calcPageFillRadius(x, y) {
      const l = Math.max(x - 0, cW - x);
      const h = Math.max(y - 0, cH - y);
      return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
    }

    const Circle = function (opts) {
      extend(this, opts);
    };

    Circle.prototype.draw = function () {
      ctxRef.current.globalAlpha = this.opacity || 1;
      ctxRef.current.beginPath();
      ctxRef.current.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      if (this.stroke) {
        ctxRef.current.strokeStyle = this.stroke.color;
        ctxRef.current.lineWidth = this.stroke.width;
        ctxRef.current.stroke();
      }
      if (this.fill) {
        ctxRef.current.fillStyle = this.fill;
        ctxRef.current.fill();
      }
      ctxRef.current.closePath();
      ctxRef.current.globalAlpha = 1;
    };

    const animate = anime({
      duration: Infinity,
      update: function () {
        ctxRef.current.fillStyle = bgColor;
        ctxRef.current.fillRect(0, 0, cW, cH);
        animations.forEach(function (anim) {
          anim.animatables.forEach(function (animatable) {
            animatable.target.draw();
          });
        });
      },
    });
  };

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: myRef.current,
          THREE: THREE,
          backgroundColor: 0x00000000,
          zIndex: 1 ,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  useEffect(() => {
    if (vantaEffect) {
      initCombinedAnimation();
    }
  }, [vantaEffect]);

  return (
    <div ref={myRef} className='Background'>
      <canvas ref={combinedCanvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}></canvas>
    </div>
  );
};

export default Background;
