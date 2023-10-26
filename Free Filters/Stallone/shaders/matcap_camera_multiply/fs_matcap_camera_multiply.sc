$input v_texcoord0, v_texcoord1, worldVertexPosition, worldNormalDirection, v_normal, v_tangent, v_bitangent, v_position

#include "common.sh"

SAMPLER2D(s_texCamera, 0);
SAMPLER2D(s_texDiffuseMultiply, 1);

SAMPLER2D(s_texMatcapInput, 2);
SAMPLER2D(s_texMatcapNormal, 3);
SAMPLER2D(s_texMatcapMult, 4);

uniform vec4 u_multiplyColor;
uniform vec4 u_matcapColor;


vec2 matcap(vec3 eye, vec3 normal) {
  vec3 r = reflect(eye, normal);
  float m = 2.0 * sqrt(r.x*r.x+r.y*r.y+(r.z+1.0)*(r.z+1.0));
  vec2 uv =  r.xy / m + 0.5;
  return uv;
}

vec3 cameraPosition = vec3(0.0 ,0.0 ,0.0 );

void main() {

  vec4 multiplyPass = texture2D(s_texCamera, v_texcoord1) * u_multiplyColor;
  vec4 mult = texture2D(s_texDiffuseMultiply, v_texcoord0);
  multiplyPass.rgb = multiplyPass.rgb*mult.rgb*u_multiplyColor.rgb;
  multiplyPass.a = mult.a*u_multiplyColor.a;

  mat3 tbn = mat3(
    normalize(v_tangent),
    normalize(v_bitangent),
    normalize(v_normal)
  );
  vec3 normalIn = texture2D(s_texMatcapNormal, v_texcoord0).xyz;
  normalIn = normalize (normalIn * 2.0 - 1.0); 
 
  vec3 finalNormal = mul(tbn, normalIn);
  
  vec3 normal=normalize(finalNormal);
  vec3 eye=normalize(cameraPosition - worldVertexPosition);

  vec2 uv = matcap(eye, normal).xy;
  vec4 mulcolor = texture2D(s_texMatcapMult, v_texcoord0);

  vec4 matcapPass = vec4(texture2D(s_texMatcapInput, uv).rgb, 1.0) * u_matcapColor * mulcolor;

  gl_FragColor = 1.0 - (1.0 - multiplyPass)*(1.0 - matcapPass);

}
