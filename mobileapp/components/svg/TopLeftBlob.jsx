import React from "react";
import { View } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

const TopLeftBlob = () => {
  return (
    <View style={{ position: "absolute", top: -3, left: -30 }}> {/* Adjusted position */}
      <Svg width={150} height={170} viewBox="0  200 100" fill="none"> {/* Reduced size */}
        <Defs>
          {/* Gradient Definition */}
          <LinearGradient id="paint0_linear_2_211" x1="0" y1="245" x2="438" y2="245" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#F4C4F3" />
            <Stop offset="1" stopColor="#FC67FA" />
          </LinearGradient>
        </Defs>

        {/* Blob Shape */}
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M229.889 56.1973C255.394 67.877 282.163 74.7664 305.991 89.5742C328.21 103.382 345.698 122.179 364.812 140.045C386.585 160.397 423.242 173.125 427.018 202.701C430.922 233.28 381.807 251.909 383.028 282.712C384.89 329.656 452.108 367.811 435.307 411.679C421.256 448.366 361.804 438.058 322.619 440.445C290.899 442.377 260.814 416.873 229.889 424.194C185.925 434.601 158.487 490.816 113.317 489.991C72.2956 489.242 21.6859 460.531 13.7359 420.247C4.01432 370.986 72.2336 333.872 72.5984 283.661C72.8498 249.075 25.2131 231.869 15.3456 198.723C3.11618 157.643 -9.01473 110.502 9.55018 71.8733C27.6949 34.1191 69.0136 3.14397 110.769 0.17332C155.086 -2.97966 189.488 37.6959 229.889 56.1973Z"
          fill="url(#paint0_linear_2_211)"
          scale={0.35} // Scaled down to fit within 150x170
        />
      </Svg>
    </View>
  );
};

export default TopLeftBlob;
