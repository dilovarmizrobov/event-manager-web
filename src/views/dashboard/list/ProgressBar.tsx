import * as React from 'react';
import Typography from '@mui/material/Typography';
import {Grid} from "@mui/material";
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {styled} from "@mui/material/styles";
import {IProgress} from "../../../models/Dashboard";

const Text = styled('p')(({ theme }) => ({
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 18,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
}))

const Square = styled('div')(({theme}) => ({
    width: '15px',
    height: '15px',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1)
}))

const ProgressBar: React.FC<{progress: IProgress}> = ({progress}) => {
    let percentage = Number(((100 * progress.attended)/(progress.attended + progress.absent)).toFixed());
    isNaN(percentage) && (percentage = 0)

    return (
        <React.Fragment>
            <Typography variant={"h5"}>Загруженность</Typography>
            <Grid container spacing={3} sx={{justifyContent: "space-between", p:2}}>
                <Grid item style={{ width: 150, height: 150 }}>
                        <CircularProgressbar value={percentage} text={percentage + `%`} />
                </Grid>
                <Grid item>
                    <Grid container spacing={3}>
                        <Grid item>
                            <Typography color="text.primary">
                                Общее кол - во
                            </Typography>
                            <Text sx={{color:'#3380FF'}}>
                                {progress.attended + progress.absent}
                            </Text>
                        </Grid>
                    </Grid>
                    {/*Second text*/}
                    <Grid container spacing={3}>
                        <Grid item>
                            <Typography variant={"subtitle2"} color="text.primary">
                                Присутствовали
                            </Typography>
                            <Text sx={{color: "#3380FF"}} >
                                {progress.attended}
                            </Text>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={3} py={1} justifyContent={"space-evenly"}>
                <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                    <Square sx={{backgroundColor:'#3380FF'}} />
                    <span style={{color:'#3380FF', fontSize: 12}}>Присутствовали</span>
                </Grid>
                <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                    <Square sx={{backgroundColor: "#00C4DF"}} />
                    <span style={{color: "#00C4DF", fontSize: 12}}>Отсутствовали</span>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default ProgressBar;
