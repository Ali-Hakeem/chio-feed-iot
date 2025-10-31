let servoState = false;

export default function handler(req, res) {
  res.status(200).json({ rotate: servoState });
}

// fungsi untuk dipakai di rotate.js
export function setServoState(state) {
  servoState = state;
}
