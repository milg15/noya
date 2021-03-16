import Sketch from '@sketch-hq/sketch-file-format-ts';
import { Paint } from 'canvaskit-wasm';
import { Group, Path, Rect, useReactCanvasKit } from 'noya-react-canvaskit';
import { Primitives } from 'noya-renderer';
import { getLayerFixedRadius } from 'noya-state/src/selectors';
import { AffineTransform } from 'noya-state/src/utils/AffineTransform';
import { ReactNode, useMemo } from 'react';

function useLayerPath(layer: Sketch.Rectangle | Sketch.Oval) {
  const { CanvasKit } = useReactCanvasKit();

  return useMemo(() => {
    const path = Primitives.path(
      CanvasKit,
      layer.points,
      layer.frame,
      getLayerFixedRadius(layer),
    );

    path.setFillType(CanvasKit.FillType.EvenOdd);

    return path;
  }, [CanvasKit, layer]);
}

function useLayerFrameRect(layer: Sketch.AnyLayer) {
  const { CanvasKit } = useReactCanvasKit();

  return useMemo(() => {
    return Primitives.rect(CanvasKit, layer.frame);
  }, [CanvasKit, layer]);
}

interface HoverOutlinePathProps {
  layer: Sketch.Rectangle | Sketch.Oval;
  paint: Paint;
}

function HoverOutlinePath({ layer, paint }: HoverOutlinePathProps) {
  return <Path path={useLayerPath(layer)} paint={paint} />;
}

interface HoverOutlineRectProps {
  layer: Sketch.AnyLayer;
  paint: Paint;
}

function HoverOutlineRect({ layer, paint }: HoverOutlineRectProps) {
  return <Rect rect={useLayerFrameRect(layer)} paint={paint} />;
}

interface Props {
  layer: Sketch.AnyLayer;
  paint: Paint;
  transform: AffineTransform;
}

export default function HoverOutline({ layer, paint, transform }: Props) {
  let element: ReactNode;

  switch (layer._class) {
    case 'artboard':
    case 'bitmap':
    case 'group':
    case 'text': {
      element = <HoverOutlineRect layer={layer} paint={paint} />;
      break;
    }
    case 'rectangle':
    case 'oval': {
      element = <HoverOutlinePath layer={layer} paint={paint} />;
      break;
    }
    default:
      console.log(layer._class, 'not handled');
      element = null;
      break;
  }

  return <Group transform={transform}>{element}</Group>;
}