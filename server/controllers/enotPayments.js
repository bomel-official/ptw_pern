const {Participant, Invoice, Tournament} = require("../models/models");
const axios = require("axios");


async function checkIsPaid(participantId) {
    const participant = await Participant.findByPk(participantId)
    const invoices = await Invoice.findAll({
        where: {
            participantId: participant.id
        }
    })

    for (const invoice of invoices) {
        const {data: enotInvoiceInfo} = await axios.get(`https://api.enot.io/invoice/info?order_id=${JSON.stringify(invoice.id)}&shop_id=${process.env.ENOT_SHOP_ID}&invoice_id=${invoice.enotId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json',
                'Accept': 'application/json',
                'x-api-key': process.env.ENOT_SECRET_KEY
            }
        })
        if (enotInvoiceInfo.data.status === 'success') {
            participant.isPaid = true
            await participant.save()

            return true
        }
    }
    return false
}

async function createInvoice(participantId) {
    const participant = await Participant.findByPk(participantId)
    const tournament = await Tournament.findByPk(participant.tournamentId)

    const newInvoice = await Invoice.create({
        amount: tournament.participationPrice
    })

    const {data: enotInvoice} = await axios.post('https://api.enot.io/invoice/create', {
        amount: tournament.participationPrice,
        order_id: 'invoice-' + JSON.stringify(newInvoice.id),
        currency: newInvoice.currency,
        shop_id: process.env.ENOT_SHOP_ID,
        hook_url: `${process.env.CLIENT_URL}/tournament/${tournament.slug}`,
        comment: `Participation on ${tournament.title_EU}`,
        success_url: `${process.env.CLIENT_URL}/tournament/${tournament.slug}`,
        fail_url: `${process.env.CLIENT_URL}/tournament/${tournament.slug}`,
        expire: 5760,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/json',
            'Accept': 'application/json',
            'x-api-key': process.env.ENOT_SECRET_KEY
        }
    })


    newInvoice.enotId = enotInvoice.data.id
    newInvoice.url = enotInvoice.data.url
    newInvoice.participantId = participant.id
    newInvoice.expired = enotInvoice.data.expired.replace(' ', 'T')
    participant.invoiceUrl = enotInvoice.data.url
    participant.invoiceId = newInvoice.id

    await participant.save()
    await newInvoice.save()

    return {invoice: newInvoice, participant}
}

module.exports = {
    checkIsPaid,
    createInvoice
}