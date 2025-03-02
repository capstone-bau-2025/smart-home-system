import React from "react";
import { View, Platform } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

const TopRightBlob = () => {
  const viewBoxValue = Platform.OS === "android" ? "0 23 195 232" : "0 15 195 232";

  return (
    <View style={{ position: "absolute", top: 0, right: 0 }}>
      <Svg width={195} height={240} viewBox={viewBoxValue} fill="none">
        <Defs>
          {/* First Gradient */}
          <LinearGradient id="grad1" x1="0" y1="0" x2="195" y2="232">
            <Stop offset="0%" stopColor="#FEAD3B" />
            <Stop offset="100%" stopColor="#FFCC33" />
          </LinearGradient>

          {/* Second Gradient */}
          <LinearGradient id="grad2" x1="0" y1="0" x2="195" y2="232">
            <Stop offset="0%" stopColor="#FF7B00" />
            <Stop offset="100%" stopColor="#FFCC33" />
          </LinearGradient>
        </Defs>

        {/* First Shape */}
        <Path
          d="M182.233 14.0437C192.343 24.2486 204.899 30.3421 214.794 40.7702C227.744 54.4169 250.786 64.0488 249.072 84.4809C247.363 104.864 217.396 112.239 207.239 130.866C194.711 153.842 205.68 188.759 184.298 203.273C164.08 216.997 139.788 199.734 120.201 189.947C104.569 182.137 98.837 162.862 84.2768 153.299C65.5128 140.975 30.5909 148.8 23.5986 126.5C16.8792 105.07 45.1409 84.3022 55.7527 62.3291C64.9778 43.2272 68.2693 22.1823 81.8948 5.78974C97.377 -12.8366 116.117 -38.4958 138.058 -36.6909C161.512 -34.7615 166.168 -2.17365 182.233 14.0437Z"
          fill="url(#grad1)" // Using first gradient
        />

        {/* Second Shape */}
        <Path
          d="M186.074 35.5404C192.932 42.5224 201.474 46.6699 208.186 53.806C216.968 63.1447 232.65 69.69 231.405 83.7418C230.164 97.7598 209.696 102.929 202.698 115.768C194.067 131.604 201.42 155.572 186.782 165.62C172.939 175.122 156.433 163.334 143.108 156.671C132.474 151.354 128.636 138.122 118.74 131.596C105.986 123.186 82.1358 128.681 77.4488 113.374C72.9447 98.6639 92.2996 84.2932 99.6196 69.1526C105.983 55.9904 108.306 41.5121 117.661 30.1979C128.291 17.342 141.169 -0.35953 156.129 0.808711C172.12 2.05751 175.175 24.4448 186.074 35.5404Z"
          fill="url(#grad2)" // Using second gradient
        />
      </Svg>
    </View>
  );
};

export default TopRightBlob;
