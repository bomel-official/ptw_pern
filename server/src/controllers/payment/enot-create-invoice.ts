import { Invoice, Participant, Tournament } from "@core";
import { getEnv } from "@libs";
import axios from "axios";

export async function enotCreateInvoice( participantId: number ) {
    const participant = await Participant.findByPk( participantId );
    if ( !participant ) {
        return { invoice: null, participant };
    }

    const tournament = await Tournament.findByPk( participant.tournamentId );
    if ( !tournament ) {
        return { invoice: null, participant };
    }

    const newInvoice = await Invoice.create( {
        amount: tournament.participationPrice
    } );

    const { data: enotInvoice } = await axios.post(
        "https://api.enot.io/invoice/create", {
            amount: tournament.participationPrice,
            order_id: "invoice-" + JSON.stringify( newInvoice.id ),
            currency: newInvoice.currency,
            shop_id: getEnv( process.env.ENOT_SHOP_ID ),
            hook_url: `${ getEnv(
                process.env.CLIENT_URL ) }/tournament/${ tournament.slug }`,
            comment: `Participation on ${ tournament.title_EU }`,
            success_url: `${ getEnv(
                process.env.CLIENT_URL ) }/tournament/${ tournament.slug }`,
            fail_url: `${ getEnv(
                process.env.CLIENT_URL ) }/tournament/${ tournament.slug }`,
            expire: 5760,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept-Encoding": "application/json",
                "Accept": "application/json",
                "x-api-key": getEnv( process.env.ENOT_SECRET_KEY )
            }
        } );

    newInvoice.enotId = enotInvoice.data.id;
    newInvoice.url = enotInvoice.data.url;
    newInvoice.participantId = participant.id;
    newInvoice.expired = enotInvoice.data.expired.replace( " ", "T" );
    participant.invoiceUrl = enotInvoice.data.url;
    participant.invoiceId = newInvoice.id;

    await participant.save();
    await newInvoice.save();

    return { invoice: newInvoice, participant };
}
