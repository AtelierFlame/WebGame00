//uniform sampler2D CC_Texture0;
varying vec2  v_texCoord;
void main()
{
    vec4 v_orColor = texture2D(CC_Texture0, v_texCoord);
    float alpha;
    if(v_orColor.r > v_orColor.g)
    {
        if(v_orColor.r > v_orColor.b)
        {
            alpha = v_orColor.r;
        }
        else
        {
            alpha = v_orColor.b;
        }
    }
    else
    {
        if(v_orColor.g > v_orColor.b)
        {
            alpha = v_orColor.g;
        }
        else
        {
            alpha = v_orColor.b;
        }
    }
    gl_FragColor = vec4(v_orColor.r, v_orColor.g, v_orColor.b, alpha);
}