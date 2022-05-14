import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, SvgIcon, Tooltip} from "@mui/material";
import {VscAccount} from "react-icons/vsc";

const ChangePassword = () => {
    const [openModal, setOpenModal] = useState(false);

    const handleSubmit = async () => {

    }

    return (
        <>
            <Tooltip title="Изменить пароль">
                <IconButton
                    color="inherit"
                    onClick={() => setOpenModal(true)}
                >
                    <SvgIcon>
                        <VscAccount />
                    </SvgIcon>
                </IconButton>
            </Tooltip>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: "100%" } }}
                maxWidth="xs"
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <DialogTitle>Изменение пароля</DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpenModal(false)}>
                        Отмена
                    </Button>
                    <Button onClick={handleSubmit}>Ок</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ChangePassword;