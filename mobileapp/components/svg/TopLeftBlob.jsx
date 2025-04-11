import React from "react";
import { View } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

const TopLeftBlob = () => {
  return (
    <View style={{ position: "absolute", top: 0, left: 0 }}>
      <Svg width="200" height="200" viewBox="0 0 200 200" fill="none">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FF6B6B" />
            <Stop offset="100%" stopColor="#FFD93D" />
          </LinearGradient>
        </Defs>
        <Path
          d="M50,0 C80,20 120,20 150,0 C180,-20 200,30 200,60 C200,90 160,130 120,130 C80,130 40,110 20,80 C0,50 20,0 50,0 Z"
          fill="url(#grad)"
        />
      </Svg>
    </View>
  );
};

export default TopLeftBlob;
