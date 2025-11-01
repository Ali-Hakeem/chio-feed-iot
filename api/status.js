let servoState = false;

export default function handler(req, res) {
  res.status(200).json({ rotate: servoState });
}

export function setServoState(state) {
  servoState = state;
}
