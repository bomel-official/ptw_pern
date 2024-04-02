const {Participant, Invoice, Tournament} = require("../models/models");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');


async function checkIsPaid(participantId) {
    const participant = await Participant.findByPk(participantId)
    const invoices = await Invoice.findAll({
        where: {
            participantId: participant.id
        }
    })

    for (const invoice of invoices) {
        const {data: yookassaInvoiceInfo} = await axios.get(`https://api.yookassa.ru/v3/payments/${invoice.enotId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json',
                'Accept': 'application/json',
            },
            auth: {
                username: process.env.YOOKASSA_SHOP_ID,
                password: process.env.YOOKASSA_SECRET_KEY,
            }
        })
        if (yookassaInvoiceInfo.status === 'succeeded' && yookassaInvoiceInfo.isPaid === true) {
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
        amount: tournament.participationPrice,
        currency: 'RUB',
    })

    const {data: yookassaInvoice} = await axios.post('https://api.yookassa.ru/v3/payments', {
        amount: {
            currency: newInvoice.currency,
            value: tournament.participationPrice
        },
        capture: true,
        confirmation: {
            type: "redirect",
            return_url: `${process.env.CLIENT_URL}/tournament/${tournament.slug}`,
        },
        description: `Participation on ${tournament.title_EU}`,
        metadata: {
            order_id: 'invoice-' + JSON.stringify(newInvoice.id),
        }
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/json',
            'Accept': 'application/json',
            'Idempotence-Key': uuidv4(),
        },
        auth: {
            username: process.env.YOOKASSA_SHOP_ID,
            password: process.env.YOOKASSA_SECRET_KEY,
        }
    })

    newInvoice.enotId = yookassaInvoice.id
    newInvoice.url = yookassaInvoice.confirmation.confirmation_url
    newInvoice.participantId = participant.id
    newInvoice.expired = tournament.dateEnd
    participant.invoiceUrl = yookassaInvoice.confirmation.confirmation_url
    participant.invoiceId = newInvoice.id

    await participant.save()
    await newInvoice.save()

    return {invoice: newInvoice, participant}
}

module.exports = {
    checkIsPaid,
    createInvoice
}