/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const IconfontMima = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'rem'} height={size + 'rem'} style={style} {...rest}>
      <path
        d="M832 403.2H384c-96 211.2-32 576-32 576l480 6.4 76.8-83.2V480L832 403.2zM582.4 768c0 19.2-12.8 32-32 32s-32-12.8-32-32V614.4c0-19.2 12.8-32 32-32s32 12.8 32 32V768z"
        fill={getIconColor(color, 0, '#CFE6F7')}
      />
      <path
        d="M800 364.8H768V256C768 121.6 652.8 12.8 518.4 12.8H512C371.2 12.8 262.4 121.6 256 256v108.8h-32c-76.8 0-147.2 64-147.2 147.2v352c0 76.8 64 147.2 147.2 147.2h576c76.8 0 147.2-64 147.2-147.2V512c0-76.8-64-147.2-147.2-147.2zM320 256c6.4-102.4 89.6-185.6 192-185.6h6.4c102.4 6.4 179.2 89.6 185.6 185.6v108.8H320V256z m563.2 608c0 44.8-38.4 83.2-83.2 83.2h-576c-44.8 0-83.2-38.4-83.2-83.2V512c0-44.8 38.4-83.2 83.2-83.2h576c44.8 0 83.2 38.4 83.2 83.2v352z"
        fill={getIconColor(color, 1, '#0E82D5')}
      />
      <path
        d="M512 582.4c-19.2 0-32 12.8-32 32V768c0 19.2 12.8 32 32 32s32-12.8 32-32V614.4c0-19.2-12.8-32-32-32z"
        fill={getIconColor(color, 2, '#0E82D5')}
      />
    </svg>
  );
};

IconfontMima.defaultProps = {
  size: 18,
};

export default IconfontMima;
