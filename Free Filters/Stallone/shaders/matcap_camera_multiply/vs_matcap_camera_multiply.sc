$input a_position, a_normal, a_texcoord0, a_texcoord1, a_tangent
$output v_texcoord0, v_texcoord1, worldVertexPosition, worldNormalDirection, v_position, v_normal, v_tangent, v_bitangent

#include "common.sh"

void main()
{
	v_position = a_position;
	worldVertexPosition=(mul(u_modelView,vec4(a_position,1.0))).xyz;
	worldNormalDirection= mul (mat3(u_modelView),a_normal.xyz);

	v_normal = worldNormalDirection;
	v_tangent = mul(mat3(u_modelView), a_tangent.xyz);
	v_bitangent = cross(v_normal, v_tangent) * a_tangent.w;;
    
    v_texcoord0 = a_texcoord0;
    v_texcoord1 = a_texcoord1;
 	gl_Position= mul(u_modelViewProj,vec4(a_position,1.0));
}
