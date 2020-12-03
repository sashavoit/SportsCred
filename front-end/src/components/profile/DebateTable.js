import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import NativeSelect from '@material-ui/core/NativeSelect';
//import { makeStyles, useTheme } from '@material-ui/core/styles';


const log = console.log
const styles = theme => ({
    tableHeader: {
        fontSize: "20px"
    },
    tableCell: {
        fontSize: "24px"
    },
    tableTime: {
        fontSize: "20px"
    }
});



function TablePaginationActions(props) {
    const { count, page, rowsPerPage, onChangePage } = props;
    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div style={{ flexShrink: 0 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {/* {classes.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />} */}
                <FirstPageIcon />
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {/* {classes.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />} */}
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {/* {classes.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />} */}
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {/* {classes.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />} */}
                <LastPageIcon />
            </IconButton>
        </div>
    );
}
TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};


class PostsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            acsList: [],
            page: 0,
            rowsPerPage: 5,
        }
    }
    //const classes = useStyles();
    componentDidMount() {
        //const postId
        const url = '/acsHistory/' + "soso@gmail.com"; //http://localhost:3001
        const comment_request = new Request(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
            }
        });
        fetch(comment_request)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    console.log('could not get user acs');
                }
            })
            .then(res => {
                this.setState({
                    acsList: [1,2,3],
                })
            })
            .catch((error) => {
                console.log(error)
            });
    }
    // log("nnv")
    // log(this.props.user.email)

    render() {
        //getAcsHistory();
        const { classes } = this.props;
        const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.acsList.length - this.state.page * this.state.rowsPerPage);
        const handleChangePage = (event, newPage) => {
            this.setState({ page: newPage })
        };
        const handleChangeRowsPerPage = (event) => {
            this.setState({
                rowsPerPage: parseInt(event.target.value, 10),
                page: 0,
            })
        };
        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableCell}>CSGAN-132 -> Sprint 4</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(this.state.rowsPerPage > 0
                            ? this.state.acsList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                            : this.state.acsList // []
                        ).map((row) => (
                            <TableRow>
                                <TableCell className={classes.tableCell} component="th" scope="row">
                                    &nbsp;
                                </TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            // <TableRow style={{ height: 53 * emptyRows }}>
                            Array(emptyRows).fill(null).map((row) => (
                                <TableRow>
                                    <TableCell className={classes.tableCell} component="th" scope="row">
                                        &nbsp;
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={this.state.acsList.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        );
    }
}
PostsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PostsTable);