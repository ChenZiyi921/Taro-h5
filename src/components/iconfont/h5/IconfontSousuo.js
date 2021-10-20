/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const IconfontSousuo = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'rem'} height={size + 'rem'} style={style} {...rest}>
      <path
        d="M1014.048 1014.208a33.6 33.6 0 0 1-46.88 0l-265.344-261.152a432.992 432.992 0 0 1-271.104 94.688C192.832 847.744 0 657.952 0 423.872 0 189.76 192.832 0 430.72 0c237.888 0 430.72 189.76 430.72 423.872 0 109.44-42.528 208.896-111.712 284.096l264.32 260.096a32.32 32.32 0 0 1 0 46.144zM430.72 65.216c-201.28 0-364.448 160.576-364.448 358.656S229.44 782.528 430.72 782.528c201.28 0 364.448-160.576 364.448-358.656S632 65.216 430.72 65.216z"
        fill={getIconColor(color, 0, '#7A7A7A')}
      />
    </svg>
  );
};

IconfontSousuo.defaultProps = {
  size: 18,
};

export default IconfontSousuo;
