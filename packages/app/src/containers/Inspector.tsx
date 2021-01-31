import type FileFormat from '@sketch-hq/sketch-file-format-ts';
// import EditableInput from '../components/input/EditableInput';
import AlignmentInspector from '../components/inspector/AlignmentInspector';
import DimensionsInspector, {
  Props as DimensionsInspectorProps,
} from '../components/inspector/DimensionsInspector';
import {
  useApplicationState,
  useSelector,
} from '../contexts/ApplicationStateContext';
import * as InputField from '../components/InputField';
import * as Spacer from '../components/Spacer';
import { PageLayer, Selectors } from 'ayano-state';
import ArrayController from '../components/inspector/ArrayController';
import Divider from '../components/Divider';
import withSeparatorElements from '../utils/withSeparatorElements';
import { Fragment, useMemo } from 'react';
import FillRow from '../components/inspector/FillRow';
import BorderRow from '../components/inspector/BorderRow';

interface Props {}

export default function Inspector(props: Props) {
  const [state, dispatch] = useApplicationState();
  const page = useSelector(Selectors.getCurrentPage);

  const selectedLayers = useMemo(
    () =>
      state.selectedObjects
        .map((id) => page.layers.find((layer) => layer.do_objectID === id))
        .filter((layer): layer is PageLayer => !!layer),
    [page.layers, state.selectedObjects],
  );

  const elements = useMemo(() => {
    const dimensionsInspectorProps: DimensionsInspectorProps =
      selectedLayers.length === 1
        ? selectedLayers[0].frame
        : { x: 'multi', y: 'multi', width: 'multi', height: 'multi' };

    const views = [
      <Fragment key="layout">
        <AlignmentInspector />
        <DimensionsInspector {...dimensionsInspectorProps} />
        <Spacer.Vertical size={10} />
      </Fragment>,
      selectedLayers.length === 1 && (
        <ArrayController<FileFormat.Fill>
          key="fills"
          value={selectedLayers[0].style?.fills ?? []}
          onChange={(value) => {
            dispatch(['setFills', value]);
          }}
          title="Fills"
        >
          {(item) => <FillRow color={item.color} />}
        </ArrayController>
      ),
      selectedLayers.length === 1 && (
        <ArrayController<FileFormat.Border>
          key="borders"
          value={selectedLayers[0].style?.borders ?? []}
          onChange={(value) => {
            dispatch(['setBorders', value]);
          }}
          title="Borders"
        >
          {(item) => (
            <BorderRow
              color={item.color}
              width={item.thickness}
              onNudgeWidth={(amount) => {
                dispatch(['nudgeBorderWidth', amount]);
              }}
            />
          )}
        </ArrayController>
      ),
    ].filter((element): element is JSX.Element => !!element);

    return withSeparatorElements(views, <Divider />);
  }, [dispatch, selectedLayers]);

  if (selectedLayers.length === 0) return null;

  return <>{elements}</>;
}
