import React, {useEffect, useState, useRef} from 'react';
import {View, Dimensions, Button} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  EasingNode,
  Adaptable,
} from 'react-native-reanimated';
import {mix} from 'react-native-redash';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DEFAULT_DURATION = 2500;
const App = () => {
  const progress = useSharedValue(0);
  const [size, setSize] = useState(Dimensions.get('window').width);
  const height = useRef(new Animated.Value(size)).current;

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: DEFAULT_DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyles = {
    width: size,
    height: height,
  };

  const animate = (newSize: Adaptable<number>) => {
    Animated.timing(height, {
      toValue: newSize,
      duration: 2500,
      easing: EasingNode.ease,
    }).start();

    setSize(size + 50);
  };

  const data = useDerivedValue(() => {
    const m = mix.bind(null, progress.value);
    return {
      from: {
        x: m(-0.5, -1),
        y: m(0, 0.5),
      },
      c1: {
        x: m(0, 0.5),
        y: m(0.5, 1),
      },
      c2: {
        x: m(1, 0.5),
        y: m(0.5, 0),
      },
      to: {
        x: m(1.5, 2),
        y: m(0.5, 1),
      },
    };
  });
  const path = useAnimatedProps(() => {
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
        backgroundColor: 'white',
      }}>
      <Animated.View style={animatedStyles}>
        <Svg viewBox="0 0 1 1" style={{position: 'absolute', bottom: 0}}>
          <AnimatedPath fill="#3884ff" animatedProps={path} />
        </Svg>
      </Animated.View>
      <Button
        title="num"
        onPress={() => {
          animate(size + 50);
        }}></Button>
    </View>
  );
};

export default App;
