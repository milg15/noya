import Sketch from '@sketch-hq/sketch-file-format-ts';
import produce from 'immer';
import * as Models from '../models';

export type SetNumberMode = 'replace' | 'adjust';

export type StyleElementType = 'Fill' | 'Border' | 'Shadow';

export type StyleShadowProperty = 'X' | 'Y' | 'Blur' | 'Spread';

export type StyleAction =
  | [type: `addNew${StyleElementType}`]
  | [type: `delete${StyleElementType}`, index: number]
  | [
      type: `move${StyleElementType}`,
      sourceIndex: number,
      destinationIndex: number,
    ]
  | [type: `deleteDisabled${StyleElementType}s`]
  | [type: `set${StyleElementType}Enabled`, index: number, isEnabled: boolean]
  | [
      type: 'setBorderWidth',
      index: number,
      amount: number,
      mode?: SetNumberMode,
    ]
  | [type: 'setBorderPosition', index: number, position: Sketch.BorderPosition]
  | [
      type: 'setFillOpacity',
      index: number,
      amount: number,
      mode?: SetNumberMode,
    ]
  | [
      type: `setShadow${StyleShadowProperty}`,
      index: number,
      amount: number,
      mode?: SetNumberMode,
    ]
  | [type: 'setOpacity', amount: number, mode?: SetNumberMode]
  | [type: 'setFixedRadius', amount: number, mode?: SetNumberMode]
  | [type: `set${StyleElementType}Color`, index: number, value: Sketch.Color];

