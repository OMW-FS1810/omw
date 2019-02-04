import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const CARD_WIDTH = height / 4;
export const CARD_HEIGHT = CARD_WIDTH - 50;
