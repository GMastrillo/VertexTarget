// Image distortion fragment shader
varying vec2 vUv;

uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;
uniform vec3 uColor;

void main() {
  vec2 uv = vUv;
  
  // Mouse-driven wave distortion
  float dist = length(uv - uMouse);
  float wave = sin(dist * 20.0 - uTime * 3.0) * 0.02 * uHover;
  uv += wave;
  
  // Gradient with distortion
  float gradient = smoothstep(0.0, 1.0, uv.y + sin(uv.x * 6.28 + uTime) * 0.1);
  vec3 color = mix(uColor * 0.3, uColor, gradient);
  
  // Grid pattern overlay
  float gridX = step(0.98, fract(uv.x * 20.0));
  float gridY = step(0.98, fract(uv.y * 20.0));
  float grid = max(gridX, gridY) * 0.1 * uHover;
  
  color += grid;
  
  // Noise grain
  float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
  color += noise * 0.02;
  
  float alpha = 0.85 + uHover * 0.15;
  
  gl_FragColor = vec4(color, alpha);
}
