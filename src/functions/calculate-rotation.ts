import { rotateMultiplier } from "../constants/constants"; //не работает(

export const calculateRotation = (index: number, total: number, isOpponent: boolean) => {
  const middle = (total - 1) / 2;
  const rotation = (index - middle) * rotateMultiplier;
  return isOpponent ? -rotation : rotation;
};
