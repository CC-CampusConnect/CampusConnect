$input v_texcoord0, worldVertexPosition, worldNormalDirection, v_normal, v_tangent, v_bitangent, v_position

#include "common.sh"

SAMPLER2D(s_texColor, 0);
SAMPLER2D(s_texNormal, 1);
SAMPLER2D(s_texMult, 2);

uniform vec4 u_color;

vec2 matcap(vec3 eye, vec3 normal) {
  vec3 r = reflect(eye, normal);
  float m = 2.0 * sqrt(r.x*r.x+r.y*r.y+(r.z+1.0)*(r.z+1.0));
  vec2 uv =  r.xy / m + 0.5;
  return uv;
}

vec3 cameraPosition = vec3(0.0 ,0.0 ,0.0 );

void main()
{
  mat3 tbn = mat3(
    normalize(v_tangent),
    normalize(v_bitangent),
    normalize(v_normal)
  );
  vec3 normalIn = texture2D(s_texNormal, v_texcoord0).xyz;
  normalIn = normalize (normalIn * 2.0 - 1.0); 
 
  vec3 finalNormal = mul(tbn, normalIn);
  
  vec3 normal=normalize(finalNormal);
  vec3 eye=normalize(cameraPosition - worldVertexPosition);

  vec2 uv = matcap(eye, normal).xy;
  vec4 mulcolor = texture2D(s_texMult, v_texcoord0);

  vec4 matcapOut = vec4(texture2D(s_texColor, uv).rgb, 1.0) * u_color * mulcolor;
  gl_FragColor = matcapOut;
}
