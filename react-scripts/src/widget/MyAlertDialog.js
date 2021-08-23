import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';

const SlideTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FadeTransition = React.forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />;
});


const MyAlertDialog = props => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [useTransition, setUseTransition] = React.useState(true);
    const [useClose, setUseClose] = React.useState(true);

    React.useEffect(() => {
        setOpen(props.open);
        setLoading(props.loading);
        setUseTransition(props.useTransition);
        setUseClose(props.useClose);
    }, [props.open, props.loading]);

    const handleClose = () => {
        setOpen(false);
        props.onClosed && props.onClosed();
    };

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={useTransition ? SlideTransition : FadeTransition}
                keepMounted
                // onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                {
                    props.title && <DialogTitle id="alert-dialog-slide-title">{props.title}</DialogTitle>
                }
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {props.content}
                    </DialogContentText>
                    {
                        loading && <LinearProgress />
                    }
                </DialogContent>
                <DialogActions>
                    {
                        useClose &&
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
};

MyAlertDialog.propTypes = {
    open: PropTypes.bool,
    loading: PropTypes.bool,
    useTransition: PropTypes.bool,
    useClose: PropTypes.bool,
    title: PropTypes.any,
    content: PropTypes.any,
    onClosed: PropTypes.func,
};

export default MyAlertDialog;