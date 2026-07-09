'use client';

import type p5 from 'p5';
import { useEffect, useRef } from 'react';

// p5 is loaded from a self-hosted script (public/vendor/p5.min.js) instead of
// a bundler import: turbopack's dev-mode code splitting hangs forever on p5's
// UMD bundle, so `import('p5')` never resolves under `next dev --turbopack`.
let p5Loader: Promise<typeof p5> | null = null;

function loadP5(): Promise<typeof p5> {
  const w = window as unknown as { p5?: typeof p5 };
  if (w.p5) return Promise.resolve(w.p5);
  if (!p5Loader) {
    p5Loader = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/vendor/p5.min.js';
      script.async = true;
      script.onload = () =>
        w.p5
          ? resolve(w.p5)
          : reject(new Error('p5 script loaded but window.p5 is missing'));
      script.onerror = () => {
        p5Loader = null;
        reject(new Error('failed to load /vendor/p5.min.js'));
      };
      document.head.appendChild(script);
    });
  }
  return p5Loader;
}

/**
 * ASCII peony animation (ported from Hamza's peonia p5.js sketch).
 * Renders a blooming/wilting 3D peony as ASCII, dots, or pixels with
 * occasional glitch effects, on a transparent canvas sized to its container.
 */
export default function PeoniaAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let instance: p5 | undefined;
    let observer: ResizeObserver | undefined;
    let themeObserver: MutationObserver | undefined;
    let cancelled = false;

    loadP5()
      .then((P5) => {
        if (cancelled || !containerRef.current) return;

        let isLight = !document.documentElement.classList.contains('dark');
        themeObserver = new MutationObserver(() => {
          isLight = !document.documentElement.classList.contains('dark');
        });
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        });

        const sketch = (p: p5) => {
          const BUF_W = 680,
            BUF_H = 680;
          let buf: p5.Graphics;
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'.split('');
          let ctx: CanvasRenderingContext2D;

          interface Flower {
            c1: number[];
            c2: number[];
            c3: number[];
            stemC: number[];
            layers: number;
            petalsPerLayer: number;
            maxRadius: number;
            ruffleAmt: number;
            sepals: number;
          }

          interface Slice {
            y: number;
            h: number;
            fx: number;
            fw: number;
            offset: number;
            colorShift: boolean;
            duration: number;
          }

          interface Item {
            rz: number;
            tp: 'p' | 's' | 'c';
            sx: number;
            sy: number;
            sa: number;
            alpha?: number;
            sLen?: number;
            sW?: number;
            sAlpha?: number;
            sc?: number[];
            pl?: number;
            pw?: number;
            rPhase?: number;
            rAmt?: number;
            r?: number;
            gr?: number;
            b?: number;
            cup?: number;
          }

          let elements: Flower[] = [];
          let curEl = 0;

          let phase = 'growing';
          let phaseT = 0;

          let bloom = 0;
          const bloomTarget = 1;

          let renderMode = 0,
            prevMode = 0,
            modeT = 1;

          let grid = 4,
            gridTarget = 4;
          const GRID_MIN = 4,
            GRID_MAX = 20;
          let densDir = 1,
            densTimer = 0;

          let mInfX = 0,
            mInfY = 0;
          let t = 0;

          let rotX = 0,
            rotY = 0,
            rotZ = 0;
          let autoRotX = 0,
            autoRotY = 0,
            autoRotZ = 0;
          let mouseRotX = 0,
            mouseRotY = 0;
          let targetMouseRotX = 0,
            targetMouseRotY = 0;
          let rotEaseIn = 0;

          let glitchTimer = 0;
          let glitchActive = false;
          let glitchIntensity = 0;
          let glitchSlices: Slice[] = [];

          let wilt = 0;

          const easeInOutCubic = (x: number) =>
            x < 0.5 ? 4 * x * x * x : 1 - p.pow(-2 * x + 2, 3) / 2;
          const easeOutQuart = (x: number) => 1 - p.pow(1 - x, 4);

          p.setup = function () {
            p.createCanvas(node.offsetWidth, node.offsetHeight);
            p.pixelDensity(1);
            p.textFont('Courier New, monospace');
            p.textAlign(p.CENTER, p.CENTER);
            p.noStroke();

            buf = p.createGraphics(BUF_W, BUF_H);
            buf.pixelDensity(1);
            buf.noSmooth();
            (buf as unknown as { canvas: HTMLCanvasElement }).canvas.getContext(
              '2d',
              { willReadFrequently: true },
            );

            ctx = p.drawingContext as CanvasRenderingContext2D;

            elements = [
              // prettier-ignore
              { c1: [230, 130, 170], c2: [255, 210, 235], c3: [170, 60, 100], stemC: [55, 85, 40], layers: 14, petalsPerLayer: 9, maxRadius: 155, ruffleAmt: 12, sepals: 5 },
              // prettier-ignore
              { c1: [240, 170, 190], c2: [255, 230, 240], c3: [190, 90, 130], stemC: [55, 88, 42], layers: 15, petalsPerLayer: 10, maxRadius: 150, ruffleAmt: 14, sepals: 6 },
              // prettier-ignore
              { c1: [200, 100, 180], c2: [245, 185, 225], c3: [150, 45, 110], stemC: [50, 80, 38], layers: 13, petalsPerLayer: 9, maxRadius: 158, ruffleAmt: 13, sepals: 5 },
            ];

            startElement(0);
          };

          function startElement(idx: number) {
            curEl = idx;
            bloom = 0;
            wilt = 0;
            phase = 'growing';
            phaseT = 0;
            grid = GRID_MIN;
            gridTarget = GRID_MIN;
            densDir = 1;
            densTimer = 0;
            modeT = 1;
          }

          p.draw = function () {
            const dt = p.deltaTime / 1000;
            const f = elements[curEl];

            p.clear();
            t += 0.016;

            rotEaseIn = p.min(1, rotEaseIn + dt * 0.08);
            const re = easeInOutCubic(rotEaseIn);

            autoRotY += dt * 0.3 * re;
            autoRotX += dt * 0.12 * p.sin(t * 0.15) * re;
            autoRotZ += dt * 0.08 * p.sin(t * 0.09 + 1.5) * re;

            // Track the mouse across the whole window, not just the canvas
            targetMouseRotX =
              ((p.winMouseY - p.windowHeight / 2) / p.windowHeight) * 1.2;
            targetMouseRotY =
              ((p.winMouseX - p.windowWidth / 2) / p.windowWidth) * 1.8;
            mouseRotX += (targetMouseRotX - mouseRotX) * 0.04;
            mouseRotY += (targetMouseRotY - mouseRotY) * 0.04;

            rotX = autoRotX + mouseRotX * re;
            rotY = autoRotY + mouseRotY * re;
            rotZ = autoRotZ;

            if (phase === 'growing') {
              bloom += (bloomTarget - bloom) * 0.006;
              phaseT += dt;
              if (bloom > 0.98) {
                bloom = 1;
                phase = 'interactive';
                phaseT = 0;
              }
            }

            densTimer += dt;
            if (densTimer > 0.8) {
              densTimer = 0;
              triggerGlitch();
              prevMode = renderMode;
              renderMode = (renderMode + 1) % 3;
              modeT = 0;
              if (densDir === 1) {
                gridTarget = GRID_MAX;
                densDir = -1;
              } else {
                gridTarget = GRID_MIN;
                densDir = 1;
              }
            }

            if (phase === 'interactive') {
              phaseT += dt;
              if (phaseT > 25) {
                phase = 'wilting';
                phaseT = 0;
                triggerGlitch();
              }
            }

            if (phase === 'wilting') {
              wilt = p.min(1, wilt + dt * 0.04);
              phaseT += dt;
              if (wilt > 0.95) {
                phase = 'waiting';
                phaseT = 0;
              }
            }

            if (phase === 'waiting') {
              phaseT += dt;
              if (phaseT > 0.6) {
                prevMode = renderMode;
                renderMode = (renderMode + 1) % 3;
                modeT = 0;
                triggerGlitch();
                startElement((curEl + 1) % elements.length);
              }
            }

            grid += (gridTarget - grid) * 0.08;
            modeT = p.min(1, modeT + dt * 4.0);

            updateGlitch(dt);

            if (phase === 'interactive') {
              mInfX +=
                ((p.winMouseX - p.windowWidth / 2) * 0.02 - mInfX) * 0.04;
              mInfY +=
                ((p.winMouseY - p.windowHeight / 2) * 0.02 - mInfY) * 0.04;
            } else {
              mInfX *= 0.95;
              mInfY *= 0.95;
            }

            drawFlowerToBuffer(f, bloom, wilt);

            glitchTimer -= dt;
            if (glitchTimer <= 0 && !glitchActive) {
              glitchTimer = p.random(3, 7);
              if (p.random() < 0.4) triggerGlitch();
            }

            renderToScreen();
            drawGlitchOverlay();
          };

          function triggerGlitch() {
            glitchActive = true;
            glitchIntensity = p.random(0.4, 1.0);
            glitchSlices = [];
            const scaleF = p.min(p.width / BUF_W, p.height / BUF_H) * 0.85;
            const rW = BUF_W * scaleF,
              rH = BUF_H * scaleF;
            const fOx = (p.width - rW) / 2 + mInfX;
            const fOy = (p.height - rH) / 2 + mInfY;
            const numSlices = p.floor(p.random(3, 10));
            for (let i = 0; i < numSlices; i++) {
              const sy = p.random(fOy, fOy + rH);
              const sh = p.min(p.random(2, rH * 0.08), fOy + rH - sy);
              glitchSlices.push({
                y: sy,
                h: sh,
                fx: fOx,
                fw: rW,
                offset: p.random(-80, 80) * glitchIntensity,
                colorShift: p.random() < 0.4,
                duration: p.random(0.08, 0.3),
              });
            }
          }

          function updateGlitch(dt: number) {
            if (!glitchActive) return;
            let allDone = true;
            for (const s of glitchSlices) {
              s.duration -= dt;
              if (s.duration > 0) allDone = false;
              else s.offset *= 0.7;
            }
            if (allDone) {
              glitchActive = false;
              glitchSlices = [];
            }
          }

          function drawGlitchOverlay() {
            if (!glitchActive || !glitchSlices.length) return;
            for (const s of glitchSlices) {
              if (p.abs(s.offset) < 0.5) continue;
              const sx = p.floor(s.fx),
                sy = p.floor(s.y),
                sw = p.floor(s.fw),
                sh = p.floor(s.h);
              if (sw < 1 || sh < 1) continue;
              if (s.colorShift) {
                ctx.save();
                ctx.globalAlpha = 0.7;
                ctx.globalCompositeOperation = 'lighter';
                // prettier-ignore
                ctx.drawImage(ctx.canvas, sx, sy, sw, sh, sx + s.offset * 1.5, sy, sw, sh);
                ctx.globalAlpha = 0.45;
                ctx.drawImage(
                  ctx.canvas,
                  sx,
                  sy,
                  sw,
                  sh,
                  sx - s.offset,
                  sy,
                  sw,
                  sh,
                );
                ctx.restore();
              } else {
                ctx.drawImage(
                  ctx.canvas,
                  sx,
                  sy,
                  sw,
                  sh,
                  sx + s.offset,
                  sy,
                  sw,
                  sh,
                );
              }
            }
          }

          function drawFlowerToBuffer(f: Flower, bl: number, wl: number) {
            buf.background(0);
            buf.noStroke();
            wl = wl || 0;
            const stemProgress = p.constrain(bl * 3, 0, 1);
            const flowerBloom = p.constrain((bl - 0.15) / 0.85, 0, 1);
            const wiltDroop = wl * 55;
            const flowerCX = BUF_W / 2;
            const flowerCY = BUF_H * 0.38 + wiltDroop;
            drawStem(buf, f, stemProgress, wl, flowerCX, flowerCY);
            drawPeony3D(buf, f, flowerBloom, wl, flowerCX, flowerCY);
            buf.loadPixels();
          }

          function drawStem(
            g: p5.Graphics,
            f: Flower,
            progress: number,
            wl: number,
            cx: number,
            cy: number,
          ) {
            wl = wl || 0;
            const stemLen = BUF_H * 0.42;
            const stemX = BUF_W / 2;
            const stemTop = cy;
            const stemBot = stemTop + stemLen;
            const visibleLen = stemLen * easeOutQuart(progress);
            const visibleTop = stemBot - visibleLen;
            for (let y = visibleTop; y < stemBot; y += 3) {
              const tt = (y - stemTop) / stemLen;
              const sw = p.lerp(15, 8, tt);
              const wiltBend = wl * 45 * (1 - tt) * p.sin((1 - tt) * p.PI);
              const curveX =
                p.sin(tt * p.PI * 0.3) * 22 +
                p.sin(tt * p.PI * 0.8) * 8 +
                wiltBend;
              let r = p.lerp(f.stemC[0], f.stemC[0] * 0.5, tt);
              let gc = p.lerp(f.stemC[1], f.stemC[1] * 0.5, tt);
              let b = p.lerp(f.stemC[2], f.stemC[2] * 0.5, tt);
              if (wl > 0) {
                r = p.lerp(r, r * 0.4 + 30, wl * 0.5);
                gc = p.lerp(gc, gc * 0.3 + 15, wl * 0.5);
                b = p.lerp(b, b * 0.25 + 8, wl * 0.5);
              }
              g.fill(r, gc, b);
              g.ellipse(stemX + curveX, y, sw, 5);
              g.fill(r * 1.4, gc * 1.4, b * 1.3, 50);
              g.ellipse(stemX + curveX - 2, y, sw * 0.2, 3);
            }
            if (progress > 0.3) {
              const leafP = p.constrain((progress - 0.3) / 0.4, 0, 1);
              const ly = stemTop + stemLen * 0.22;
              const lx = stemX + p.sin(0.22 * p.PI * 0.3) * 22;
              drawLeaf(g, lx, ly, -1, 48 * leafP, f.stemC);
            }
            if (progress > 0.5) {
              const leafP = p.constrain((progress - 0.5) / 0.4, 0, 1);
              const ly = stemTop + stemLen * 0.5;
              const lx = stemX + p.sin(0.5 * p.PI * 0.3) * 22;
              drawLeaf(g, lx, ly, 1, 42 * leafP, f.stemC);
            }
            if (progress > 0.7) {
              const leafP = p.constrain((progress - 0.7) / 0.3, 0, 1);
              const ly = stemTop + stemLen * 0.35;
              const lx = stemX + p.sin(0.35 * p.PI * 0.3) * 22;
              drawLeaf(g, lx, ly, -1, 35 * leafP, f.stemC);
            }
          }

          function drawLeaf(
            g: p5.Graphics,
            x: number,
            y: number,
            side: number,
            sz: number,
            sc: number[],
          ) {
            if (sz < 2) return;
            g.push();
            g.translate(x, y);
            g.rotate(side * 0.65);
            g.fill(sc[0] * 0.85, sc[1] * 1.15, sc[2] * 0.75);
            g.beginShape();
            g.vertex(0, 0);
            // prettier-ignore
            g.bezierVertex(sz * 0.35 * side, -sz * 0.38, sz * 0.85 * side, -sz * 0.22, sz * 1.35 * side, 0);
            // prettier-ignore
            g.bezierVertex(sz * 0.85 * side, sz * 0.22, sz * 0.35 * side, sz * 0.38, 0, 0);
            g.endShape(p.CLOSE);
            g.fill(sc[0] * 1.1, sc[1] * 1.4, sc[2] * 1.0, 60);
            g.beginShape();
            g.vertex(sz * 0.1 * side, 0);
            // prettier-ignore
            g.bezierVertex(sz * 0.4 * side, -sz * 0.15, sz * 0.7 * side, -sz * 0.08, sz * 1.0 * side, 0);
            // prettier-ignore
            g.bezierVertex(sz * 0.7 * side, sz * 0.08, sz * 0.4 * side, sz * 0.15, sz * 0.1 * side, 0);
            g.endShape(p.CLOSE);
            g.stroke(sc[0] * 1.3, sc[1] * 1.5, sc[2] * 1.2, 70);
            g.strokeWeight(0.8);
            g.line(0, 0, sz * 1.15 * side, 0);
            for (let i = 1; i <= 3; i++) {
              const vx = sz * 0.3 * i * side;
              g.line(vx, 0, vx + sz * 0.2 * side, -sz * 0.12);
              g.line(vx, 0, vx + sz * 0.2 * side, sz * 0.12);
            }
            g.noStroke();
            g.pop();
          }

          function rot3D(x: number, y: number, z: number) {
            const cY = p.cos(rotY),
              sY = p.sin(rotY);
            const rx = x * cY + z * sY;
            const rz = -x * sY + z * cY;
            const cX = p.cos(rotX),
              sX = p.sin(rotX);
            const ry = y * cX - rz * sX;
            const rz2 = y * sX + rz * cX;
            const cZ = p.cos(rotZ),
              sZ = p.sin(rotZ);
            const fx = rx * cZ - ry * sZ;
            const fy = rx * sZ + ry * cZ;
            return [fx, fy, rz2];
          }

          function drawPeony3D(
            g: p5.Graphics,
            f: Flower,
            bl: number,
            wl: number,
            cx: number,
            cy: number,
          ) {
            wl = wl || 0;
            const focal = 420;
            const wiltTilt = wl * 0.18;
            const cosW = p.cos(wiltTilt),
              sinW = p.sin(wiltTilt);
            const items: Item[] = [];

            if (f.sepals && bl < 0.7) {
              const numS = f.sepals;
              const openAng = easeInOutCubic(bl) * p.HALF_PI * 0.9;
              let sepalAlpha = p.map(p.constrain(bl, 0, 0.7), 0, 0.7, 255, 0);
              if (wl) sepalAlpha *= 1 - wl;
              if (sepalAlpha > 5) {
                for (let i = 0; i < numS; i++) {
                  const a = (p.TWO_PI / numS) * i;
                  const sTilt = p.HALF_PI * 0.35 - openAng;
                  const dist = 50;
                  const ct = p.cos(sTilt),
                    st = p.sin(sTilt);
                  const x3 = p.cos(a) * dist * ct,
                    z3 = p.sin(a) * dist * ct,
                    y3 = -st * dist;
                  const [rx, ry, rz] = rot3D(x3, y3, z3);
                  const ps = focal / (focal + rz);
                  const sepAng = p.atan2(ry, rx);
                  const fv = p.max(focal / (focal + p.abs(rz)), 0.15);
                  items.push({
                    rz,
                    tp: 's',
                    sx: rx * ps,
                    sy: ry * ps,
                    sa: sepAng,
                    sLen: 80 * ps,
                    sW: 25 * ps * fv,
                    sAlpha: sepalAlpha,
                    sc: f.stemC,
                  });
                }
              }
            }

            const cAlpha = p.constrain((bl - 0.45) / 0.3, 0, 1) * (1 - wl);
            if (cAlpha > 0)
              items.push({
                rz: 0,
                tp: 'c',
                sx: 0,
                sy: 0,
                sa: 0,
                alpha: cAlpha,
              });

            for (let layer = f.layers; layer >= 0; layer--) {
              const lr = layer / f.layers;
              const layerDelay = (1 - lr) * 0.35;
              const layerBl = p.constrain(
                (bl - layerDelay) / (1 - layerDelay),
                0,
                1,
              );
              const ebl = easeInOutCubic(layerBl);
              if (ebl < 0.01) continue;
              const layerFall = p.constrain(
                (wl * 1.4 - (1 - lr) * 0.4) / 0.6,
                0,
                1,
              );
              if (layerFall > 0.9) continue;
              const innerBoost = 1 - lr;
              const np =
                f.petalsPerLayer +
                p.floor(layer * 1.5) +
                p.floor(innerBoost * 5);
              const baseR = p.lerp(10, f.maxRadius, lr);
              let tiltAngle =
                p.lerp(p.PI * 0.42, p.PI * 0.04, ebl) + layerFall * p.PI * 0.22;
              tiltAngle -= innerBoost * 0.15 * ebl;
              const cosTilt = p.cos(tiltAngle),
                sinTilt = p.sin(tiltAngle);

              for (let i = 0; i < np; i++) {
                const petalHash = ((i * 73 + layer * 137) & 0xff) / 255;
                if (wl > 0.1 && petalHash < (wl - 0.1) * 1.3) continue;
                let angle =
                  (p.TWO_PI / np) * i +
                  layer * 0.42 +
                  p.sin(layer * 2.1) * 0.12;
                angle += petalHash * 0.15;
                const droopAmt = layerFall * 0.5 * (0.4 + lr * 0.6);
                const shrink = 1 - layerFall * 0.35;
                const dist = baseR * ebl * (0.35 + lr * 0.25);
                const z3 = p.sin(angle) * dist * cosTilt;
                let x3 = p.cos(angle) * dist * cosTilt,
                  y3 = -sinTilt * dist + droopAmt * 28;
                if (wiltTilt > 0.001) {
                  const ny = y3 * cosW - x3 * sinW * 0.3;
                  x3 = x3 + y3 * sinW * 0.3;
                  y3 = ny;
                }
                const [rx, ry, rz] = rot3D(x3, y3, z3);
                const ps = focal / (focal + rz);
                const sx = rx * ps,
                  sy = ry * ps;
                const viewAngle = p.atan2(ry, rx);
                const depthFactor = focal / (focal + p.abs(rz));
                const faceVis = p.max(depthFactor, 0.12);
                const nx3 = p.cos(angle) * cosTilt,
                  ny3 = -sinTilt,
                  nz3 = p.sin(angle) * cosTilt;
                const [, , lnz] = rot3D(nx3, ny3, nz3);
                const lightDot = p.constrain(-lnz, -1, 1);
                const lightMod = p.map(lightDot, -1, 1, 0.32, 1.25);
                const cupFactor = (1 - lr) * (1 - ebl * 0.5) * 0.35;
                const pl =
                  baseR *
                  (0.2 + 0.8 * ebl) *
                  (1.15 + innerBoost * 0.3) *
                  shrink *
                  ps;
                let pw =
                  baseR * (0.15 + 0.85 * ebl) * 0.55 * shrink * ps * faceVis;
                pw *= 1 + cupFactor;
                const rPhase = i * 1.7 + layer * 0.9;
                const rAmt =
                  f.ruffleAmt *
                  ebl *
                  (1 + layerFall * 2 + innerBoost * 0.5) *
                  ps;
                const lA = p.sin(angle + layer * 0.5);
                const dM = p.map(layer, 0, f.layers, 0.35, 1.0);
                const bB = 0.4 + 0.6 * ebl;
                const cm = p.map(lA, -1, 1, 0.45, 1.2) * dM * bB * lightMod;
                let r = p.constrain(p.lerp(f.c1[0], f.c2[0], lr) * cm, 0, 255);
                let gr = p.constrain(p.lerp(f.c1[1], f.c2[1], lr) * cm, 0, 255);
                let b = p.constrain(p.lerp(f.c1[2], f.c2[2], lr) * cm, 0, 255);
                if (wl > 0) {
                  const wf = p.min(1, layerFall * 1.3);
                  r = p.lerp(r, r * 0.5 + 55, wf);
                  gr = p.lerp(gr, gr * 0.28 + 22, wf);
                  b = p.lerp(b, b * 0.12 + 6, wf);
                }
                // prettier-ignore
                items.push({ rz, tp: 'p', sx, sy, sa: viewAngle, pl, pw, rPhase, rAmt, r, gr, b, cup: cupFactor });
              }
            }

            items.sort((a, b) => a.rz - b.rz);

            for (const it of items) {
              if (it.tp === 'c') {
                g.push();
                g.translate(cx, cy);
                const [cnx, cny, cnz] = rot3D(0, -1, 0);
                const cps = focal / (focal + cnz * 15);
                const csx = cnx * 15 * cps,
                  csy = cny * 15 * cps;
                for (let r = 28; r > 0; r -= 3) {
                  const ratio = r / 28;
                  g.fill(
                    p.lerp(f.c3[0] * 0.1, f.c3[0] * 0.7, ratio) *
                      (it.alpha || 1),
                    p.lerp(f.c3[1] * 0.1, f.c3[1] * 0.7, ratio) *
                      (it.alpha || 1),
                    p.lerp(f.c3[2] * 0.1, f.c3[2] * 0.7, ratio) *
                      (it.alpha || 1),
                  );
                  g.ellipse(csx, csy, r * 2.2 * cps, r * 2.2 * cps);
                }
                if (bl > 0.65) {
                  const sa2 = p.constrain((bl - 0.65) / 0.25, 0, 1) * (1 - wl);
                  for (let i = 0; i < 22; i++) {
                    const a = (p.TWO_PI / 22) * i;
                    const d = 6 + (i % 5) * 3;
                    const stX = p.cos(a) * d * sa2,
                      stZ = p.sin(a) * d * sa2,
                      stY = -3;
                    const [srx, sry, srz] = rot3D(stX, stY, stZ);
                    const stP = focal / (focal + srz);
                    g.fill(
                      f.c2[0] * 0.7,
                      f.c2[1] * 0.5,
                      f.c2[2] * 0.3,
                      140 * sa2,
                    );
                    g.ellipse(srx * stP, sry * stP, 2.5 * stP, 2.5 * stP);
                  }
                }
                g.pop();
              } else if (it.tp === 's') {
                if (!it.sW || it.sW < 1) continue;
                g.push();
                g.translate(cx + it.sx, cy + it.sy);
                g.rotate(it.sa);
                const sc = it.sc!;
                g.fill(sc[0] * 0.7, sc[1] * 1.0, sc[2] * 0.6, it.sAlpha!);
                g.beginShape();
                g.vertex(0, 0);
                // prettier-ignore
                g.bezierVertex(it.sLen! * 0.3, -it.sW * 0.6, it.sLen! * 0.7, -it.sW * 0.4, it.sLen!, 0);
                // prettier-ignore
                g.bezierVertex(it.sLen! * 0.7, it.sW * 0.4, it.sLen! * 0.3, it.sW * 0.6, 0, 0);
                g.endShape(p.CLOSE);
                g.pop();
              } else {
                if (!it.pw || it.pw < 0.5) continue;
                g.push();
                g.translate(cx + it.sx, cy + it.sy);
                g.rotate(it.sa);
                g.fill(it.r!, it.gr!, it.b!);
                g.beginShape();
                for (let tt = 0; tt <= 1; tt += 0.07) {
                  const px = tt * it.pl!;
                  const bW = p.sin(tt * p.PI) * it.pw;
                  const cup = p.sin(tt * p.PI) * (it.cup || 0) * it.pw * 0.6;
                  const ruf = p.sin(tt * 8 + it.rPhase!) * it.rAmt! * tt;
                  g.vertex(px, bW + ruf + cup);
                }
                for (let tt = 1; tt >= 0; tt -= 0.07) {
                  const px = tt * it.pl!;
                  const bW = p.sin(tt * p.PI) * it.pw;
                  const cup = p.sin(tt * p.PI) * (it.cup || 0) * it.pw * 0.4;
                  const ruf = p.sin(tt * 8 + it.rPhase! + p.PI) * it.rAmt! * tt;
                  g.vertex(px, -bW + ruf - cup);
                }
                g.endShape(p.CLOSE);
                g.pop();
              }
            }
          }

          function renderToScreen() {
            const px = buf.pixels;
            const g = p.max(4, p.round(grid));
            const asciiG = p.max(g, 6);
            const scaleF = p.min(p.width / BUF_W, p.height / BUF_H) * 0.85;
            const invScale = 1 / scaleF;
            const renderW = BUF_W * scaleF,
              renderH = BUF_H * scaleF;
            const ox = (p.width - renderW) / 2 + mInfX;
            const oy = (p.height - renderH) / 2 + mInfY;
            const curM = renderMode,
              prevM = prevMode,
              mt = modeT;
            const transitionDone = mt >= 0.99;
            const useNative = curM === 0 || (!transitionDone && prevM === 0);
            if (useNative) {
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
            }
            const gEff = curM === 0 && transitionDone ? asciiG : g;
            const halfG = gEff * 0.5;
            const yStart = p.max(0, p.floor(oy / gEff) * gEff);
            const yEnd = p.min(p.height, oy + renderH);
            const xStart = p.max(0, p.floor(ox / gEff) * gEff);
            const xEnd = p.min(p.width, ox + renderW);
            const asciiSize = gEff * 1.1;
            // Dim colors slightly in light mode so pale petals stay visible
            const themeMul = isLight ? 0.72 : 1;
            let lastFontStr = '';

            for (let sy = yStart; sy < yEnd; sy += gEff) {
              const byBase = p.floor((sy - oy) * invScale);
              if (byBase < 0 || byBase >= BUF_H) continue;
              const rowOff = byBase * BUF_W;
              for (let sx = xStart; sx < xEnd; sx += gEff) {
                const bx = p.floor((sx - ox) * invScale);
                if (bx < 0 || bx >= BUF_W) continue;
                const idx = (rowOff + bx) * 4;
                const r = px[idx] * themeMul,
                  gr = px[idx + 1] * themeMul,
                  b = px[idx + 2] * themeMul;
                if (r + gr + b < 12) continue;
                const bright = r * 0.299 + gr * 0.587 + b * 0.114;
                const cx = sx + halfG,
                  cy = sy + halfG;
                let mode;
                if (transitionDone) {
                  mode = curM;
                } else {
                  const hash = ((sx * 73 + sy * 137) & 0xff) * 0.00392;
                  mode = hash < mt ? curM : prevM;
                }
                if (mode === 0) {
                  const fontSz = p.floor(asciiSize * (0.4 + bright * 0.004));
                  const fontStr = fontSz + 'px Courier New';
                  if (fontStr !== lastFontStr) {
                    ctx.font = fontStr;
                    lastFontStr = fontStr;
                  }
                  ctx.fillStyle = 'rgb(' + r + ',' + gr + ',' + b + ')';
                  const ci =
                    ((bright >> 2) + ((sx * 7 + sy * 13) >> 3)) % chars.length;
                  ctx.fillText(chars[ci], cx, cy);
                } else if (mode === 1) {
                  p.fill(r, gr, b);
                  const d = gEff * (0.1 + bright * 0.0033);
                  p.ellipse(cx, cy, d, d);
                } else {
                  p.fill(r, gr, b);
                  p.rectMode(p.CENTER);
                  p.rect(cx, cy, gEff * 0.93, gEff * 0.93);
                }
              }
            }
          }
        };

        instance = new P5(sketch, node);

        observer = new ResizeObserver(() => {
          if (instance && node.offsetWidth > 0) {
            instance.resizeCanvas(node.offsetWidth, node.offsetHeight);
          }
        });
        observer.observe(node);
      })
      .catch((err) => {
        console.error('[peonia] failed to start animation:', err);
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      themeObserver?.disconnect();
      instance?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 hidden h-screen w-[calc((100vw-48rem)/2)] xl:block"
    />
  );
}
