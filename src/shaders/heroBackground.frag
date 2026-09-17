// Hero background fragment shader
varying vec2 vUv;
varying float vElevation;

uniform float uTime;
uniform vec3 uColorA;  // Cyan
uniform vec3 uColorB;  // Violet
uniform float uOpacity;

void main() {
  // Dynamic gradient based on position, time, and elevation
  float mixFactor = vUv.x * 0.5 + vUv.y * 0.3 + sin(uTime * 0.5) * 0.2;
  mixFactor += vElevation * 1.5;
  mixFactor = clamp(mixFactor, 0.0, 1.0);
  
  vec3 color = mix(uColorA, uColorB, mixFactor);
  
  // Add subtle pulsing glow
  float glow = sin(uTime * 0.8 + vUv.x * 3.14) * 0.1 + 0.9;
  color *= glow;
  
  // Vignette
  float vignette = 1.0 - smoothstep(0.3, 0.9, length(vUv - 0.5));
  
  gl_FragColor = vec4(color, uOpacity * vignette * 0.7);
}
