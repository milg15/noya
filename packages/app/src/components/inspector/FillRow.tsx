import type FileFormat from '@sketch-hq/sketch-file-format-ts';
import { memo } from 'react';
// import EditableInput from '../components/input/EditableInput';
import styled from 'styled-components';
import ColorInputField from '../ColorInputField';
import * as InputField from '../InputField';
import * as Spacer from '../Spacer';

const Row = styled.div(({ theme }) => ({
  flex: '1',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

interface Props {
  color: FileFormat.Color;
}

export default memo(function FillRow({ color }: Props) {
  return (
    <Row>
      <ColorInputField color={color} />
      <Spacer.Horizontal size={8} />
      <InputField.Root labelPosition="start">
        <InputField.Input value={'FFFFFF'} />
        <InputField.Label>#</InputField.Label>
      </InputField.Root>
      <Spacer.Horizontal size={8} />
      <InputField.Root size={50}>
        <InputField.Input value={String(Math.round(color.alpha * 100))} />
        <InputField.Label>%</InputField.Label>
      </InputField.Root>
    </Row>
  );
});
