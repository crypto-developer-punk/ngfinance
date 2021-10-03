import React from 'react';
import MyAlertDialog from "widget/MyAlertDialog";
import { 
    ERR_WALLET_IS_NOT_CONNECTED, ERR_LIMIT_LOCKUP_NFT, ERR_UNSKAKING_INPROGRESS,
    ERR_UNSUPPORTED_TOKEN_TYPE, ERR_UNSUPPORTED_CONTRACT_TYPE, ERR_BACKEND_RESPONSE, 
    ERR_RESPONSE_TIMEOUT, ERR_INVALID_WEB3_NETWORK
} from "myconstants";

const WithDialog = WrappedComponent => {
    const Component = props => {
        const [isDialogOpened, setDialogOpened] = React.useState(false);    
        const [dialogContent, setDialogContent] = React.useState(<div/>);
        const [dialogTitle, setDialogTitle] = React.useState("");
        const [isLoading, setLoading] = React.useState(false);
        const [useCloseBtn, setUseCloseBtn] = React.useState(true);
        const [useConfirmBtn, setUseConfirmBtn] = React.useState(false);
        const onConfirmBtnClickedRef = React.useRef({});
        const dialogModeStateRef = React.useRef('close');

        const showErrorDialog = (err) => {
            if (!err.code) {
                console.log(err);
                let content = err.toString() || JSON.stringify(err);
                setDialogOpened(true);
                setUseCloseBtn(true);
                setUseConfirmBtn(false);
                setLoading(false);
                setDialogContent(<div>Error Content<br/>{`${content}`}<br/><br/>{`If problem is continued, please contract to developer`} </div>);
                setDialogTitle("Error occured");
                dialogModeStateRef.current = 'error';
            } else if (err.code === ERR_WALLET_IS_NOT_CONNECTED || err.code === ERR_INVALID_WEB3_NETWORK){
                showInfoDialog(err.msg);
            } else if (err.code === ERR_LIMIT_LOCKUP_NFT) {
                showDialog("You can't unstake your NFT.", err.msg);
            } else if (err.code === ERR_UNSKAKING_INPROGRESS) {
                showDialog("You can't unstake your NFT.", <div>{err.msg}If problem is continued or takes long time, please contract to developer</div>);
            } else if (err.code === 4001) {
                closeDialog();
            } else if (
                err.code === ERR_UNSUPPORTED_TOKEN_TYPE || err.code === ERR_UNSUPPORTED_CONTRACT_TYPE || err.code === ERR_BACKEND_RESPONSE ||
                err.code === ERR_RESPONSE_TIMEOUT
            ) {
                setDialogOpened(true);
                setUseCloseBtn(true);
                setUseConfirmBtn(false);
                setLoading(false);
                console.log(err.msg);
                setDialogContent(<div>Error Content<br/>{`${err.msg}`}<br/><br/>{`If problem is continued, please contract to developer`} </div>);
                setDialogTitle("Error occured");
                dialogModeStateRef.current = 'error';
            }
        };

        const showForceDialog = (content) => {
            setDialogOpened(true);
            setUseCloseBtn(false);
            setUseConfirmBtn(false);
            setLoading(false);
            setDialogContent(<div>{content}</div>);
            setDialogTitle("Information");
            dialogModeStateRef.current = 'force';
        };

        const showInfoDialog = (content) => {
            setDialogOpened(true);
            setUseCloseBtn(true);
            setUseConfirmBtn(false);
            setLoading(false);
            setDialogContent(<div>{content}</div>);
            setDialogTitle("Information");
            dialogModeStateRef.current = 'info';
        };

        const showDialog = (title, content) => {
            setDialogOpened(true);
            setUseCloseBtn(true);
            setUseConfirmBtn(false);
            setLoading(false);
            setDialogTitle(title);
            setDialogContent(content);
            dialogModeStateRef.current = 'default';
        };

        const showLoadingDialog = (title, content) => {
            setDialogOpened(true);
            setUseCloseBtn(false);
            setUseConfirmBtn(false);
            setLoading(true);
            setDialogTitle(title);
            setDialogContent(content);
            dialogModeStateRef.current = 'loading';
        };

        const showConfirmDialog = (title, content, onConfirm) => {
            setDialogOpened(true);
            setUseCloseBtn(true);
            setUseConfirmBtn(true);
            setLoading(false);
            setDialogTitle(title);
            setDialogContent(content);
            onConfirmBtnClickedRef.current = onConfirm;
            dialogModeStateRef.current = 'confirm';
        };

        const closeDialog = () => {
            onConfirmBtnClickedRef.current = 'close';
            setDialogOpened(false);
        };

        const getDialogModeState = () => {
            return dialogModeStateRef.current;            
        };

        const combinedProps = {
            ...props,
            showDialog,
            showErrorDialog,
            showInfoDialog,
            showLoadingDialog,
            closeDialog,
            showConfirmDialog,
            getDialogModeState,
        };

        return (
            <React.Fragment>
                <WrappedComponent {...combinedProps}/>
                <MyAlertDialog 
                    open={isDialogOpened} 
                    loading={isLoading} 
                    title={dialogTitle} 
                    content={dialogContent} 
                    useClose={useCloseBtn} 
                    useConfirm={useConfirmBtn} 
                    onClosed={()=>{setDialogOpened(false);}}
                    onConfirm={()=>{onConfirmBtnClickedRef.current && onConfirmBtnClickedRef.current();}}
                />
            </React.Fragment>
        );
    };

    return Component;
};

export default WithDialog;