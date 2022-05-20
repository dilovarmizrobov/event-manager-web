import React from 'react';
import {styled} from "@mui/material/styles";
import {Grid} from "@mui/material";

const Root = styled('div')((theme) => ({
    width: '210mm',
    height: '297mm',
    display: 'flex',
    alignItems: 'center',
    '& .badge-item-wrap': {
        display: 'flex',
        justifyContent: 'center',
    },
    '& .badge-item': {
        width: '74mm',
        height: '105mm',
        position: 'relative'
    },
    '& .badge-item > img': {
        position: "absolute",
        top: 0,
        width: '100%'
    },
    '& .badge-item-main': {
        position: "absolute",
        top: '45mm',
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
    },
    '& .badge-item-photo': {
        width: '14.05mm',
        height: '19.09mm',
        marginRight: '3mm'
    },
    '& .badge-item-qrcode': {
        marginTop: '6mm',
        width: '14.08mm',
        height: '14.35mm',
        marginRight: '6mm'
    },
    '& .badge-item-qrcode img': {
        width: '100%'
    },
    '& .badge-item-name': {
        height: '19.09mm',
        width: '1mm',
        color: '#2CA5D9',
    },
    '& .badge-item-country': {
        marginTop: '6mm',
        height: '14.35mm',
        color: '#ED3237',
    },
    '& .text': {
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'Arial Rounded MT Bold',
    }
}))

const Badge = () => {
    const item = (
        <div className="badge-item-wrap">
            <div className="badge-item">
                <img src="/badge/bg.jpg"/>
                <div className="badge-item-main">
                    <div>
                        <div className='badge-item-photo'>photo</div>
                        <div className='badge-item-qrcode'>
                            <img src="/badge/qrcode.png"/>
                        </div>
                    </div>
                    <div>
                        <div className='badge-item-name text'>Dilshod Mizrobov</div>
                        <div className='badge-item-country text'>Tajikistan</div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <>
            <Root>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                </Grid>
            </Root>
            <Root>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                </Grid>
            </Root>
            <Root>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                </Grid>
            </Root>
            <Root>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                </Grid>
            </Root>
            <Root>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                    <Grid item>
                        {item}
                    </Grid>
                </Grid>
            </Root>
        </>
    );
};

export default Badge;