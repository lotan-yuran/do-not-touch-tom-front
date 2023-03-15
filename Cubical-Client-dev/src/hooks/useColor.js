import { useState, useEffect } from "react";

export function useColor(color) {
  const [colors, setColors] = useState({
    dark: undefined,
    normal: undefined
  });
  useEffect(() => {
    if (color) {
      const normal = managementConvertColor(color);
      setColors({
        normal,
        dark: darkColor(normal)
      });
    }
  }, [color]);

  return colors;
}

function darkColor(color) {
  const regexIsTypeColorRGBA = /(rgba\((\d{1,3}%?,\s?){3}(1|0|0?\.\d+)\))/gi;
  if (!regexIsTypeColorRGBA.test(color.replace(/\s/g, ''))) {
    throw new Error("Color is not type of RGBA: " + color);
  }
  const sep = color.replace(/\s/g, '').indexOf(",") > -1 ? "," : " ";
  color = color.substr(4).split(")")[0].split(sep);

  return `rgba${color[0]}, ${color[1]}, ${color[2]}, ${Number(color[3]) + (Number(color[3]) === 0 ? 0.03 : 0.16)})`;
}

function managementConvertColor(color) {
  const typesColor = /(#([\da-f]{3}){1,2}|(rgb|hsl)a\((\d{1,3}%?,\s?){3}(1|0|0?\.\d+)\)|(rgb|hsl)\(\d{1,3}%?(,\s?\d{1,3}%?){2}\))/gi;
  if (!typesColor.test(color.replace(/\s/g, ''))) {
    throw new Error("Invalid color: " + color);
  }
  switch (color.toLowerCase().split(/[\da-f]{3}|\(/)[0]) {
    case "#":
      return HEXToRGBA(color);
    case "hsl":
    case "hsla":
      return HSLToRGBA(color);
    case "rgb":
        return RGBToRGBA(color);
    case "rgba":
        return color
    default:
      return null;
  }
}

function RGBToRGBA(rgb) {
  const sep = rgb.replace(/\s/g, '').indexOf(",") > -1 ? "," : " ";
  rgb = rgb.substr(4).split(")")[0].split(sep);
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.8)`;
}

function HSLToRGBA(hsl) {
  const sep = hsl.trim().indexOf(",") > -1 ? "," : " ";
  hsl = hsl.substr(4).split(")")[0].split(sep);

  let h = hsl[0],
    s = hsl[1].substr(0, hsl[1].length - 1) / 100,
    l = hsl[2].substr(0, hsl[2].length - 1) / 100;

  if (h.indexOf("deg") > -1) {
    h = h.substr(0, h.length - 3);
  } else if (h.indexOf("rad") > -1) {
    h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
  } else if (h.indexOf("turn") > -1) {
    h = Math.round(h.substr(0, h.length - 4) * 360);
  }
  // Keep hue fraction of 360 if ending up over
  if (h >= 360) {
    h %= 360;
  }

  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `rgba(${r}, ${g}, ${b}, 0.8)`;
}

function HEXToRGBA(h) {
  let r = 0,
    g = 0,
    b = 0;

  // 3 digits
  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];

    // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return `rgba(${+r}, ${+g}, ${+b}, 0.8)`;
}
