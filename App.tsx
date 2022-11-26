import React, {useEffect, useState} from 'react';
import {View, Dimensions} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import {mix} from 'react-native-redash';
const SIZE = Dimensions.get('window').width;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const App = () => {
  const progress = useSharedValue(0);

  const [accVals, setAccVals] = useState({x: 0, y: 0, z: 0});

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {duration: 2600, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
  }, [progress]);
  const data = useDerivedValue(() => {
    const m = mix.bind(null, progress.value);
    return {
      from: {
        x: m(-0.5, -1),
        y: m(0, 0.5),
      },
      c1: {x: m(0, 0.5), y: m(0.5, 1)},
      c2: {x: m(1, 0.5), y: m(0.5, 0)},
      to: {x: m(1.5, 2), y: m(0.5, 1)},
    };
  });
  const path1 = useAnimatedProps(() => {
    const {from, c1, c2, to} = data.value;
    return {
      d: `M ${from.x} ${from.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y} L 1 1 L 0 1 Z`,
    };
  });
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
      <MaskedView
        maskElement={
          <View
            style={{
              backgroundColor: 'black',
              width: SIZE,
              height: SIZE,
            }}
          />
        }>
        <Svg width={SIZE} height={SIZE} viewBox="0 0 1 1">
          <AnimatedPath fill="#3884ff" animatedProps={path1} />
        </Svg>
      </MaskedView>
    </View>
  );
};

export default App;
