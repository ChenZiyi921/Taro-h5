/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

const IconfontTongji = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M549.44 530.024l334.944 285.0576c67.0272-76.5024 107.616-176.136 107.616-285.0576h-442.56z"
        fill={getIconColor(color, 0, '#3CB2EF')}
      />
      <Path
        d="M992 468.5648C992 227.384 793.8848 32 549.44 32v436.5648H992z"
        fill={getIconColor(color, 1, '#FFC000')}
      />
      <Path
        d="M474.6176 118.9616C230.216 118.9616 32 314.4176 32 555.464 32 796.5776 230.216 992 474.6176 992c133.9872 0 253.9152-58.7616 335.0784-151.4448l-335.0784-285.1104V118.9616z"
        fill={getIconColor(color, 2, '#F86161')}
      />
    </Svg>
  );
};

IconfontTongji.defaultProps = {
  size: 18,
};

export default IconfontTongji;
