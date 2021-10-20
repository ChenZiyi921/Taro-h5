/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const IconfontShoucang = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'rem'} height={size + 'rem'} style={style} {...rest}>
      <path
        d="M773.461 1005.431c-14.404 0-30.583-4.13-45.602-11.639L513.57 886.613 297.95 993.621c-13.653 7.27-29.287 11.094-45.227 11.094a96.256 96.256 0 0 1-57.549-18.842c-30.173-22.63-45.636-61.85-38.502-97.553l44.1-228.762-169.028-157.56A104.073 104.073 0 0 1 5.461 401.34l0.342-1.16c12.288-36.83 42.769-62.635 79.735-67.585l234.837-42.7L425.78 75.81c16.93-33.894 51.37-55.671 87.791-55.671 37.99 0 73.319 22.596 88.132 56.286l105.063 213.401 234.871 41.063a95.676 95.676 0 0 1 78.268 68.369 98.987 98.987 0 0 1-24.474 101l-0.58 0.58-168.55 158.72 42.598 229.172c6.86 36.659-7.714 73.66-38.059 96.733a90.283 90.283 0 0 1-57.378 19.968zM513.673 824.286l239.104 119.569c7.031 3.55 15.12 5.768 20.65 5.768 8.534 0 16.452-2.628 22.255-7.475l1.092-0.887c13.585-10.206 20.207-26.385 17.238-42.257l-48.128-259.209L956.21 460.561c11.674-11.844 15.667-28.808 10.48-44.407l-0.513-1.639a39.185 39.185 0 0 0-32.529-28.365l-1.092-0.17-263.339-46.046L550.708 99.19c-5.77-13.448-21.368-23.21-37.138-23.21-15.496 0-30.31 9.694-37.82 24.678L357.99 339.831 93.252 387.925c-16.077 2.014-28.57 12.698-34.338 29.355-4.096 15.223 0.751 33.553 11.947 44.988l190.532 177.561-50.005 259.345c-3.004 14.985 4.096 32.256 17.237 42.12 6.588 4.95 15.121 7.68 24.064 7.68 6.895 0 13.517-1.603 19.217-4.675l0.82-0.478 240.947-119.535z"
        fill={getIconColor(color, 0, '#f66a8d')}
      />
    </svg>
  );
};

IconfontShoucang.defaultProps = {
  size: 18,
};

export default IconfontShoucang;