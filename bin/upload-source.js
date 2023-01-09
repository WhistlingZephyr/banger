const jwt = require("jsonwebtoken");
const fs = require("fs");

const manifest = require("../static/manifest.json");
const uuid = manifest.browser_specific_settings.gecko.id;
const version = manifest.version;

if (!process.env.WEB_EXT_API_KEY) {
    throw new Error("WEB_EXT_API_KEY and not provided");
}
if (!process.env.WEB_EXT_API_SECRET) {
    throw new Error("WEB_EXT_API_SECRET not provided");
}
if (!uuid) {
    throw new Error(
        "Invalid UUID in manifest.browser_specific_settings.gecko.id"
    );
}
if (!version) {
    throw new Error("Invalid version in manifest.version");
}

const source = fs.readFileSync("source.zip");

const issuedAt = Math.floor(Date.now() / 1000);
const payload = {
    iss: process.env.WEB_EXT_API_KEY,
    jti: Math.random().toString(),
    iat: issuedAt,
    exp: issuedAt + 60,
};

const secret = process.env.WEB_EXT_API_SECRET;
const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
});
const headers = {
    Authorization: `JWT ${token}`,
};
const data = new FormData();

data.append("source", new Blob([source]), "source.zip");
(async () => {
    const versions = await (
        await fetch(
            "https://addons.mozilla.org/api/v5/addons/addon/banger/versions/?filter=all_with_unlisted",
            {
                headers,
            }
        )
    ).json();
    const id = versions.results.find(item => item.version === version)?.id;
    if (!id) {
        throw new Error(`Version ${version} not found`);
    }
    const body = await fetch(
        `https://addons.mozilla.org/api/v5/addons/addon/banger/versions/${id}`,
        {
            method: "PATCH",
            headers,
            body: data,
        }
    );
    console.log(await body.text());
})();
