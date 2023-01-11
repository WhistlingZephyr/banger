const trackers = [
    {
        filename: "static/manifest.json",
        type: "json",
    },
    {
        filename: "package.json",
        type: "json",
    },
    {
        filename: ".version",
        type: "plain-text",
    },
];

module.exports = {
    bumpFiles: trackers,
    packageFiles: trackers,
};
