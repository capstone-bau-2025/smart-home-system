import React from "react";
import { View } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

const BottomLeftBlob = () => {
  return (
    <View style={{ position: "absolute", bottom: -60, left: 0 }}>
      <Svg width={250} height={300} viewBox="100 20 300 400" fill="none"> 
        {/* X Y W H */}
        <Defs>
          {/* Outer Blob Gradient */}
          <LinearGradient id="grad1" x1="50" y1="0" x2="250" y2="350">
            <Stop offset="0%" stopColor="#FEAD3B" />
            <Stop offset="100%" stopColor="#FFCC33" />
          </LinearGradient>

          {/* Inner Blob Gradient */}
          <LinearGradient id="grad2" x1="50" y1="0" x2="250" y2="350">
            <Stop offset="0%" stopColor="#FF7B00" />
            <Stop offset="100%" stopColor="#FFCC33" />
          </LinearGradient>
        </Defs>

        {/* Outer Blob Shape - Slightly Smaller */}
        <Path
          d="M80.9679 73.7211C112.9864 86.0359 154.5815 87.6065 171.932 117.2486C189.593 147.42 149.4707 189.404 166.542 219.914C186.405 255.415 245.484 250.762 266.218 285.759C296.066 336.141 354.102 421.799 304.951 453.538C247.47 490.656 185.365 379.714 117.0218 382.103C74.2831 383.597 63.13101 455.708 21.0722 463.461C-24.3205 471.829 -94.992 467.879 -108.656 423.706C-125.165 370.337 -30.3416 331.539 -36.8996 276.052C-43.168 223.018 -133.193 210.887 -140.068 157.929C-146.686 106.952 -117.528 42.631 -69.573 24.36181C-19.2012 5.17171 30.6569 54.3707 80.9679 73.7211Z"
          fill="url(#grad1)"
        />

        {/* Inner Blob Shape - Slightly Smaller */}
        <Path
          d="M50.1017 94.5579C80.6085 106.3768 120.504 107.8841 137.1459 136.333C154.085 165.289 115.602 205.583 131.9756 234.864C151.0276 268.936 207.692 264.469 227.579 298.058C256.208 346.41 311.872 428.619 264.729 459.08C209.597 494.704 150.0294 388.229 84.479 390.521C43.4866 391.955 32.7902 461.162 -7.5501 468.604C-51.088 476.635 -118.871 472.844 -131.977 430.45C-147.812 379.229 -56.863 341.994 -63.153 288.741C-69.165 237.843 -155.512 226.2 -162.106 175.374C-168.453 126.451 -140.487 64.7197 -94.492 47.1862C-46.178 28.7688 1.643 75.9867 50.1017 94.5579Z"
          fill="url(#grad2)"
        />
      </Svg>
    </View>
  );
};

export default BottomLeftBlob;
