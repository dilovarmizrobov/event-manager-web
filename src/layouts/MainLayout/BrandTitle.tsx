import React from 'react';
import {Box} from "@mui/material";
import {useAppSelector} from "../../store/hooks";
import {selectAuth} from "../../store/reducers/authSlice";
import {UserRolesEnum} from "../../constants";

const BrandTitle: React.FC<{isTopBar: boolean}> = ({isTopBar}) => {
    const {user} = useAppSelector(selectAuth)

    return (
        <>
            <Box sx={{color: isTopBar ? "white" : "black", fontSize: '1.2rem'}} textAlign="center">
                {
                    user!.role === UserRolesEnum.ADMIN ? user!.event!.name
                        : (user!.role === UserRolesEnum.GUARD ? user!.location!.name : user!.eventName)
                }
            </Box>
        </>
    )
};

export default BrandTitle;