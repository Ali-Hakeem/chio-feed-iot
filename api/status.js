let servoAction = false;

export default function handler(req, res) {
  res.status(200).json({ rotate: servoAction });
}

// kita perlu ekspor fungsi untuk dipakai di rotate.js
export function setServoState(state) {
  servoAction = state;
}
