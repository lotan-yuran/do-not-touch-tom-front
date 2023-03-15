import { dataOs, dataBrowser, byChecking } from "../constants/infoBrowser";

function matchItem(string, data) {
  var i = 0,
    j = 0,
    regex,
    regexv,
    match,
    matches,
    version;

  for (i = 0; i < data.length; i += 1) {
    regex = new RegExp(data[i].value, "i");
    match = regex.test(string);
    if (match) {
      regexv = new RegExp(data[i].version + "[- /:;]([\\d._]+)", "i");
      matches = string.match(regexv);
      version = "";
      if (matches) {
        if (matches[1]) {
          matches = matches[1];
        }
      }
      if (matches) {
        matches = matches.split(/[._]+/);
        for (j = 0; j < matches.length; j += 1) {
          if (j === 0) {
            version += matches[j] + ".";
          } else {
            version += matches[j];
          }
        }
      } else {
        version = "0";
      }
      return {
        name: data[i].name,
        version: parseFloat(version)
      };
    }
  }
  return { name: "unknown", version: 0 };
}

export function getInfoBrowser() {
    const agent = byChecking.join(" "),
    os = matchItem(agent, dataOs),
    browser = matchItem(agent, dataBrowser);

  const allInfo = 
  `navigator.userAgent = ${navigator.userAgent}
   navigator.appVersion = ${navigator.appVersion}
   navigator.platform = ${navigator.platform}
   navigator.vendor = ${navigator.vendor}`

  return { os, browser, allInfo };
}
