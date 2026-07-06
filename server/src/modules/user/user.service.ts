import { User, UserRepository } from "@core";
import { ApiError } from "@error";
import { genJwt } from "@modules/auth";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { uploadImage } from "../../controllers/libs";
import { CreateUserDto, UpdateUserDto } from "./user.dto";

export const userService = {
    async search( s: unknown, friendOf: unknown ): Promise<{ count: number; rows: User[] }> {
        const capitan = (friendOf && typeof friendOf === "string" && friendOf !== "null")
            ? await UserRepository.findByPk( friendOf )
            : null;

        const { count, rows } = await UserRepository.findAndCountAll( {
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { nickname: { [Op.iLike]: `%${ s }%` } },
                            { activisionId: { [Op.iLike]: `%${ s }%` } },
                        ],
                    },
                    capitan ? { id: { [Op.in]: capitan.friends } } : {},
                ],
            },
            limit: 10,
        } );
        return { count, rows };
    },

    async getAdmins(): Promise<User[]> {
        const { rows } = await UserRepository.findAndCountAll( { where: { role: "ADMIN" } } );
        return rows;
    },

    getById( id: string ): Promise<User | null> {
        return UserRepository.findByPk( id );
    },

    getByNickname( nickname: string ): Promise<User | null> {
        return UserRepository.findOne( { where: { nickname } } );
    },

    async create( dto: CreateUserDto ): Promise<string> {
        const { email, password, repeatPassword, nickname } = dto;
        if ( !nickname ) {
            throw ApiError.badRequest( "Поле никнейм не заполнено" );
        }
        if ( password.length < 4 ) {
            throw ApiError.badRequest( "Длина пароля меньше 4 символов" );
        }
        if ( nickname.length < 4 ) {
            throw ApiError.badRequest( "Длина никнейма меньше 4 символов" );
        }
        if ( !nickname.match( /^[0-9A-Z]{4,}$/i ) ) {
            throw ApiError.badRequest( "Поле никнейм имеет недопустимые символы" );
        }
        if ( !email.match( /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/i ) ) {
            throw ApiError.badRequest( "Некоректный email" );
        }

        const emailCandidate = await UserRepository.findOne( {
            where: { email: email.trim() }, attributes: [ "id" ],
        } );
        if ( emailCandidate ) {
            throw ApiError.badRequest( "Пользователь с таким email уже существует" );
        }
        const nicknameCandidate = await UserRepository.findOne( {
            where: { nickname: nickname.trim() }, attributes: [ "id" ],
        } );
        if ( nicknameCandidate ) {
            throw ApiError.badRequest( "Пользователь с таким никнеймом уже существует" );
        }
        if ( password !== repeatPassword ) {
            throw ApiError.badRequest( "Пароли не совпадают" );
        }

        const hashPassword = await bcrypt.hash( password, 5 );
        const newUser = await UserRepository.create( {
            email: email.trim(), password: hashPassword, nickname: nickname.trim(),
        } );
        return genJwt( {
            id: newUser.id, email: newUser.email, role: newUser.role, nickname: newUser.nickname,
        } );
    },

    /** Returns { ok } — false with a message when the old password is wrong. */
    async update( dto: UpdateUserDto ): Promise<{ ok: true } | { ok: false; text: string }> {
        const { id, nickname, password, oldPassword, avatar } = dto;

        const user = await UserRepository.findByPk( id );
        if ( !user ) {
            throw ApiError.badRequest( "Пользователь не найден" );
        }

        const nicknameCandidate = await UserRepository.findOne( {
            where: { nickname: nickname.trim() }, attributes: [ "id" ],
        } );
        if ( nicknameCandidate && nicknameCandidate.id !== parseInt( id ) ) {
            throw ApiError.badRequest( "Пользователь с таким никнеймом уже существует" );
        }

        user.avatar = await uploadImage( avatar, { width: 240, height: 240 } );
        user.nickname = nickname ? nickname.trim() : user.nickname;
        user.activisionId = dto.activisionId || user.activisionId;
        user.vk = dto.vk || user.vk;
        user.youtube = dto.youtube ? dto.youtube.replace( "https://www.youtube.com/", "" ) : user.youtube;
        user.steam = dto.steam || user.steam;
        user.twitch = dto.twitch ? dto.twitch.replace( "https://www.twitch.tv/", "" ) : user.twitch;
        user.twitter = dto.twitter ? dto.twitter.replace( "https://twitter.com/", "" ) : user.twitter;
        user.platform = (dto.platform as User["platform"]) || user.platform;
        user.device = (dto.device as User["device"]) || user.device;

        if ( password ) {
            const hashPassword = await bcrypt.hash( password, 5 );
            if ( oldPassword && bcrypt.compareSync( oldPassword, user.password ) ) {
                user.password = hashPassword;
            } else {
                return { ok: false, text: "Старый пароль введён неверно" };
            }
        }

        await user.save();
        return { ok: true };
    },

    async updateRole( userId: number, role: string ): Promise<void> {
        const user = await UserRepository.findByPk( userId );
        if ( !user ) {
            throw ApiError.badRequest( "Пользователь не найден" );
        }
        user.role = role as User["role"];
        await user.save();
    },
};
