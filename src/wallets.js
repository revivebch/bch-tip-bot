const bitcore = require('bitcore-lib-cash')
const wallets = require('../models/wallets')
const fetch = require('node-fetch')

let _sendraw = async function (rawtx) {
    var url = 'https://api.bitcore.io/api/BCH/mainnet/tx/send'
    var doc = {rawTx: rawtx}
    var txid = ''
    await fetch(url, {method: 'POST', body: JSON.stringify(doc), headers: { 'Content-Type': 'application/json' }}).then(r => r.json()).then(res => {
        txid = res
    })

    return txid
}

let _getutxo = async function (address) {
    var url = 'https://api.bitcore.io/api/BCH/mainnet/address/'+address+'/?unspent=true'
    var utxo = {
        ins: [],
        value: 0
    }

    await fetch(url).then(r => r.json()).then(res => {
        if(res[0]) {
            res.forEach(out => {
                // because apparantly ?unspent=true means nothing
                if(!out.spentTxid) {
                    var doc = {
                        "txId" : out.mintTxid,
                        "outputIndex" : out.mintIndex,
                        "address" : out.address,
                        "script" : out.script,
                        "satoshis" : out.value
                    }
                    utxo.ins.push(doc)
                    utxo.value += out.value
                }
            })
        }
    })
    return utxo
}

let exists = function (ident) {
    wallets.exists({ident: ident}, function (err, doc) {
        if (err) {
            console.log('[ERROR]', err)
            return false
        } else {
            if(doc) {
                return doc
            } else {
                return 'false'
            }
        }
    })
}

let create = function (ident) {
    var private = new bitcore.PrivateKey()
    var wif = private.toWIF()
    var address = private.toAddress()

    var doc = {
        wif: wif,
        address: address.toString(bitcore.Address.CashAddrFormat),
        ident: ident
    }
    return doc
}

let receive = async function (ident) {
    var data = await wallets.find({ ident: ident}).exec();
    if (data && data[0] && data[0].address && data[0].wif && data[0].ident) {
        var doc = {
            address: data[0].address,
            ident: data[0].ident
        }
        return doc
    } else {
        return false
    }
}

let send = async function (ident, recipient, amount) {
    var data = await wallets.find({ident: ident}).exec()
    var sender = data[0].address.split(':')[1]
    var privateKey = new bitcore.PrivateKey(data[0].wif)
    var utxo = await _getutxo(sender)
    var transaction = new bitcore.Transaction()
    .from(utxo.ins)
    .to(recipient, parseInt(amount))
    .fee(420)
    .change(sender)
    .sign(privateKey)
    .serialize()
    var txid = await _sendraw(transaction)

    return txid
}

module.exports = {
    create, send, receive, exists
}

