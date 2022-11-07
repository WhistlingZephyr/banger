const trackers = [{
    filename: "static/manifest.json",
    type: "json",
}, {
    filename: "package.json",
    type: "json",
}];

module.exports = {
    bumpFiles: trackers,
    packageFiles: trackers,
};
