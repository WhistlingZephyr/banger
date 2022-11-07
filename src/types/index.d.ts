type RequestDetails = Parameters<Parameters<typeof browser.webRequest.onBeforeRequest.addListener>[0]>[0];
