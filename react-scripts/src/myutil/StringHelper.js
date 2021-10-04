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
}

export default StringHelper;