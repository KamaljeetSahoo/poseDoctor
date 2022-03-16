export function calculateAngles(a, b, c) {
  
	  var radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
	  var angle = Math.abs(radians * 180.0 / Math.PI);
  
	  if (angle > 180.0)
		angle = 360 - angle;
	  return Math.round(angle);
	}