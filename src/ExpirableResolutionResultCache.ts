import { IResolutionResultCache } from "@polywrap/client-js";
import { Uri, Result, UriPackageOrWrapper } from "@polywrap/core-js";

// $start: ExpirableResolutionResultCache
/**
 * A implementation of ExpirableResolutionResultCache
 * */
export class ExpirableResolutionResultCache<TError = unknown>
  implements IResolutionResultCache<TError> /* $ */ {
  private _map: Map<string, Result<UriPackageOrWrapper, TError>> = new Map();
  private _timeMap: Map<string, number> = new Map<string, number>();

  constructor(private readonly config: Record<string, number>) {
  }

  // $start: ResolutionResultCache-get
  /** get a Result from the cache, given its URI index */
  get(uri: Uri): Result<UriPackageOrWrapper, TError> | undefined /* $ */ {
    const autority = uri.authority;

    if(!this.config[autority]) {
      return this._map.get(uri.uri);
    } else {
      const lastTime = this._timeMap.get(uri.uri);

      if(!lastTime) {
        return undefined;
      }

      if((new Date().getTime() - lastTime) > this.config[autority]) {
        this._timeMap.delete(uri.uri);
        return undefined;
      } else {
        return this._map.get(uri.uri);
      }
    }
  }


    // $start: ResolutionResultCache-set
  /** add a Result to the cache, indexed by a URI */
  set(uri: Uri, result: Result<UriPackageOrWrapper, TError>): void /* $ */ {
    const autority = uri.authority;

    if(!this.config[autority]) {
      this._map.set(uri.uri, result);
    } else {
      const lastTime = this._timeMap.get(uri.uri) ?? 0;

      if((new Date().getTime() - lastTime) > this.config[autority]) {
        this._timeMap.set(uri.uri, new Date().getTime());
        this._map.set(uri.uri, result); 
      } 
    }
  }
}
