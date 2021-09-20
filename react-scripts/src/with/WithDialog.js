import React from 'react';
import MyAlertDialog from "widget/MyAlertDialog";

const WithDialog = WrappedComponent => {
    const Component = props => {
        const [isDialogOpened, setDialogOpened] = React.useState(false);    
        const [dialogContent, setDialogContent] = React.useState(<div/>);
        const [dialogTitle, setDialogTitle] = React.useState("");
        const [isLoading, setLoading] = React.useState(false);
        const [useCloseBtn, setUseCloseBtn] = React.useState(true);
        
        const showErrorDialog = (content) => {
            setDialogOpened(true);
            setUseCloseBtn(true);
            setLoading(false);
            setDialogContent(<div>Error Content<br/>{`${content}`}<br/><br/>{`If problem is continued, please contract to developer`} </div>);
            setDialogTitle("Error occured");
        };

        const showInfoDialog = (content) => {
            setDialogOpened(true);
            setUseCloseBtn(true);
            setLoading(false);
            setDialogContent(<div>{content}</div>);
            setDialogTitle("Information");
        };

        const showDialog = (title, content) => {
            setDialogOpened(true);
            setUseCloseBtn(true);
            setLoading(false);
            setDialogTitle(title);
            setDialogContent(content);
        };

        const showLoadingDialog = (title, content) => {
            setDialogOpened(true);
            setUseCloseBtn(false);
            setLoading(true);
            setDialogTitle(title);
            setDialogContent(content);
        };

        const closeDialog = () => {
            setDialogOpened(false);
        };

        const combinedProps = {
            ...props,
            showDialog,
            showErrorDialog,
            showInfoDialog,
            showLoadingDialog,
            closeDialog,
        };

        return (
            <React.Fragment>
                <WrappedComponent {...combinedProps}/>
                <MyAlertDialog open={isDialogOpened} loading={isLoading} title={dialogTitle} content={dialogContent} useClose={useCloseBtn} onClosed={()=>{setDialogOpened(false);}}/>
            </React.Fragment>
        );
    };

    return Component;
};

export default WithDialog;