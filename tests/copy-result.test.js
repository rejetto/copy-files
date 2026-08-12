const assert = require('node:assert/strict')
const test = require('node:test')

test('shows copy results without relying on a global lodash', async () => {
    const events = {}
    const clip = []
    let toast
    let reloaded = false
    global.HFS = {
        getPluginConfig: () => ({ onlyFor: [] }),
        h: (tag, props, ...children) => ({ tag, props, children }),
        state: { clip },
        onEvent: (name, cb) => events[name] = cb,
        apiCall: async () => ({ errors: [null, 'not found'] }),
        toast: content => toast = content,
        t: (_, values) => `${values.good} copied, ${values.bad} failed`,
        misc: { xlate: x => x, HTTP_MESSAGES: {} },
        reloadList: () => reloaded = true,
        dialogLib: { alertDialog() {} },
    }
    delete global._
    delete require.cache[require.resolve('../dist/public/main.js')]

    try {
        require('../dist/public/main.js')
        clip.push({ name: 'good' }, { name: 'bad' })
        clip.__copy = true
        events.paste({ from: clip, to: '/' }, { preventDefault() {} })
        await new Promise(setImmediate)

        assert.equal(toast.children[0], '1 copied, 1 failed')
        assert.equal(clip.length, 0)
        assert.equal(reloaded, true)
    }
    finally {
        delete global.HFS
    }
})
