class StringHelper {
    static getUrlLastItem = thePath => {
        return thePath.substring(thePath.lastIndexOf('/')+1);
    };

    static getElipsedHashAddress = addr => {
        if (!addr || addr.length < 12) {
            return addr;
        }
        const prefix = addr.substring(0, 4);
        const postfix = addr.substring(addr.length-4);
        return prefix + "..." + postfix;
    };

    static isMp4Url = (url) => {
        const extension = url.split(/[#?]/)[0].split('.').pop().trim();
    
        if (extension === "mp4") {
          return true;
        }
        return false;
    };

    static uuidv4 = () => {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };
}

export default StringHelper;