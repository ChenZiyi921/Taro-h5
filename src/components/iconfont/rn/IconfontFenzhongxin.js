/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

const IconfontFenzhongxin = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m-17.216 591.808c-12.928 0-25.216-0.128-36.992 0-24.384 0.384-38.208 12.608-38.592 35.968-0.64 34.304-0.512 68.544 0 102.784 0.384 23.296 13.824 36.48 38.08 36.928 36.672 0.64 73.28 0.64 109.888 0 23.552-0.384 37.568-13.312 38.016-35.392 0.768-35.264 0.896-70.528 0-105.728-0.64-22.464-14.656-34.112-38.528-34.368-12.16-0.192-24.32 0-37.312 0V490.24h192.128v101.76c-13.056 0-25.344-0.192-37.632 0-23.68 0.256-37.824 12.16-38.272 34.56a2416.64 2416.64 0 0 0 0 105.728c0.448 21.568 13.824 34.56 36.48 35.136 37.76 0.768 75.52 0.768 113.152 0 21.76-0.512 35.584-13.44 36.096-33.92 0.96-35.84 0.96-71.552 0-107.328-0.64-22.208-15.104-33.92-38.784-34.176-12.16-0.192-24.32 0-37.952 0V484.48c0-23.168-2.752-25.856-26.496-25.856H529.28V368.128h35.008c27.072-0.128 40.32-11.776 40.768-36.992 0.576-33.664 0.576-67.456 0-101.184-0.32-24.064-13.952-37.12-39.168-37.504a3344.64 3344.64 0 0 0-108.352 0c-24.448 0.384-38.208 13.312-38.592 36.416-0.704 34.816-0.704 69.504 0 104.32 0.448 22.464 14.4 34.56 37.888 34.88 12.672 0.128 25.344 0 37.952 0v90.496h-197.76c-24.96 0-27.648 2.368-27.648 26.24V592c-13.952 0-26.24-0.192-38.4 0-23.808 0.256-38.016 12.16-38.464 34.496a2416.64 2416.64 0 0 0 0 105.728c0.448 21.632 13.888 34.624 36.48 35.2 37.76 0.768 75.392 0.832 113.152 0 22.592-0.576 35.2-14.144 35.392-35.712 0.192-34.816 0.256-69.568 0-104.32-0.256-23.36-13.376-35.2-38.528-35.52-12.096-0.128-24.32 0-36.608 0V490.112h192.32v101.76z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

IconfontFenzhongxin.defaultProps = {
  size: 18,
};

export default IconfontFenzhongxin;
