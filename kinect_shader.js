// use like:
// <a-entity material="shader: kinect-depth; src: #myvideo; depthParams: 1.0 0.2 0.4 0.5"></a-entity>
AFRAME.registerShader('kinect-shader', {
  schema: {
    src: {type: 'map', is: 'uniform'},
    depthParams: {type: 'vec4', is: 'uniform'}
  },

  vertexShader: [
    'uniform sampler2D src;',
    'varying vec2 vUV;',
    'void main(void) {',
    '  vec4 worldPos = modelMatrix * vec4(position, 1.0);',
    '  vec2 depthUV = vec2(uv.x*0.5 + 0.5, uv.y);',
    // this might not compile v because need to specify mip level
     //might be texture2DLOD(src, uv, mip)
    '  vec4 rawEncodedDepth = texture2DLod(src, depthUV, 0.0);',
    '  float worldDepth = 0.3529412 / (rawEncodedDepth.x + 0.1764);',
    '  vec4 basePos = vec4(position.xy, -.5, 1.0);',
     //want (basePos * mult).z = worldDepth
    //       mult = worldDepth / basePos.z
    '  float mult = worldDepth / basePos.z;',
    '  basePos.xyz *= mult;',
    '  gl_Position = projectionMatrix * modelViewMatrix * basePos;',
    '  vUV = vec2(uv.x * 0.5, uv.y);',
    '}'
  ].join('\n'),

  fragmentShader: [
    'uniform sampler2D src;',
    'varying vec2 vUV;',
    'void main() {',
    '  gl_FragColor.rgb = texture2D(src, vUV).rgb;',
    '  gl_FragColor.a = 1.0;',
    '}'
  ].join('\n')
});

AFRAME.registerShader('kinect-uv', {
  schema: {
    src: {type: 'map', is: 'uniform'}
  },

  vertexShader: [
    'varying vec2 vUV;',
    'varying vec3 worldViewDir;',
    'void main(void) {',
    '  vec4 worldPos = modelMatrix * vec4(position, 1.0);',
    '  worldViewDir = worldPos.xyz - cameraPosition;',
    '  gl_Position = worldViewProj * position;',
    '  vUV = uv;',
    '}'
  ].join('\n'),

  fragmentShader: [
    'uniform sampler2D src;',
    'varying vec2 vUV;',
    'varying vec3 worldViewDir;',
    'void main() {',
    '  gl_FragColor.rgb = vec3(vUV.xy, 1.0);',
    '  gl_FragColor.a = 1.0;',
    '}'
  ].join('\n')
});