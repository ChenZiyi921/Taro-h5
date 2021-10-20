/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

const IconfontPaixuDown = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M383.706591 991.446838a31.963123 31.963123 0 1 1-63.926246 0V32.553162a31.963123 31.963123 0 0 1 63.926246 0v958.893676z"
        fill={getIconColor(color, 0, '#1296db')}
      />
      <Path
        d="M376.291146 970.99044a31.963123 31.963123 0 1 1-49.095356 40.912797L6.925302 627.706504a31.963123 31.963123 0 0 1 49.095356-40.912797l320.270488 384.196733z"
        fill={getIconColor(color, 1, '#1296db')}
      />
      <Path
        d="M639.411571 32.553162a31.963123 31.963123 0 1 1 63.926245 0v958.893676a31.963123 31.963123 0 0 1-63.926245 0V32.553162z"
        fill={getIconColor(color, 2, '#333333')}
      />
      <Path
        d="M646.827015 53.00956a31.963123 31.963123 0 1 1 49.095357-40.912797l320.270488 384.196733a31.963123 31.963123 0 0 1-49.095357 40.912797L646.827015 53.00956z"
        fill={getIconColor(color, 3, '#333333')}
      />
    </Svg>
  );
};

IconfontPaixuDown.defaultProps = {
  size: 18,
};

export default IconfontPaixuDown;
