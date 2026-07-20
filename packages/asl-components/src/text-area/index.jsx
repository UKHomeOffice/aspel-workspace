import { TextArea as BaseTextArea } from '@ukhomeoffice/react-components';
import { describedByIds, describeChildOfType } from '../aria-describedby';

// ASL-5082: associate the <textarea> with its hint AND error via aria-describedby.
class TextArea extends BaseTextArea {
    render() {
        return describeChildOfType(super.render(), 'textarea', describedByIds(this.id(), this.props));
    }
}

export default TextArea;
