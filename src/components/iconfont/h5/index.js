/* eslint-disable */

import React from 'react';
import IconfontZanwutongjishuju from './IconfontZanwutongjishuju';
import IconfontIcon1 from './IconfontIcon1';
import IconfontChengyuan from './IconfontChengyuan';
import IconfontFenzhongxin from './IconfontFenzhongxin';
import IconfontBiaodan from './IconfontBiaodan';
import IconfontHuanzhe from './IconfontHuanzhe';
import IconfontYuqi from './IconfontYuqi';
import IconfontShujuxiang from './IconfontShujuxiang';
import IconfontTongji from './IconfontTongji';
import IconfontShoucang from './IconfontShoucang';
import IconfontLuru from './IconfontLuru';
import IconfontMima from './IconfontMima';
import IconfontZanwushuju from './IconfontZanwushuju';
import IconfontSousuo from './IconfontSousuo';
import IconfontZanwushoucang from './IconfontZanwushoucang';
import IconfontPaixuDown from './IconfontPaixuDown';
import IconfontPaixuUp from './IconfontPaixuUp';

const IconFont = ({ name, ...rest }) => {
  switch (name) {
    case 'zanwutongjishuju':
      return <IconfontZanwutongjishuju {...rest} />;
    case 'icon1':
      return <IconfontIcon1 {...rest} />;
    case 'chengyuan':
      return <IconfontChengyuan {...rest} />;
    case 'fenzhongxin':
      return <IconfontFenzhongxin {...rest} />;
    case 'biaodan':
      return <IconfontBiaodan {...rest} />;
    case 'huanzhe':
      return <IconfontHuanzhe {...rest} />;
    case 'yuqi':
      return <IconfontYuqi {...rest} />;
    case 'shujuxiang':
      return <IconfontShujuxiang {...rest} />;
    case 'tongji':
      return <IconfontTongji {...rest} />;
    case 'shoucang':
      return <IconfontShoucang {...rest} />;
    case 'luru':
      return <IconfontLuru {...rest} />;
    case 'mima':
      return <IconfontMima {...rest} />;
    case 'zanwushuju':
      return <IconfontZanwushuju {...rest} />;
    case 'sousuo':
      return <IconfontSousuo {...rest} />;
    case 'zanwushoucang':
      return <IconfontZanwushoucang {...rest} />;
    case 'paixu-down':
      return <IconfontPaixuDown {...rest} />;
    case 'paixu-up':
      return <IconfontPaixuUp {...rest} />;

  }

  return null;
};

export default IconFont;
