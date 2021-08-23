import {hoistStatics, compose} from 'recompose';
import WithDialog from './WithDialog';

const composed = hoistStatics(
    compose(
        WithDialog,
    ),
  );
  
export default composed;