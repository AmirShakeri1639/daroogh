import { useMediaQuery, useTheme } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

const useMediaQueryWithTheme = (
  direction: 'down' | 'up' = 'up',
  key: number | Breakpoint
): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints[direction](key));
};

export default useMediaQueryWithTheme;
