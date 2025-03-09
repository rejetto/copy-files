'use strict';{
    const { onlyFor } = HFS.getPluginConfig()
    const { h, state } = HFS

    HFS.onEvent('fileMenu', ({ entry }) =>
        (!onlyFor?.length || onlyFor.some(HFS.userBelongsTo))
        && !entry.isFolder
        && [{ id: 'copy', icon: 'paste', label: "Copy", onClick() {
            state.clip = [entry]
            state.clip.__copy = true
        } }])

    HFS.onEvent('paste', ({ from, to }, { preventDefault }) => {
        const {clip} = state
        if (!clip.__copy) return // not for this plugin
        preventDefault()
        HFS.apiCall('copy_files', {
            uri_from: from.map(x => x.uri),
            uri_to: to,
        }).then(res => {
            const bad = _.sumBy(res.errors, x => x ? 1 : 0)
            HFS.toast(h('div', {},
                HFS.t('copy_good_bad', { bad, good: clip.length - bad }, "{good} copied, {bad} failed"),
                h('ul', {}, res.errors?.map(((e, i) => {
                    e = HFS.misc.xlate(e, HFS.misc.HTTP_MESSAGES)
                    return e && h('li', {}, clip[i].name + ': ' + e)
                }))),
            ), bad ? 'warning' : 'info')
            clip.length = 0
            HFS.reloadList()
        }, HFS.dialogLib.alertDialog)
    })
}
