exports.version = 1.1
exports.description = "Copy files"
exports.apiRequired = 9.2 // copy_files
exports.frontend_js = "main.js"
exports.repo = "rejetto/copy-files"

exports.config = {
    onlyFor: {
        frontend: true,
        type: 'array',
        label: "Show only for",
        fields: { username: { type: 'username' } },
        helperText: "Leave empty to allow everyone",
    },
}
