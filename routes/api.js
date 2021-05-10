require('dotenv').config()
const wallet = require('../src/wallets')
const wallets = require('../models/wallets')
const express = require('express')
const router  = express.Router()

router.get('/:ident/create', async function (req, res) {
    var doc = wallet.create(req.params.ident)
    if(!wallet._exists(req.params.ident)) {
        wallets.create(doc, function (err, small) {
            if (err) {
                res.json({error: 'WALLET_EXISTS', message: 'This identity has already created a wallet'})
            } else {
                delete doc.wif
                res.json(doc)
            }
        })
    }
})

router.get('/:ident/receive', async function (req, res) {
    var doc = await wallet.receive(req.params.ident)
    if(doc) {
        res.json(doc)
    } else {
        res.json({error: 'NO_SUCH_WALLET', message: 'no wallet by that name'})
    }
})

router.get('/:ident/send/:address/:amount', async function (req, res) {
    try {
        var doc = await wallet.send(req.params.ident, req.params.address, req.params.amount)
        console.log(doc)
        if(doc) {
            res.json(doc)
        } else {
            res.json({error: 'NO_SUCH_WALLET', message: 'no wallet by that name'})
        }
    } catch (err) {
        //todo: specific error messages
        res.json({error: 'SEND_FAIL', reason: 'failed to send transaction'})
    }
    
})

module.exports = router;
