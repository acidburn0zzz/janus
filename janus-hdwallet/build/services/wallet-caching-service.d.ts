import * as indCommon from '@manosamy/janus-common';
export declare class WalletCachingService {
    private _map;
    saveOneTimeAddress(oneTimeAddress: indCommon.OneTimeAddressData): void;
    getOneTimeAddress(guid: string): indCommon.OneTimeAddressData;
    isOurEntity(guid: string): boolean;
}
