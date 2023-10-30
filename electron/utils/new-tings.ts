/* protocol.registerFileProtocol('itsl-itslearning', (request, callback) => {
        const url = request.url.substr(18)
        callback({ path: path.normalize(`${__dirname}/${url}`) })
    }) */


// @ts-ignore
protocol.handle('itsl-itslearning', async (req) => {
    // const regex = /itsl-itslearning:\/\/login\/\?state=damn&code=(.*)/gm;
    const redirectURI = RegexEscape(`${ITSLEARNING_REDIRECT_URI}/?`)
    const stateCode = RegexEscape(ITSLEARNING_OAUTH_STATE)
    const states = RegexEscape(`state=${stateCode}&code=`)
    const escaped = redirectURI + states + '(.*)'
    const escapedRegex = new RegExp(escaped, 'gm')
    const matches = escapedRegex.exec(req.url)
    if (matches) {
        const deeplinkingUrl = matches[1]
        logEverywhere('protocol.handle# setting code to localStorage...')
        logEverywhere('protocol.handle# ' + 'code ' + deeplinkingUrl)

        logEverywhere('protocol.handle# requesting access_token...')
        console.log(deeplinkingUrl)

        axios.post(ITSLEARNING_OAUTH_TOKEN_URL, {
            "grant_type": GrantType.AUTHORIZATION_CODE,
            "code": deeplinkingUrl,
            "client_id": ITSLEARNING_CLIENT_ID,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }).then(res => {
            const {access_token, refresh_token} = res.data
            setToken('access_token', access_token)
            setToken('refresh_token', refresh_token)
            authWindow?.close()
            createWindow().then(() => win?.show())
        }).catch(err => {
            logEverywhereError('protocol.handle# ' + err)
        })
    } else {
        await authWindow?.loadURL(req.url)
        authWindow?.show()
    }
    // authWindow?.close()
    // authWindow?.destroy()
    // return Response.prototype
})