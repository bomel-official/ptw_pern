import { Invoice, Participant } from "@core";
import { getEnv } from "@libs";
import axios from "axios";
import { WhereOptions } from "sequelize";

export async function enotGetStatus( participantId: number ) {
    const participant = await Participant.findByPk( participantId );
    if ( !participant ) {
        return false;
    }

    const invoices = await Invoice.findAll( {
        where: {
            participantId: participant.id
        } as WhereOptions
    } );

    for ( const invoice of invoices ) {
        const searchParams = new URLSearchParams( {
            order_id: invoice.id.toString(),
            shop_id: getEnv( process.env.ENOT_SHOP_ID ),
            invoice_id: invoice.enotId ?? '',
        } );
        const { data: enotInvoiceInfo } = await axios.get(
            `https://api.enot.io/invoice/info?${ searchParams.toString() }`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Encoding": "application/json",
                    "Accept": "application/json",
                    "x-api-key": getEnv( process.env.ENOT_SECRET_KEY )
                }
            } );
        if ( enotInvoiceInfo.data.status === "success" ) {
            participant.isPaid = true;
            await participant.save();

            return true;
        }
    }
    return false;
}
