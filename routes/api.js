require('dotenv').config()
const wallet = require('../src/wallets')
const wallets = require('../models/wallets')
const express = require('express')
const router  = express.Router()

router.get('/:ident/create', async function (req, res) {
    var doc = wallet.create(req.params.ident)
    wallets.create(doc, function (err, small) {
        if (err) {
            res.json({success: false, message: 'This identity has already created a wallet'})
        } else {
            delete doc.wif
            doc.success = true
            res.json(doc)
        }
    })
})

router.get('/:ident/receive', async function (req, res) {
    if(await wallet._exists(req.params.ident)) {
        var doc = await wallet.receive(req.params.ident)
        doc.success = true
        res.json(doc)
    } else {
        res.json({success: false, message: 'no wallet by that name'})
    }
})

router.get('/:ident/balance', async function (req, res) {
    if(await wallet._exists(req.params.ident)) {
        var doc = await wallet.balance(req.params.ident)
        doc.success = true
        res.json(doc)
    } else {
        res.json({success: false, message: 'no wallet by that name'})
    }
})

router.get('/:ident/send/:address/:amount', async function (req, res) {
    try {
        if(await wallet._exists(req.params.ident)) {
            var doc = await wallet.send(req.params.ident, req.params.address, req.params.amount)
            res.json(doc)
        } else {
            res.json({success: false, message: 'no wallet by that name'})
        }
    } catch (err) {
        // todo - give better failure messages
        console.error(err)
        if(err && err.details) {
            res.json({success: false, message: err.details})
        } else if(err && err.message) {
            res.json({success: false, message: err.message})
        }
    }
    
})

module.exports = router;
