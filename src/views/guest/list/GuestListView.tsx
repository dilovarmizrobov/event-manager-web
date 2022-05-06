import React from 'react';
import Header from "./Header";
import {
    Box,
    Card, Checkbox,
    Container, FormControl, IconButton,
    InputAdornment, InputLabel, MenuItem, Select,
    SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    TextField, Toolbar, Tooltip, Typography
} from "@mui/material";
import Page from "../../../components/Page";
import {styled} from "@mui/material/styles";
import {FiSearch as FiSearchIcon, FiPrinter, FiEdit, FiTrash} from "react-icons/fi";
import PerfectScrollbar from "react-perfect-scrollbar";
import { alpha } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))


//////////////////////////
interface Data {
    id: number;
    calories: number;
    carbs: number;
    fat: number;
    name: string;
    protein: number;
}

function createData(
    id: number,
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
): Data {
    return {
        id,
        name,
        calories,
        fat,
        carbs,
        protein,
    };
}

const rows = [
    createData(1, 'Cupcake', 305, 3.7, 67, 4.3),
    createData(2, 'Donut', 452, 25.0, 51, 4.9),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0),
    createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
    createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
    createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
    createData(9, 'KitKat', 518, 26.0, 65, 7.0),
    createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
    createData(11, 'Marshmallow', 318, 0, 81, 2.0),
    createData(12, 'Nougat', 360, 19.0, 9, 37.0),
    createData(13, 'Oreo', 437, 18.0, 63, 4.0),
];


const EnhancedTableToolbar: React.FC<{numSelected: number}> = ({numSelected}) => {
    return (
        <Toolbar
            sx={{
                py: 3,
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {
                numSelected > 0 ? (
                    <>
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            color="inherit"
                            variant="subtitle1"
                            component="div"
                        >
                            {numSelected} выбрано
                        </Typography>
                        <Tooltip title="Печать">
                            <IconButton>
                                <FiPrinter />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <Box sx={{ flex: '1 1 100%'}}>
                            <TextField
                                sx={{width: 400}}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SvgIcon
                                                fontSize="small"
                                                color="action"
                                            >
                                                <FiSearchIcon/>
                                            </SvgIcon>
                                        </InputAdornment>
                                    )
                                }}
                                // onChange={handleQueryChange}
                                placeholder="Поиск"
                                // value={query}
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{mr: 2}}>
                            <FormControl sx={{ minWidth: 120 }} size="small">
                                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    // value={age}
                                    label="Age"
                                    // onChange={handleChange}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </>
                )
            }
        </Toolbar>
    );
};

const GuestListView = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [selected, setSelected] = React.useState<readonly number[]>([]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Root>
            <Page title="Гости" />
            <Container maxWidth="xl">
                <Header />
                <Box mt={3}>
                    <Card>
                        <PerfectScrollbar>
                            <Box minWidth={750} sx={{ mb: 2 }}>
                                <EnhancedTableToolbar numSelected={selected.length} />
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        indeterminate={selected.length > 0 && selected.length < rows.length}
                                                        checked={rows.length > 0 && selected.length === rows.length}
                                                        onChange={handleSelectAllClick}
                                                    />
                                                </TableCell>
                                                <TableCell>Dessert (100g serving)</TableCell>
                                                <TableCell>Calories</TableCell>
                                                <TableCell>Fat (g)</TableCell>
                                                <TableCell>Carbs (g)</TableCell>
                                                <TableCell>Protein (g)</TableCell>
                                                <TableCell/>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                rows.map(row => {
                                                    const isItemSelected = isSelected(row.id)

                                                    return (
                                                        <TableRow hover key={row.id} selected={isItemSelected}>
                                                            <TableCell padding="checkbox">
                                                                <Checkbox color="primary" checked={isItemSelected} onClick={(event) => handleClick(event, row.id)}/>
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" padding="none">
                                                                {row.name}
                                                            </TableCell>
                                                            <TableCell>{row.calories}</TableCell>
                                                            <TableCell>{row.fat}</TableCell>
                                                            <TableCell>{row.carbs}</TableCell>
                                                            <TableCell>{row.protein}</TableCell>
                                                            <TableCell style={{ width: 165 }}>
                                                                <IconButton size="large">
                                                                    <FiPrinter size={20}/>
                                                                </IconButton>
                                                                <IconButton size="large">
                                                                    <FiEdit size={20} />
                                                                </IconButton>
                                                                <IconButton size="large">
                                                                    <FiTrash size={20} />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                            {emptyRows > 0 && (
                                                <TableRow
                                                    style={{
                                                        height: 53 * emptyRows,
                                                    }}
                                                >
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </PerfectScrollbar>
                        <TablePagination
                            component="div"
                            count={rows.length}
                            labelRowsPerPage={'Строк на странице:'}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[5, 10, 25]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                        />
                    </Card>
                </Box>
            </Container>
        </Root>
    );
};

export default GuestListView;