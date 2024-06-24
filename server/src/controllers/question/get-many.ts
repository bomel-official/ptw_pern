import { QuestionRepository } from "@core";
import { NextFunction, Request, Response } from "express";

export async function getMany( req: Request, res: Response, next: NextFunction ) {
    const rows = await QuestionRepository.findAll();
    return res.json( { rows } );
}
