import { BaseToast, ErrorToast } from 'react-native-toast-message';

const commonProps = {
  contentContainerStyle: { paddingHorizontal: 15 },
  text1Style: {
    fontFamily: 'Lexend-Bold',
    fontSize: 16,
    color: 'black',
  },
  text2Style: {
    fontFamily: 'Lexend-Regular',
    fontSize: 14,
    color: '#a8a8a8',
  },
  visibilityTime: 4000,
  autoHide: true,
  swipeable: true,
  topOffset: 60,
};

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      {...commonProps}
      style={{ borderLeftColor: 'green' }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      {...commonProps}
      style={{ borderLeftColor: 'red' }}
    />
  ),
};
