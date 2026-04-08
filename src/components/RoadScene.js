/**
 * RoadScene – SVG illustration of a peaceful straight road
 * extending to the horizon, used on the splash screen.
 */

import React from 'react';
import Svg, {
  Rect,
  Polygon,
  Line,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
  Path,
} from 'react-native-svg';
import { Colors } from '../constants/colors';

export default function RoadScene({ width = 375, height = 280 }) {
  const cx = width / 2;

  // Horizon sits at 45% of the height
  const horizon = height * 0.45;

  // Road vanishing-point perspective points
  const roadLeft = cx - width * 0.38;
  const roadRight = cx + width * 0.38;
  const vpLeft = cx - 3;
  const vpRight = cx + 3;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        {/* Sky gradient */}
        <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#2C6FAC" stopOpacity="1" />
          <Stop offset="1" stopColor="#87CEEB" stopOpacity="1" />
        </LinearGradient>

        {/* Road gradient (dark up close, lighter toward horizon) */}
        <LinearGradient id="roadGrad" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor="#3A3A3A" stopOpacity="1" />
          <Stop offset="1" stopColor="#5C5C5C" stopOpacity="1" />
        </LinearGradient>

        {/* Grass gradient */}
        <LinearGradient id="grassGrad" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor="#4A7A4A" stopOpacity="1" />
          <Stop offset="1" stopColor="#6A9C6A" stopOpacity="1" />
        </LinearGradient>

        {/* Sun glow */}
        <LinearGradient id="sunGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <Stop offset="0" stopColor="#FFF7AA" stopOpacity="0.9" />
          <Stop offset="1" stopColor="#FFD700" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Sky */}
      <Rect x={0} y={0} width={width} height={horizon + 2} fill="url(#skyGrad)" />

      {/* Sun halo */}
      <Circle cx={cx} cy={horizon - 40} r={55} fill="#FFF7AA" opacity={0.3} />
      {/* Sun */}
      <Circle cx={cx} cy={horizon - 40} r={22} fill="#FFD700" opacity={0.9} />

      {/* Distant mountains */}
      <Polygon
        points={`${cx - 120},${horizon} ${cx - 20},${horizon - 60} ${cx + 20},${horizon - 60} ${cx + 120},${horizon}`}
        fill="#7A9BBF"
        opacity={0.7}
      />
      <Polygon
        points={`${cx - 180},${horizon} ${cx - 70},${horizon - 45} ${cx},${horizon - 45} ${cx + 70},${horizon - 45} ${cx + 180},${horizon}`}
        fill="#8FAFC9"
        opacity={0.5}
      />

      {/* Grass — left of road */}
      <Polygon
        points={`0,${horizon} ${roadLeft},${horizon} 0,${height}`}
        fill="url(#grassGrad)"
      />

      {/* Grass — right of road */}
      <Polygon
        points={`${width},${horizon} ${roadRight},${horizon} ${width},${height}`}
        fill="url(#grassGrad)"
      />

      {/* Road surface */}
      <Polygon
        points={`${vpLeft},${horizon} ${vpRight},${horizon} ${roadRight},${height} ${roadLeft},${height}`}
        fill="url(#roadGrad)"
      />

      {/* Road shoulder lines */}
      <Line
        x1={vpLeft - 8}
        y1={horizon}
        x2={roadLeft - 10}
        y2={height}
        stroke="#A0A0A0"
        strokeWidth={1.5}
        opacity={0.5}
      />
      <Line
        x1={vpRight + 8}
        y1={horizon}
        x2={roadRight + 10}
        y2={height}
        stroke="#A0A0A0"
        strokeWidth={1.5}
        opacity={0.5}
      />

      {/* Center dashed line — 5 dashes with perspective scaling */}
      {[0.15, 0.3, 0.5, 0.68, 0.85].map((t, i) => {
        const y1 = horizon + (height - horizon) * (t - 0.08);
        const y2 = horizon + (height - horizon) * (t + 0.05);
        const scale = 0.4 + t * 1.0;
        return (
          <Line
            key={i}
            x1={cx}
            y1={y1}
            x2={cx}
            y2={y2}
            stroke={Colors.roadLine}
            strokeWidth={2.5 * scale}
            opacity={0.85}
          />
        );
      })}

      {/* Distant trees — left */}
      {[-90, -60, -30].map((offset, i) => {
        const tx = cx + offset - 10;
        const ty = horizon - 2;
        const treeH = 18 + i * 4;
        return (
          <React.Fragment key={`tl${i}`}>
            <Rect x={tx - 1} y={ty} width={2} height={treeH * 0.4} fill="#5C4A2A" />
            <Ellipse cx={tx} cy={ty - treeH * 0.3} rx={6 + i * 1.5} ry={treeH * 0.4} fill="#3A6B3A" opacity={0.85} />
          </React.Fragment>
        );
      })}

      {/* Distant trees — right */}
      {[30, 60, 90].map((offset, i) => {
        const tx = cx + offset + 10;
        const ty = horizon - 2;
        const treeH = 18 + i * 4;
        return (
          <React.Fragment key={`tr${i}`}>
            <Rect x={tx - 1} y={ty} width={2} height={treeH * 0.4} fill="#5C4A2A" />
            <Ellipse cx={tx} cy={ty - treeH * 0.3} rx={6 + i * 1.5} ry={treeH * 0.4} fill="#3A6B3A" opacity={0.85} />
          </React.Fragment>
        );
      })}

      {/* Wispy clouds */}
      <Ellipse cx={cx - 80} cy={horizon * 0.35} rx={40} ry={12} fill="white" opacity={0.55} />
      <Ellipse cx={cx - 55} cy={horizon * 0.32} rx={28} ry={9} fill="white" opacity={0.45} />
      <Ellipse cx={cx + 90} cy={horizon * 0.25} rx={50} ry={14} fill="white" opacity={0.5} />
      <Ellipse cx={cx + 110} cy={horizon * 0.22} rx={30} ry={10} fill="white" opacity={0.4} />
    </Svg>
  );
}
