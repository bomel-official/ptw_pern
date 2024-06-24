import {
    Invoice,
    InvoiceRepository,
    Participant,
    ParticipantRepository,
    TournamentRepository
} from "@core";
import { getEnv } from "@libs";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function yookassaCreateInvoice( participantId: number ): Promise<{ invoice: Invoice, participant: Participant }> {
    const participant = await ParticipantRepository.findByPk( participantId );
    if ( !participant ) {
        throw new Error( "Ошибка платёжной системы" );
    }

    const tournament = await TournamentRepository.findByPk( participant.tournamentId );
    if ( !tournament ) {
        throw new Error( "Ошибка платёжной системы" );
    }

    const newInvoice = await InvoiceRepository.create( {
        amount: tournament.participationPrice,
        currency: "RUB",
    } );

    const { data: yookassaInvoice } = await axios.post(
        "https://api.yookassa.ru/v3/payments", {
            amount: {
                currency: newInvoice.currency,
                value: tournament.participationPrice
            },
            capture: true,
            confirmation: {
                type: "redirect",
                return_url: `${ getEnv(
                    process.env.CLIENT_URL ) }/tournament/${ tournament.slug }`,
            },
            description: `Participation on ${ tournament.title_EU }`,
            metadata: {
                order_id: "invoice-" + JSON.stringify( newInvoice.id ),
            }
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept-Encoding": "application/json",
                "Accept": "application/json",
                "Idempotence-Key": uuidv4(),
            },
            auth: {
                username: getEnv( process.env.YOOKASSA_SHOP_ID ),
                password: getEnv( process.env.YOOKASSA_SECRET_KEY ),
            }
        } );

    newInvoice.enotId = yookassaInvoice.id;
    newInvoice.url = yookassaInvoice.confirmation.confirmation_url;
    newInvoice.participantId = participant.id;
    newInvoice.expired = tournament.dateEnd;
    participant.invoiceUrl = yookassaInvoice.confirmation.confirmation_url;
    participant.invoiceId = newInvoice.id;

    await participant.save();
    await newInvoice.save();

    return { invoice: newInvoice, participant } as const;
}
