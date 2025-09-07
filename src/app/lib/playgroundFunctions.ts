import { usePlaygroundStore } from "../stores/playgroundStore";
import { useRedBallStore } from "../stores/redBallStore";

export function moveRedBall({x, y}: {x: number, y: number}){
  useRedBallStore.setState({ x, y});
  return `Red ball position set to x: ${x} and y: ${y}`;
}

export function getRedBallPosition(){
  const redBallState = useRedBallStore.getState();
  return `Red ball x position is ${redBallState.x}px and red ball y position is ${redBallState.y}px`;
}

export function getPlaygroundSize(){
  const playgroundState = usePlaygroundStore.getState();
  return `Playground width is ${playgroundState.width}px and playground height is ${playgroundState.height}px`;
}