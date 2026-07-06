import { Game, TournamentType } from "@constants";
import { CV } from "@core";
import { Request } from "express";
import { uploadImage } from "../../controllers/libs";

function slugify( value: string ): string {
    return value.toLowerCase().trim().replace( / /g, "-" ).replace( /[^\w-]+/g, "" );
}

/**
 * Validates + normalizes the create-tournament payload (multipart form with an
 * optional preview image). Throws ApiError on invalid input.
 */
export async function validateCreateTournament( req: Request ) {
    const previewImg = req.files?.previewImg;
    const filename = await uploadImage( previewImg );

    const title_EU = new CV( req.body.title_EU ).string().val;
    const reqSlug = new CV( req.body.slug ).string().val;
    const slug = reqSlug || slugify( title_EU );

    return {
        previewImg: filename,
        slug,
        game: new CV( req.body.game, { label: "game" } ).string()
            .included( Object.values( Game ) as Game[] ).val,
        type: new CV( req.body.type, { label: "type" } ).string()
            .included( Object.values( TournamentType ) as TournamentType[] ).val,
        twitchChannel: new CV( req.body.twitchChannel, { label: "twitchChannel" } ).string().val,
        dateBegin: new CV( req.body.dateBegin, { label: "dateBegin" } ).string().val,
        dateEnd: new CV( req.body.dateEnd, { label: "dateEnd" } ).string().val,
        maxUsers: new CV( req.body.maxUsers, { label: "maxUsers" } ).number().val,
        playersInTeam: new CV( req.body.playersInTeam, { label: "playersInTeam" } ).number().val,
        participationPrice: new CV( req.body.participationPrice,
            { label: "participationPrice" } ).optional().number().val || 0,
        prizes: new CV( req.body.prizes, { label: "prizes" } ).number().val,
        prize_1: new CV( req.body.prize_1, { label: "prize_1" } ).number().val,
        prize_2: new CV( req.body.prize_2, { label: "prize_2" } ).number().val,
        prize_3: new CV( req.body.prize_3, { label: "prize_3" } ).number().val,
        isRegisterOn: new CV( req.body.isRegisterOn, { label: "isRegisterOn" } ).optional().bool().val,
        title_RU: new CV( req.body.title_RU, { label: "title_RU" } ).string().val,
        title_EU: new CV( req.body.title_EU, { label: "title_EU" } ).string().val,
        descRules_RU: new CV( req.body.descRules_RU, { label: "descRules_RU" } ).string().val,
        descRules_EU: new CV( req.body.descRules_EU, { label: "descRules_EU" } ).string().val,
        descAdditional_RU: new CV( req.body.descAdditional_RU, { label: "descAdditional_RU" } ).string().val,
        descAdditional_EU: new CV( req.body.descAdditional_EU, { label: "descAdditional_EU" } ).string().val,
        format_RU: new CV( req.body.format_RU, { label: "format_RU" } ).string().val,
        format_EU: new CV( req.body.format_EU, { label: "format_EU" } ).string().val,
        participantType: new CV( req.body.participantType, { label: "participantType" } ).string()
            .included( [ "list", "table" ] as const ).val,
    };
}

export type CreateTournamentDto = Awaited<ReturnType<typeof validateCreateTournament>>;

/** Parses the update-tournament payload; resolves the new slug + preview image. */
export async function parseUpdateTournament( req: Request ) {
    const filename = await uploadImage( req.files?.previewImg );
    const slug = req.body.slug ||
        req.body.title_EU.toString().toLowerCase().trim().replace( / /g, "-" ).replace( /[^\w-]+/g, "" );

    return { body: req.body, id: req.body.id, slug, filename };
}
