import React, { useState, useEffect} from 'react'
function hexToRGB(hex) {
    let r = 0;
    let g = 0;
    let b = 0;
    if (hex.startsWith('#')) {
        hex=hex.slice(1);
    }
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    }
    else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    }
    else {
        return null;
    }
    return { r, g, b };
}

function srgbToLinear(colorComponent) {
    if (colorComponent <= 0.03928) {
        return colorComponent / 12.92;
    }
    else {
        return Math.pow((colorComponent + 0.055) / 1.055, 2.4);
    }
}
function getLuminance(r, g, b) {
    return (0.2126 * srgbToLinear(r / 255)) +
        (0.7152 * srgbToLinear(g / 255)) +
        (0.0722 * srgbToLinear(b / 255));
}
function getContrastRatio(lum1, lum2) {
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}
function getOptimalTextColor(hexBackgroundColor){
    const rgb=hexToRGB(hexBackgroundColor);
    if(!rgb){
        return '#000000';
    }

    const luminanceBg = getLuminance(rgb.r,rgb.g,rgb.b);

    const luminanceBlack = getLuminance(0, 0, 0);
    const luminanceWhite = getLuminance(255, 255, 255);

    const contrastWithBlack = getContrastRatio(luminanceBg, luminanceBlack);
    const contrastWithWhite = getContrastRatio(luminanceBg, luminanceWhite);

    if(contrastWithWhite>=contrastWithBlack){
        return '#FFFFFF';
    }
    else{
        return '#000000';
    }
}
function ColorPicker() {

    const [color, setColor] = useState("#000000");
    const[textColor,setTextColor]= useState("#FFFFFF");

    function handleColorChange(event) {
        setColor(event.target.value);
    }
    useEffect(()=>{
        setTextColor(getOptimalTextColor(color));
    },[color]);
    return (
        <div className="color-picker-container">
            <h1>Color Picker</h1>
            <div className="color-display" style={{ backgroundColor: color }}>
                <p style={{ color: textColor }}>Selected Color: {color}</p>
            </div>
            <label>Select a Color:</label>
            <input type="color" value={color} onChange={handleColorChange} />
        </div>
    )
}
export default ColorPicker