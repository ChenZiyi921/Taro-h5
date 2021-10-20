/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const IconfontLuru = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'rem'} height={size + 'rem'} style={style} {...rest}>
      <path
        d="M754.881 36.566H150.736c-66.731 0-120.829 54.098-120.829 120.829v724.973c0 66.731 54.098 120.83 120.829 120.83h323.703v-38.039H150.736c-41.768 1.492-85.028-49.459-85.028-82.791V157.395c0-44.751 35.801-85.028 85.028-85.028h604.145c53.702 0 85.774 41.022 85.774 85.028v345.333l35.055-60.415V157.395c0-66.731-54.098-120.829-120.829-120.829z"
        fill={getIconColor(color, 0, '#4ea1ff')}
      />
      <path
        d="M211.151 236.456v41.768h483.316v-41.768H211.151z m0 162.597h483.316v-41.022H211.151v41.022z m0 120.829h483.316v-42.514H211.151v42.514z m0 120.829h241.658v-40.275H211.151v40.275zM978.849 580.297l-42.724-42.724c-11.816-11.794-27.271-17.691-42.724-17.691s-30.906 5.897-42.725 17.691L591.305 796.922c-11.77 11.816-47.874 57.454-47.874 72.908l-30.207 133.368 133.345-30.207s61.114-36.104 72.932-47.898L978.85 665.744c23.587-23.635 23.587-61.859-0.001-85.447zM698.173 903.672c-3.426 3.241-15.22 11.236-29.695 20.419l-78.268-78.245c8.041-11.001 16.969-22.072 22.469-27.551L807.978 623.02l85.424 85.425-195.229 195.227z"
        fill={getIconColor(color, 1, '#4ea1ff')}
      />
    </svg>
  );
};

IconfontLuru.defaultProps = {
  size: 18,
};

export default IconfontLuru;