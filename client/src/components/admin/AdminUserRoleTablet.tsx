import React from 'react';
import {getFile} from "../../functions/getFile";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {NavLink} from "react-router-dom";
import StateSelect from "../base/StateSelect";
import {IUser} from "../../StoreTypes";

const AdminUserRoleTablet = ({user, setRole}: {user: IUser, setRole: (user: IUser, role: 'ADMIN' | 'USER') => void}) => {
    return (
        <div className={`team__tablet`}>
            <div className="rating__team-flex">
                <div className="rating__team-images">
                    <img src={user?.avatar ? getFile(user.avatar) : DefaultUserPic} alt="nickname"/>
                </div>
                <div className="rating__team-nicks">
                    <div className="bold flex">
                        <NavLink to={`/profile/${user.nickname}`}>{user.nickname}</NavLink>
                    </div>
                </div>
            </div>
            <StateSelect
                options={[
                    {
                        value: 'USER',
                        text: 'USER'
                    },
                    {
                        value: 'ADMIN',
                        text: 'ADMIN'
                    }
                ]}
                setValue={(role) => setRole(user, role)}
                text={user.role}
            />
        </div>
    );
};

export default AdminUserRoleTablet;