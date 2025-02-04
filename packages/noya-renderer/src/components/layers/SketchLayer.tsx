import { Group } from 'noya-react-canvaskit';
import { PageLayer } from 'noya-state';
import { getLayerRotationTransform } from 'noya-state/src/selectors';
import { memo } from 'react';
import SketchArtboard from './SketchArtboard';
import SketchBitmap from './SketchBitmap';
import SketchGroup from './SketchGroup';
import SketchShape from './SketchShape';
import SketchText from './SketchText';

interface Props {
  layer: PageLayer;
}

export default memo(function SketchLayer({ layer }: Props) {
  if (!layer.isVisible) return null;

  let element: JSX.Element;

  switch (layer._class) {
    case 'artboard':
      element = <SketchArtboard layer={layer} />;
      break;
    case 'group':
      element = <SketchGroup layer={layer} />;
      break;
    case 'text':
      element = <SketchText layer={layer} />;
      break;
    case 'bitmap':
      element = <SketchBitmap layer={layer} />;
      break;
    case 'rectangle':
    case 'oval':
      element = <SketchShape layer={layer} />;
      break;
    default:
      console.info(layer._class, 'not handled');
      return null;
  }

  if (layer.rotation % 360 !== 0) {
    const rotation = getLayerRotationTransform(layer);

    return <Group transform={rotation}>{element}</Group>;
  }

  return element;
});
