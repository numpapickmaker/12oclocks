// This is the pixelated clock with colourized history
var clock04 = function(sketch) {
  let clock = [];
  let baseWidth = 400;

  let numTimes = 25;
  let timesStored = 0;

  let charWidthBase = 5;
  let charHeightBase = 5;
  let skewBase = 1.5;

  for (let i = 0; i < numTimes; i++) {
    clock.push(null);
  }

  sketch.setup = function() {
    sketch.frameRate(1);
  }

  sketch.draw = function() {

    sketch.background(0);

    let scale = sketch.width / baseWidth;
    let frameCount = sketch.frameCount;

    let charWidth = charWidthBase * scale;
    let charHeight = charHeightBase * scale;
    let skew = skewBase * scale;


    sketch.colorMode(sketch.HSB);

    // Use frame count to determine index, so it can be used as a circular array
    let idx = frameCount % clock.length;
    clock[idx] = getTime();

    // Take the previous clock's hue and increment it
    // If this is the first clock, pick a random hue
    let prevIdx = (frameCount - 1) % numTimes;
    if (clock[prevIdx]) {
      let hue = clock[prevIdx].hue;
      hue = (hue + 5) % 360;
      clock[idx].hue = hue;
    } else {
      clock[idx].hue = sketch.floor(sketch.random(0, 360));
    }


    // Translate so the clock ends up in the right spot
    let translateX = (sketch.width/2 - 25.5 * charWidth) + 2 * timesStored * charWidth;
    let translateY = (sketch.height/2 - 7 * charHeight) - 2 * timesStored * charHeight;
    sketch.translate(translateX, translateY);
    for (let i = frameCount+1; i <= frameCount + clock.length; i++) {
      let j = i % clock.length;
      if (clock[j]) {
        let last = (i == frameCount + clock.length);
        drawClock(clock[j], charWidth, charHeight, skew, last);
        sketch.translate(-2 * charWidth, 2 * charHeight);
      }
    }
  }

  function drawClock(t, charWidth, charHeight, skew, last) {
    sketch.push()
    let timeString = t.h + ":" + pad(t.m) + ":" + pad(t.s);

    // If hour is a single digit;
    // translate by 1 char before starting
    if (t.h < 10) {
      sketch.translate(6 * charWidth, 6 * skew);
    }

    if (last) {
      sketch.stroke(0, 0, 100);
    } else {
      sketch.stroke(t.hue, 100, 100);
    }
    sketch.strokeWeight(1.25);
    sketch.noFill();
    for(let i = 0; i < timeString.length; i++) {
      drawCharacter(timeString[i], charWidth, charHeight, skew);
      sketch.translate(6 * charWidth, 5.5 * skew);
    }
    sketch.pop();
  }

  function drawCharacter(c, charWidth, charHeight, skew) {
    let cMatrix = font[c];
    let x = 0;
    let y = 0;
    for (let r = 0; r < cMatrix.length; r++) {
      let row = cMatrix[r];
      let firstY = y;
      for (let col = 0; col < row.length; col++) {
        if (row[col] == 1) {
          sketch.beginShape();
            sketch.vertex(x, y);
            sketch.vertex(x + charWidth, y + skew);
            sketch.vertex(x + charWidth, y + charHeight + skew);
            sketch.vertex(x, y + charHeight);
          sketch.endShape(sketch.CLOSE);
        }
        x += charWidth;
        y += skew;
      }
      y = firstY + charHeight;
      x = 0;
    }
  }

  function pad(num) {
    let n = num.toString();
    if (n.length == 2) {
      return n;
    } else {
      return "0"+n;
    }
  }

  function getTime() {
    let rightNow = {
      h: sketch.hour() % 12 === 0 ? 12 : sketch.hour() % 12,
      m: sketch.minute(),
      s: sketch.second(),
    };
    timesStored++;
    timesStored = sketch.min(timesStored, numTimes);
    return rightNow;
  }
}
