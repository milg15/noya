import type Sketch from '@sketch-hq/sketch-file-format-ts';
import {
  InputField,
  Label,
  LabeledElementView,
  sketchColorToHex,
  Spacer,
} from 'noya-designsystem';
import { memo, ReactNode, useCallback } from 'react';
import styled from 'styled-components';
import ColorInputFieldWithPicker from './ColorInputFieldWithPicker';

const Row = styled.div(({ theme }) => ({
  flex: '1',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

interface Props {
  id: string;
  color: Sketch.Color;
  onChangeColor: (color: Sketch.Color) => void;
  onChangeOpacity: (amount: number) => void;
  onNudgeOpacity: (amount: number) => void;
  prefix?: ReactNode;
}

export default memo(function FillRow({
  id,
  color,
  onChangeColor,
  onChangeOpacity,
  onNudgeOpacity,
  prefix,
}: Props) {
  const colorInputId = `${id}-color`;
  const hexInputId = `${id}-hex`;
  const opacityInputId = `${id}-opacity`;

  const renderLabel = useCallback(
    ({ id }) => {
      switch (id) {
        case colorInputId:
          return <Label.Label>Color</Label.Label>;
        case hexInputId:
          return <Label.Label>Hex</Label.Label>;
        case opacityInputId:
          return <Label.Label>Opacity</Label.Label>;
        default:
          return null;
      }
    },
    [colorInputId, hexInputId, opacityInputId],
  );

  const handleSubmitOpacity = useCallback(
    (opacity: number) => {
      onChangeOpacity(opacity / 100);
    },
    [onChangeOpacity],
  );

  const handleNudgeOpacity = useCallback(
    (amount: number) => {
      onNudgeOpacity(amount / 100);
    },
    [onNudgeOpacity],
  );

  return (
    <Row id={id}>
      <LabeledElementView renderLabel={renderLabel}>
        {prefix}
        {prefix && <Spacer.Horizontal size={8} />}
        <ColorInputFieldWithPicker
          id={colorInputId}
          value={color}
          onChange={onChangeColor}
        />
        <Spacer.Horizontal size={8} />
        <InputField.Root id={hexInputId} labelPosition="start">
          <InputField.Input
            value={sketchColorToHex(color).replace('#', '')}
            onSubmit={() => {}}
          />
          <InputField.Label>#</InputField.Label>
        </InputField.Root>
        <Spacer.Horizontal size={8} />
        <InputField.Root id={opacityInputId} size={50}>
          <InputField.NumberInput
            value={Math.round(color.alpha * 100)}
            onSubmit={handleSubmitOpacity}
            onNudge={handleNudgeOpacity}
          />
          <InputField.Label>%</InputField.Label>
        </InputField.Root>
      </LabeledElementView>
    </Row>
  );
});
