import { InvoiceRepository, ParticipantRepository } from "@core";
import { getEnv } from "@libs";
import axios from "axios";
import { WhereOptions } from "sequelize";

export async function yookassaGetStatus( participantId: number ) {
    const participant = await ParticipantRepository.findByPk( participantId );
    if ( !participant ) {
        return false;
    }

    const invoices = await InvoiceRepository.findAll( {
        where: {
            participantId: participant.id
        }
    } );

    for ( const invoice of invoices ) {
        const { data: yookassaInvoiceInfo } = await axios.get(
            `https://api.yookassa.ru/v3/payments/${ invoice.enotId }`, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Encoding": "application/json",
                    "Accept": "application/json",
                },
                auth: {
                    username: getEnv( process.env.YOOKASSA_SHOP_ID ),
                    password: getEnv( process.env.YOOKASSA_SECRET_KEY ),
                }
            } );
        if ( yookassaInvoiceInfo.status === "succeeded" &&
            yookassaInvoiceInfo.isPaid === true ) {
            participant.isPaid = true;
            await participant.save();

            return true;
        }
    }
    return false;
}
