exports.version = 1
exports.description = "Copy files"
exports.apiRequired = 9.1 // HFS.userBelongsTo
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

exports.init = api => {
    const { urlToNode, statusCodeForMissingPerm } = api.require('./vfs')
    const { HTTP_NOT_FOUND, HTTP_BAD_REQUEST } = api.require('./misc')
    const { copyFile } = api.require('fs/promises')
    const { join, basename } = api.require('path')
    return {
        customRest: {
            async copy_files({ uri_from, uri_to }, ctx) {
                ctx.logExtra(null, { target: uri_from.map(decodeURI), destination: decodeURI(uri_to) })
                const destNode = await urlToNode(uri_to, ctx)
                const err = !destNode ? HTTP_NOT_FOUND : statusCodeForMissingPerm(destNode, 'can_upload', ctx)
                if (err)
                    throw err
                return {
                    errors: await Promise.all(uri_from.map(async src => {
                        if (typeof src !== 'string') return HTTP_BAD_REQUEST
                        const srcNode = await urlToNode(src, ctx)
                        if (!srcNode) return HTTP_NOT_FOUND
                        const s = srcNode.source
                        const d = join(destNode.source, basename(srcNode.source))
                        return copyFile(s, d).catch(e => e.code || String(e))
                    }))
                }
            }
        }
    }
}