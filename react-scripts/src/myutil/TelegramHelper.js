import {environmentConfig} from 'myconfig';
import axios from "axios";

const TelegramHelper = (function() {
 
  var instance;
 
  function createInstance(){
    const {TELE_TOKEN, TELE_CHAT_ID} = environmentConfig;
    return {
      sendMessage: function(msg) {
        axios.get(`https://api.telegram.org/bot${TELE_TOKEN}/sendmessage?chat_id=${TELE_CHAT_ID}&text=${msg}`);
      },
    }
  }
 
  return {
    getInstance: function(){
      if(!instance){
        instance = createInstance();
      }
      return instance;
    }
  }
})();
 
export default TelegramHelper;