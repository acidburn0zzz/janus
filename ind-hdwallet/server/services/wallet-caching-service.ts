import * as indCommon from 'ind-common';


/*
    This is a reference caching service used to cache the one time wallets generated. If the wallet service is
    restarted it can be read from the cache to the local data structures
*/
export class WalletCachingService {
    private _map: Map<string, indCommon.OneTimeAddressData> = new Map<string, indCommon.OneTimeAddressData>();

    /*
        saves the one time address data in the local cache and the backing db
    */
    public saveOneTimeAddress(oneTimeAddress: indCommon.OneTimeAddressData) {
        (new indCommon.Utils()).writeFormattedMessage("saving one time address for ", oneTimeAddress.guid);

        //save the one time address data in the local cache
        this._map[oneTimeAddress.guid] = oneTimeAddress;

        //TODO
        //save the address data in the backing db
    }

    /*
        reads and returns the onetime address, if exists from the local cache. If not
        returns null
    */
    public getOneTimeAddress(guid: string): indCommon.OneTimeAddressData {

        (new indCommon.Utils()).writeFormattedMessage("requesting one time address for ", guid);

        return this._map[guid];
    }

    /*
        checks if the specified guid exists in our cache with an associated one time address
        returns true if exists, false otherwise
    */
    public isOurEntity(guid: string): boolean {

        return true;
    }

    //private members

}