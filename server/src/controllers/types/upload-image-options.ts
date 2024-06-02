import { Request } from "express";

export interface UploadImageOptions {
    width?: number;
    height?: number;
    fit?: "cover" | "contain";
}

export type Image = Exclude<Request["files"], null | undefined>[string] | null | undefined;
