import { useGlobalInputBlurTrigger } from 'noya-designsystem';
import {
  Action,
  ApplicationState,
  LayerHighlight,
  WorkspaceAction,
  WorkspaceState,
} from 'noya-state';
import { createContext, useCallback, useContext, useMemo } from 'react';

export type ApplicationStateContextValue = [
  WorkspaceState,
  (action: WorkspaceAction) => void,
];

const ApplicationStateContext = createContext<
  ApplicationStateContextValue | undefined
>(undefined);

export const ApplicationStateProvider = ApplicationStateContext.Provider;

type Dispatcher = (...args: Action) => void;

/**
 * This should only be used to propagate state between React reconcilers
 */
export const useRawApplicationState = (): ApplicationStateContextValue => {
  const value = useContext(ApplicationStateContext);

  // If this happens, we'll conditionally call hooks afterward
  // TODO: Is there a better solution?
  if (!value) {
    throw new Error(`Missing ApplicationStateProvider`);
  }

  return value;
};

/**
 * Get the application state, and a dispatch function to modify it.
 *
 * Only "container" components should use this, while "presentational" components
 * should instead be passed their data via props.
 */
export const useApplicationState = (): [ApplicationState, Dispatcher] => {
  const value = useRawApplicationState();
  const trigger = useGlobalInputBlurTrigger();

  const [state, dispatch] = value;

  // Simplify the dispatch function by flattening our Action tuple
  const wrappedDispatch: Dispatcher = useCallback(
    (...args: Action) => {
      // When changing selection, trigger any pending updates in input fields
      if (
        args[0] === 'selectLayer' ||
        args[0] === 'selectPage' ||
        args[0] === 'setTab'
      ) {
        trigger();
      }

      dispatch(args);
    },
    [dispatch, trigger],
  );

  const wrapped: [ApplicationState, Dispatcher] = useMemo(() => {
    return [state.history.present, wrappedDispatch];
  }, [state.history.present, wrappedDispatch]);

  return wrapped;
};

export const useWorkspace = () => {
  const [state, dispatch] = useRawApplicationState();

  const { highlightedLayer, canvasSize, canvasInsets, preferences } = state;

  return useMemo(
    () => ({
      setCanvasSize: (
        size: { width: number; height: number },
        insets: { left: number; right: number },
      ) => {
        // console.log('scs', size, insets);
        dispatch(['setCanvasSize', size, insets]);
      },
      setShowRulers: (value: boolean) => dispatch(['setShowRulers', value]),
      highlightLayer: (highlight?: LayerHighlight) =>
        dispatch(['highlightLayer', highlight]),

      highlightedLayer,
      canvasSize,
      canvasInsets,
      preferences,
    }),
    [canvasInsets, canvasSize, dispatch, highlightedLayer, preferences],
  );
};

export const useHistory = () => {
  const [state, dispatch] = useRawApplicationState();
  const redoDisabled = state.history.future.length === 0;
  const undoDisabled = state.history.past.length === 0;
  return useMemo(
    () => ({
      redo: () => dispatch(['redo']),
      undo: () => dispatch(['undo']),
      redoDisabled,
      undoDisabled,
    }),
    [dispatch, redoDisabled, undoDisabled],
  );
};

export function useSelector<Projection>(
  selector: (state: ApplicationState) => Projection,
) {
  const [state] = useApplicationState();

  return useMemo(() => selector(state), [selector, state]);
}
