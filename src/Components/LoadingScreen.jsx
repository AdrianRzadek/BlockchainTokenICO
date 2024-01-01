import React, { useEffect, useCallback } from "react";
import p5 from "p5";
import "../App.css";
const LoadingScreen = ({ loadingInfo }) => {
  const flyBoxCount = 20;
  const flyBoxPause = 200;
  const sketch = useCallback((p) => {
    let origin;
    let frame = 0;
    const flyBoxes = [];
    const flyBoxColors = ["#FF6138", "#FFBE53", "#2980B9", "#282741"];
    const resizeCanvas = () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
      origin = p.createVector(window.innerWidth / 2, window.innerHeight / 2);
    };

    p.setup = () => {
      //   resizeCanvas(); // Call the resizeCanvas function
      window.addEventListener("resize", resizeCanvas); // Attach resizeCanvas to the resize event

      p.createCanvas(window.innerWidth, window.innerHeight);
      origin = p.createVector(window.innerWidth / 2, window.innerHeight / 2);
      for (let i = -flyBoxCount / 2; i < flyBoxCount / 2; i++) {
        const box = createFlyBox(i);
        box.start();
        flyBoxes.push(box);
      }
    };
    p.draw = () => {
      p.rectMode(p.CENTER);
      flyBoxes.forEach((flyBox) => flyBox.draw());
      p.stroke(0, 0, 0);
      p.strokeWeight(40);
      p.noFill();
      p.translate(origin.x, origin.y);
      p.rotate((p.sin(frame * 0.02) + p.cos(frame * 0.03)) * p.PI);
      frame += 1;
    };
    const createFlyBox = (offset) => {
      return {
        offset,
        delay: 0,
        getRandomDelay: () => p.random(0, flyBoxes.length) * 15,
        steps: 0,
        directions: [
          p.createVector(-1, -1),
          p.createVector(-1, 1),
          p.createVector(1, -1),
          p.createVector(1, 1),
        ],
        currentDirection: 0,
        iteration: 0,
        size: 80,
        start() {
          this.delay = this.getRandomDelay();
          this.steps = -this.delay;
        },
        draw() {
          this.steps += 20;
          if (this.steps < 0) return;
          p.fill(flyBoxColors[this.iteration]);
          p.noStroke();
          const dir = this.directions[this.currentDirection];
          const x =
            -dir.x * this.steps +
            origin.x +
            dir.x * origin.x -
            dir.x * this.offset * (this.size * 0.75);
          const y =
            -dir.y * this.steps +
            origin.y +
            dir.y * origin.y +
            dir.y * this.offset * (this.size * 0.75);
          const size = this.size;
          p.rect(x, y, size, size);
          const windowMax = p.max(window.innerWidth, window.innerHeight);
          if (this.steps > windowMax) {
            const newDelay = this.getRandomDelay();
            this.steps = -flyBoxPause + this.delay - newDelay;
            this.delay = newDelay;
            this.currentDirection = (this.currentDirection + 1) % 4;
            this.iteration = (this.iteration + 1) % flyBoxColors.length;
          }
        },
      };
    };
  }, []);
  useEffect(() => {
    const myP5 = new p5(sketch);
    return () => {
      // Cleanup logic, if needed
      myP5.remove();
    };
  }, [sketch]);

  // Use the loadingInfo prop here
  return <div className="LoadingScreen">{loadingInfo}</div>;
};
export default LoadingScreen;
