import { CanvasKit } from 'canvaskit-wasm';
import { load } from '../index';
import { rect, color, fill } from '../primitives';

let ck: CanvasKit;

beforeAll(async () => {
  ck = await load();
});

test('converts color', async () => {
  expect(
    color(ck, {
      _class: 'color',
      red: 0.5,
      green: 0.5,
      blue: 0.5,
      alpha: 0.5,
    }),
  ).toMatchSnapshot();
});

test('converts rect', async () => {
  expect(
    rect(ck, {
      _class: 'rect',
      constrainProportions: false,
      x: 10,
      y: 20,
      width: 30,
      height: 40,
    }),
  ).toMatchSnapshot();
});

test('converts fill', async () => {
  const paint = fill(ck, {
    _class: 'fill',
    isEnabled: true,
    fillType: 0,
    color: {
      _class: 'color',
      alpha: 1,
      blue: 1,
      green: 0.6895309893279358,
      red: 0.2805640243902439,
    },
    contextSettings: {
      _class: 'graphicsContextSettings',
      blendMode: 0,
      opacity: 1,
    },
    gradient: {
      _class: 'gradient',
      elipseLength: 0,
      from: '{0.5, 0}',
      gradientType: 0,
      to: '{0.5, 1}',
      stops: [
        {
          _class: 'gradientStop',
          position: 0,
          color: {
            _class: 'color',
            alpha: 1,
            blue: 1,
            green: 1,
            red: 1,
          },
        },
        {
          _class: 'gradientStop',
          position: 1,
          color: {
            _class: 'color',
            alpha: 1,
            blue: 0,
            green: 0,
            red: 0,
          },
        },
      ],
    },
    noiseIndex: 0,
    noiseIntensity: 0,
    patternFillType: 1,
    patternTileScale: 1,
  });

  expect(paint.getColor()).toMatchSnapshot();
});

export {};
