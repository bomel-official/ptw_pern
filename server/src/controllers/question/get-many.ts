import { Question } from "@core";
import { NextFunction, Request, Response } from "express";

export async function getMany( req: Request, res: Response,
                               next: NextFunction ) {
    const rows = await Question.findAll();
    return res.json( { rows } );
}
