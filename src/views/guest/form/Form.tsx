import React from 'react';
import {IGuest} from "../../../models/IGuest";

const Form: React.FC<{guest?: IGuest}> = ({guest}) => {

    const initialValues: IGuest = {
        fullName: guest?.fullName || '',
        passport: guest?.passport || '',
        email: guest?.email || '',
        type: guest?.type || '',
        countryId: guest?.countryId || 0,
        locations: guest?.locations || [],
    }

    return (
        <div>
            
        </div>
    );
};

export default Form;