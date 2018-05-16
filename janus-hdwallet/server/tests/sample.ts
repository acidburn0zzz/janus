import * as indCommon from '@manosamy/janus-common';

const utils = new indCommon.Utils();

export class Sample {

    public doSomething(work: string) {
        utils.writeFormattedMessage("Doing Something", work);
    }
}