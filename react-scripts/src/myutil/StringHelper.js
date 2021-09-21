class StringHelper {
    static getUrlLastItem = thePath => {
        return thePath.substring(thePath.lastIndexOf('/')+1);
    };
}

export default StringHelper;