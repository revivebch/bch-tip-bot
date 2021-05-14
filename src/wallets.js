const bitcore = require('bitcore-lib-cash')
const wallets = require('../models/wallets')
const GrpcClient = require('grpc-bchrpc-node')
const grpc = new GrpcClient.GrpcClient({ url: 'bchd.fountainhead.cash:443' })

let _sendraw = async function (rawtx) {
    var doc = {}
    await grpc.submitTransaction({txnHex: rawtx}).then(res => {
        doc.success = true
        doc.txid = Buffer.from(res.getHash_asU8().reverse()).toString('hex')
    })
    if(doc.success) {return doc} else {return false}
}

let _getutxo = async function (address) {
    var utxo = {ins: [], balance: 0}
    await grpc.getAddressUtxos({address: address, includeMempool: true}).then(res => {
        res.getOutputsList().forEach(output => {
            const outpoint = output.getOutpoint()
            var doc = {
                "txId": Buffer.from(outpoint.getHash_asU8().reverse()).toString('hex'),
                "outputIndex": outpoint.getIndex(),
                "address" : address,
                "script" : Buffer.from(output.getPubkeyScript_asU8()).toString('hex'),
                "satoshis" : output.getValue(),
            }
            utxo.ins.push(doc)
            utxo.balance += output.getValue()
        })
    })
    return utxo
}

let _exists = async function (ident) {
    var data = await wallets.find({ ident: ident}).exec()
    if (data && data[0]) {return true} else {return false}
}

let _getfee = function (ins, outs, mod = 0) {
    var fee = 0
    fee = (fee + (175 * ins))
    fee = (fee + (40 * outs))
    fee = (fee + mod)
    return (fee + 50)
}

let _getscript = function(options) {
    var script = null
    if (options) {
        if (Array.isArray(options)) {
            script = new bitcore.Script()
            script.add(bitcore.Opcode.OP_RETURN)
            options.forEach(function(item) {
                if (/^0x/i.test(item)) {
                    script.add(Buffer.from(item.slice(2), "hex"))
                } else {
                    script.add(Buffer.from(item))
                }
            })
        } else if (typeof options === 'string') {
            script = bitcore.Script.fromHex(options)
        }
    }
    return script
}

let balance = async function (ident) {
    var data = await wallets.find({ident: ident}).exec()
    var doc = {
        address: data[0].address,
        balance: (await _getutxo(data[0].address)).balance
    }
    return doc
}

let create = function (ident) {
    var private = new bitcore.PrivateKey()
    var doc = {
        wif: private.toWIF(),
        address: private.toAddress().toString(bitcore.Address.CashAddrFormat),
        ident: ident
    }
    return doc
}

let receive = async function (ident) {
    var data = await wallets.find({ ident: ident}).exec()
    if (data && data[0] && data[0].address && data[0].wif && data[0].ident) {
        var doc = {
            address: data[0].address,
            ident: data[0].ident
        }
        return doc
    } else {return false}
}

let send = async function (ident, recipient, amount) {
    var data = await wallets.find({ident: ident}).exec()
    var sender = data[0].address.split(':')[1]
    var privateKey = new bitcore.PrivateKey(data[0].wif)
    var utxo = await _getutxo(sender)
    var fee = _getfee(utxo.ins.length, 2)
    var script =  _getscript(['0x10746970', ident])
    var transaction = new bitcore.Transaction()
    .from(utxo.ins)
    .addOutput(new bitcore.Transaction.Output({ script: script, satoshis: 0 }))
    .to(recipient, parseInt(amount))
    .fee(fee + 500)
    .change(sender)
    .sign(privateKey)
    .serialize()
    var txid = await _sendraw(transaction)
    return txid
}



module.exports = {
    create, send, receive, balance, _exists, _getutxo, _sendraw
}

