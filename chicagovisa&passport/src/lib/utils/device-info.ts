interface DeviceInfo {
  device: string;
  os: string;
  browser: string;
}

function getDeviceType(): string {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent.toLowerCase();
    return /mobile|android|iphone|ipad|ipod/.test(userAgent) ? "Mobile" : "PC";
  }
  return "";
}

function getOS(): string {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("win")) return "Windows";
    if (userAgent.includes("mac")) return "MacOS";
    if (userAgent.includes("linux")) return "Linux";
    if (userAgent.includes("android")) return "Android";
    if (/iphone|ipad|ipod/.test(userAgent)) return "iOS";
    return "Unknown OS";
  }
  return "";
}

function getBrowserInfo(): string {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent;
    let match =
      userAgent.match(
        /(chrome|firefox|safari|edge|opr|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];

    if (/trident/i.test(match[1])) {
      const ieVersion = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return `IE ${ieVersion[1] || ""}`;
    }

    if (match[1] === "Chrome") {
      const edgeOrOpera = userAgent.match(/\b(Edg|OPR)\/(\d+)/);
      if (edgeOrOpera) return edgeOrOpera.slice(1).join(" ");
    }

    match = match[2]
      ? [match[1], match[2]]
      : [navigator.appName, navigator.appVersion, "-?"];
    const version = userAgent.match(/version\/(\d+)/i);
    if (version) match.splice(1, 1, version[1]);

    return match.join(" ");
  }

  return "";
}

export function getUserDeviceInfo(): DeviceInfo {
  return {
    device: getDeviceType(),
    os: getOS(),
    browser: getBrowserInfo(),
  };
}