export function styleReducer(
  state: Sketch.Style,
  action: StyleAction,
): Sketch.Style {
  switch (action[0]) {
    case 'addNewBorder':
      return produce(state, (draft) => {
        if (draft.borders) {
          draft.borders.unshift(Models.border);
        } else {
          draft.borders = [Models.border];
        }
      });
    case 'addNewFill':
      return produce(state, (draft) => {
        if (draft.fills) {
          draft.fills.unshift(Models.fill);
        } else {
          draft.fills = [Models.fill];
        }
      });
    case 'addNewShadow':
      return produce(state, (draft) => {
        if (draft.shadows) {
          draft.shadows.unshift(Models.shadow);
        } else {
          draft.shadows = [Models.shadow];
        }
      });
    case 'setBorderEnabled': {
      const [, index, isEnabled] = action;
      return produce(state, (draft) => {
        if (draft.borders && draft.borders[index]) {
          draft.borders[index].isEnabled = isEnabled;
        }
      });
    }
    case 'setFillEnabled': {
      const [, index, isEnabled] = action;
      return produce(state, (draft) => {
        if (draft.fills && draft.fills[index]) {
          draft.fills[index].isEnabled = isEnabled;
        }
      });
    }
    case 'setShadowEnabled': {
      const [, index, isEnabled] = action;
      return produce(state, (draft) => {
        if (draft.shadows && draft.shadows[index]) {
          draft.shadows[index].isEnabled = isEnabled;
        }
      });
    }
    case 'deleteBorder':
      return produce(state, (draft) => {
        if (draft.borders) {
          draft.borders.splice(action[1], 1);
        }
      });
    case 'deleteFill':
      return produce(state, (draft) => {
        if (draft.fills) {
          draft.fills.splice(action[1], 1);
        }
      });
    case 'deleteShadow':
      return produce(state, (draft) => {
        if (draft.shadows) {
          draft.shadows.splice(action[1], 1);
        }
      });
    case 'moveBorder': {
      const [, sourceIndex, destinationIndex] = action;
      return produce(state, (draft) => {
        if (!draft.borders) return;

        const sourceItem = draft.borders[sourceIndex];

        draft.borders.splice(sourceIndex, 1);
        draft.borders.splice(destinationIndex, 0, sourceItem);
      });
    }
    case 'moveFill': {
      const [, sourceIndex, destinationIndex] = action;
      return produce(state, (draft) => {
        if (!draft.fills) return;

        const sourceItem = draft.fills[sourceIndex];

        draft.fills.splice(sourceIndex, 1);
        draft.fills.splice(destinationIndex, 0, sourceItem);
      });
    }
    case 'moveShadow': {
      const [, sourceIndex, destinationIndex] = action;
      return produce(state, (draft) => {
        if (!draft.shadows) return;

        const sourceItem = draft.shadows[sourceIndex];

        draft.shadows.splice(sourceIndex, 1);
        draft.shadows.splice(destinationIndex, 0, sourceItem);
      });
    }
    case 'deleteDisabledBorders':
      return produce(state, (draft) => {
        if (draft.borders) {
          draft.borders = draft.borders.filter((border) => border.isEnabled);
        }
      });
    case 'deleteDisabledFills':
      return produce(state, (draft) => {
        if (draft.fills) {
          draft.fills = draft.fills.filter((fill) => fill.isEnabled);
        }
      });
    case 'deleteDisabledShadows':
      return produce(state, (draft) => {
        if (draft.shadows) {
          draft.shadows = draft.shadows.filter((fill) => fill.isEnabled);
        }
      });
    case 'setBorderColor': {
      const [, index, color] = action;
      return produce(state, (draft) => {
        if (draft.borders && draft.borders[index]) {
          draft.borders[index].color = color;
        }
      });
    }
    case 'setFillColor': {
      const [, index, color] = action;
      return produce(state, (draft) => {
        if (draft.fills && draft.fills[index]) {
          draft.fills[index].color = color;
        }
      });
    }
    case 'setShadowColor': {
      const [, index, color] = action;
      return produce(state, (draft) => {
        if (draft.shadows && draft.shadows[index]) {
          draft.shadows[index].color = color;
        }
      });
    }
    case 'setBorderWidth': {
      const [, index, amount, mode = 'replace'] = action;
      return produce(state, (draft) => {
        if (!draft.borders || !draft.borders[index]) return;

        const newValue =
          mode === 'replace' ? amount : draft.borders[index].thickness + amount;

        draft.borders[index].thickness = Math.max(0, newValue);
      });
    }
    case 'setFillOpacity': {
      const [, index, amount, mode = 'replace'] = action;
      return produce(state, (draft) => {
        if (!draft.fills || !draft.fills[index]) return;

        const newValue =
          mode === 'replace' ? amount : draft.fills[index].color.alpha + amount;

        draft.fills[index].color.alpha = Math.min(Math.max(0, newValue), 1);
      });
    }
    case 'setOpacity': {
      const [, amount, mode = 'replace'] = action;

      return produce(state, (draft) => {
        if (!draft.contextSettings) return;

        const newValue =
          mode === 'replace' ? amount : draft.contextSettings.opacity + amount;

        draft.contextSettings.opacity = Math.min(Math.max(0, newValue), 1);
      });
    }
    case 'setShadowX': {
      const [, index, amount, mode = 'replace'] = action;

      return produce(state, (draft) => {
        if (!draft.shadows || !draft.shadows[index]) return;

        const newValue =
          mode === 'replace' ? amount : draft.shadows[index].offsetX + amount;

        draft.shadows[index].offsetX = newValue;
      });
    }
    case 'setShadowY': {
      const [, index, amount, mode = 'replace'] = action;

      return produce(state, (draft) => {
        if (!draft.shadows || !draft.shadows[index]) return;

        const newValue =
          mode === 'replace' ? amount : draft.shadows[index].offsetY + amount;

        draft.shadows[index].offsetY = newValue;
      });
    }
    case 'setShadowBlur': {
      const [, index, amount, mode = 'replace'] = action;

      return produce(state, (draft) => {
        if (!draft.shadows || !draft.shadows[index]) return;

        const newValue =
          mode === 'replace'
            ? amount
            : draft.shadows[index].blurRadius + amount;

        draft.shadows[index].blurRadius = newValue;
      });
    }
    case 'setShadowSpread': {
      const [, index, amount, mode = 'replace'] = action;

      return produce(state, (draft) => {
        if (!draft.shadows || !draft.shadows[index]) return;

        const newValue =
          mode === 'replace' ? amount : draft.shadows[index].spread + amount;

        draft.shadows[index].spread = newValue;
      });
    }
    case 'setBorderPosition': {
      const [, index, position] = action;

      return produce(state, (draft) => {
        if (!draft.borders || !draft.borders[index]) return;

        draft.borders[index].position = position;
      });
    }
    default:
      return state;
  }
}
