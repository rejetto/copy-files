exports.version = 1.22
exports.description = "Copy files"
exports.apiRequired = 9.2 // copy_files
exports.frontend_js = "main.js"
exports.repo = "rejetto/copy-files"
exports.preview = ["https://github.com/user-attachments/assets/f15c696e-825b-4831-adaf-e167faf1e02a","https://github.com/user-attachments/assets/b3a5be7c-74b9-4b9e-9424-bed9612560a6"]

exports.config = {
    onlyFor: {
        frontend: true,
        type: 'username',
        multiple: true,
        label: "Show only for",
        helperText: "Leave empty to allow everyone",
    },
}
