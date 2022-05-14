import React from 'react';
import {Typography} from "@mui/material";
import {useAppSelector} from "../../store/hooks";
import {selectAuth} from "../../store/reducers/authSlice";
import {UserRolesEnum} from "../../constants";
import ChooseModal from "./ChooseModal";

const BrandTitle: React.FC<{isTopBar: boolean}> = ({isTopBar}) => {
    const {user} = useAppSelector(selectAuth)

    return (user!.role === UserRolesEnum.ADMIN || user!.role === UserRolesEnum.GUARD) ? (
            <ChooseModal isTopBar={isTopBar} />
        ) : (
            <Typography variant="subtitle1" sx={{color: isTopBar ? "white" : "black"}}>
                {user!.eventName}
            </Typography>
        )
};

export default BrandTitle;