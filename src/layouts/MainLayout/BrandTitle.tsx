import React from 'react';
import {Typography} from "@mui/material";
import {useAppSelector} from "../../store/hooks";
import {selectAuth} from "../../store/reducers/authSlice";
import {UserRolesEnum} from "../../constants";

const BrandTitle: React.FC<{isTopBar: boolean}> = ({isTopBar}) => {
    const {user} = useAppSelector(selectAuth)

    return (
        <>
            <Typography variant="h6" sx={{color: isTopBar ? "white" : "black", }}>
                {
                    user!.role === UserRolesEnum.ADMIN ? user!.event!.name
                        : (user!.role === UserRolesEnum.GUARD ? user!.location!.name : user!.eventName)
                }
            </Typography>
        </>
    )
};

export default BrandTitle;