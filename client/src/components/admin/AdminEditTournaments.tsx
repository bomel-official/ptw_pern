import React from 'react';
import {AdminTournamentsList} from "./AdminTournamentsList";
import {__} from "../../multilang/Multilang";

const AdminEditTournaments = () => {
    return (
        <div>
            <h2 className="profile__heading mb12 pt64">{__('Редактировать турниры')}</h2>
            <AdminTournamentsList columns={2}/>
        </div>
    );
};

export default AdminEditTournaments;